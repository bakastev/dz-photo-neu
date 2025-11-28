'use client';

import TextField from '@/components/admin/forms/TextField';

interface FotoboxContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  maxServices: number;
  viewAllText: string;
}

interface Props {
  content: FotoboxContent;
  onChange: (content: FotoboxContent) => void;
}

export default function FotoboxSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof FotoboxContent, value: any) => {
    onChange({ ...content, [key]: value });
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
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Max. Services anzeigen"
          name="maxServices"
          value={String(content.maxServices || 3)}
          onChange={(val) => update('maxServices', parseInt(val) || 3)}
        />
        <TextField
          label="'Alle ansehen' Button Text"
          name="viewAllText"
          value={content.viewAllText || ''}
          onChange={(val) => update('viewAllText', val)}
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <strong>Hinweis:</strong> Die angezeigten Fotobox-Services werden aus der Fotobox-Tabelle geladen. 
          Um die Services zu bearbeiten, gehen Sie zu "Fotobox" im Admin-Menü.
        </p>
      </div>
    </div>
  );
}



