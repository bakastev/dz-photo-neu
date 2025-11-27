'use client';

import TextField from '@/components/admin/forms/TextField';

interface BlogContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  maxPosts: number;
  viewAllText: string;
  badge: {
    text: string;
    icon: string;
  };
}

interface Props {
  content: BlogContent;
  onChange: (content: BlogContent) => void;
}

export default function BlogSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof BlogContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const updateBadge = (field: string, value: string) => {
    update('badge', { ...content.badge, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Titel"
          name="sectionTitle"
          value={content.sectionTitle || ''}
          onChange={(val) => update('sectionTitle', val)}
        />
        <TextField
          label="Titel (Gold)"
          name="sectionTitleHighlight"
          value={content.sectionTitleHighlight || ''}
          onChange={(val) => update('sectionTitleHighlight', val)}
        />
      </div>

      <TextField
        label="Beschreibung"
        name="description"
        value={content.description || ''}
        onChange={(val) => update('description', val)}
        multiline
        rows={2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Max. Blog Posts anzeigen"
          name="maxPosts"
          value={String(content.maxPosts || 6)}
          onChange={(val) => update('maxPosts', parseInt(val) || 6)}
        />
        <TextField
          label="'Alle ansehen' Button Text"
          name="viewAllText"
          value={content.viewAllText || ''}
          onChange={(val) => update('viewAllText', val)}
        />
      </div>

      {/* Badge */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Badge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Badge Text"
            name="badgeText"
            value={content.badge?.text || ''}
            onChange={(val) => updateBadge('text', val)}
          />
          <TextField
            label="Badge Icon (BookOpen, FileText, etc.)"
            name="badgeIcon"
            value={content.badge?.icon || ''}
            onChange={(val) => updateBadge('icon', val)}
          />
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <strong>Hinweis:</strong> Die angezeigten Blog-Posts werden aus der Blog-Tabelle geladen. 
          Um Blog-Posts zu bearbeiten, gehen Sie zu "Blog" im Admin-Menü.
        </p>
      </div>
    </div>
  );
}

