'use client';

import TextField from '@/components/admin/forms/TextField';
import ImageField from '@/components/admin/forms/ImageField';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
}

interface AboutContent {
  title: string;
  subtitle: string;
  content: string;
  image: string | null;
  quickAnswerTitle: string;
  quickAnswerText: string;
  stats: Stat[];
}

interface Props {
  content: AboutContent;
  onChange: (content: AboutContent) => void;
}

export default function AboutSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof AboutContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...(content.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    update('stats', newStats);
  };

  const addStat = () => {
    update('stats', [...(content.stats || []), { value: '', label: '' }]);
  };

  const removeStat = (index: number) => {
    update('stats', (content.stats || []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Name / Titel"
          name="title"
          value={content.title || ''}
          onChange={(val) => update('title', val)}
        />
        <TextField
          label="Untertitel"
          name="subtitle"
          value={content.subtitle || ''}
          onChange={(val) => update('subtitle', val)}
        />
      </div>

      <TextField
        label="Über mich Text"
        name="content"
        value={content.content || ''}
        onChange={(val) => update('content', val)}
        multiline
        rows={5}
        description="Ausführlicher Text über dich (kann auch aus der 'Über mich' Seite geladen werden)"
      />

      <ImageField
        label="Portrait-Bild"
        value={content.image || null}
        onChange={(val) => update('image', val)}
        folder="homepage"
      />

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Quick Answer Box</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Quick Answer Titel"
            name="quickAnswerTitle"
            value={content.quickAnswerTitle || ''}
            onChange={(val) => update('quickAnswerTitle', val)}
          />
          <TextField
            label="Quick Answer Text"
            name="quickAnswerText"
            value={content.quickAnswerText || ''}
            onChange={(val) => update('quickAnswerText', val)}
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Statistiken</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStat}
            className="border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Statistik hinzufügen
          </Button>
        </div>

        <div className="space-y-4">
          {(content.stats || []).map((stat, index) => (
            <div key={index} className="flex items-end gap-4 bg-black/30 p-4 rounded-lg">
              <div className="flex-1">
                <TextField
                  label="Wert"
                  name={`stat-value-${index}`}
                  value={stat.value}
                  onChange={(val) => updateStat(index, 'value', val)}
                  placeholder="500+"
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="Label"
                  name={`stat-label-${index}`}
                  value={stat.label}
                  onChange={(val) => updateStat(index, 'label', val)}
                  placeholder="Hochzeiten"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStat(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

