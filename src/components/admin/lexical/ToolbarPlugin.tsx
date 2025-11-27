'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, $isListNode, ListNode } from '@lexical/list';
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createCodeNode } from '@lexical/code';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { mergeRegister, $getNearestNodeOfType } from '@lexical/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Minus,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const blockTypeToIcon: Record<string, React.ReactNode> = {
  paragraph: <Type className="w-4 h-4" />,
  h1: <Heading1 className="w-4 h-4" />,
  h2: <Heading2 className="w-4 h-4" />,
  h3: <Heading3 className="w-4 h-4" />,
  bullet: <List className="w-4 h-4" />,
  number: <ListOrdered className="w-4 h-4" />,
  quote: <Quote className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
};

const blockTypeToName: Record<string, string> = {
  paragraph: 'Absatz',
  h1: 'Überschrift 1',
  h2: 'Überschrift 2',
  h3: 'Überschrift 3',
  bullet: 'Aufzählung',
  number: 'Nummerierung',
  quote: 'Zitat',
  code: 'Code',
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type === 'bullet' ? 'bullet' : 'number');
        } else {
          const type = element.getType();
          if (type === 'heading') {
            const headingNode = element as any;
            setBlockType(headingNode.getTag());
          } else {
            setBlockType(type);
          }
        }
      }

      // Check for links
      const node = anchorNode;
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
    }
  }, [activeEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt('URL eingeben:', 'https://');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#0A0A0A]">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
        className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
        className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Block Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white hover:bg-white/10">
            {blockTypeToIcon[blockType] || <Type className="w-4 h-4" />}
            <span className="text-sm">{blockTypeToName[blockType] || 'Absatz'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#141414] border-white/10">
          <DropdownMenuItem onClick={formatParagraph} className="text-white hover:bg-white/10 cursor-pointer">
            <Type className="w-4 h-4 mr-2" /> Absatz
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h1')} className="text-white hover:bg-white/10 cursor-pointer">
            <Heading1 className="w-4 h-4 mr-2" /> Überschrift 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h2')} className="text-white hover:bg-white/10 cursor-pointer">
            <Heading2 className="w-4 h-4 mr-2" /> Überschrift 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading('h3')} className="text-white hover:bg-white/10 cursor-pointer">
            <Heading3 className="w-4 h-4 mr-2" /> Überschrift 3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} className="text-white hover:bg-white/10 cursor-pointer">
            <List className="w-4 h-4 mr-2" /> Aufzählung
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} className="text-white hover:bg-white/10 cursor-pointer">
            <ListOrdered className="w-4 h-4 mr-2" /> Nummerierung
          </DropdownMenuItem>
          <DropdownMenuItem onClick={formatQuote} className="text-white hover:bg-white/10 cursor-pointer">
            <Quote className="w-4 h-4 mr-2" /> Zitat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={formatCode} className="text-white hover:bg-white/10 cursor-pointer">
            <Code className="w-4 h-4 mr-2" /> Code-Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isBold && 'bg-white/10 text-white')}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isItalic && 'bg-white/10 text-white')}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isUnderline && 'bg-white/10 text-white')}
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isStrikethrough && 'bg-white/10 text-white')}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isCode && 'bg-white/10 text-white')}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Link */}
      <Button
        variant="ghost"
        size="icon"
        onClick={insertLink}
        className={cn('text-gray-400 hover:text-white hover:bg-white/10', isLink && 'bg-white/10 text-[#D4AF37]')}
      >
        <Link2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <AlignJustify className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Horizontal Rule */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
}

