'use client';

import TextField from '@/components/admin/forms/TextField';
import ImageField from '@/components/admin/forms/ImageField';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string | null;
}

interface Props {
  content: HeroContent;
  onChange: (content: HeroContent) => void;
}

export default function HeroSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof HeroContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Titel"
          name="title"
          value={content.title || ''}
          onChange={(val) => update('title', val)}
          description="Hauptüberschrift der Hero-Section"
        />
        <TextField
          label="Untertitel"
          name="subtitle"
          value={content.subtitle || ''}
          onChange={(val) => update('subtitle', val)}
          description="Wird über dem Titel angezeigt"
        />
      </div>

      <TextField
        label="Beschreibung"
        name="description"
        value={content.description || ''}
        onChange={(val) => update('description', val)}
        multiline
        rows={2}
        description="Kurze Beschreibung unter dem Titel"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Primärer CTA Button"
          name="ctaPrimary"
          value={content.ctaPrimary || ''}
          onChange={(val) => update('ctaPrimary', val)}
          description="Text für den Hauptbutton"
        />
        <TextField
          label="Sekundärer CTA Button"
          name="ctaSecondary"
          value={content.ctaSecondary || ''}
          onChange={(val) => update('ctaSecondary', val)}
          description="Text für den zweiten Button"
        />
      </div>

      <div>
        <ImageField
          label="Hintergrundbild"
          value={content.backgroundImage || null}
          onChange={(val) => update('backgroundImage', val)}
          folder="homepage"
        />
        <p className="text-sm text-gray-500 mt-1">Optionales Hintergrundbild für die Hero-Section</p>
      </div>
    </div>
  );
}

