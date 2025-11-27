'use client';

import { useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes, EditorState, LexicalEditor as LexicalEditorType } from 'lexical';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { editorTheme } from './lexical/theme';
import { editorNodes } from './lexical/nodes';
import ToolbarPlugin from './lexical/ToolbarPlugin';

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  minHeight?: string;
}

// Plugin to initialize content
function InitialContentPlugin({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const root = $getRoot();
        if (root.getTextContent() === '') {
          // Parse HTML content
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialContent, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          root.clear();
          $insertNodes(nodes);
        }
      });
    }
  }, [editor, initialContent]);

  return null;
}

// Plugin to handle onChange
function OnChangePluginWrapper({ onChange }: { onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (onChange) {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onChange(html);
        });
      }
    },
    [editor, onChange]
  );

  return <OnChangePlugin onChange={handleChange} />;
}

export default function LexicalEditor({
  initialContent,
  onChange,
  placeholder = 'Beginnen Sie zu schreiben...',
  autoFocus = false,
  minHeight = '300px',
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'DZPhotoEditor',
    theme: editorTheme,
    nodes: editorNodes,
    onError: (error: Error) => {
      console.error('Lexical Error:', error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="lexical-container border border-white/10 rounded-lg overflow-hidden bg-[#141414]">
        <ToolbarPlugin />
        <div className="relative" style={{ minHeight }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none p-4 text-white prose prose-invert max-w-none"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <HorizontalRulePlugin />
          <TabIndentationPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <InitialContentPlugin initialContent={initialContent} />
          <OnChangePluginWrapper onChange={onChange} />
          {autoFocus && <AutoFocusPlugin />}
        </div>
      </div>
    </LexicalComposer>
  );
}

