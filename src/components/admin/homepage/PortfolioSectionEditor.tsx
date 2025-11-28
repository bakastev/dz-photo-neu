'use client';

import TextField from '@/components/admin/forms/TextField';
import ToggleField from '@/components/admin/forms/ToggleField';

interface PortfolioContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  weddingsTitle: string;
  weddingsSubtitle: string;
  locationsTitle: string;
  locationsSubtitle: string;
  maxWeddings: number;
  maxLocations: number;
  showFeaturedOnly: boolean;
  viewAllWeddingsText: string;
  viewAllLocationsText: string;
}

interface Props {
  content: PortfolioContent;
  onChange: (content: PortfolioContent) => void;
}

export default function PortfolioSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof PortfolioContent, value: any) => {
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
        rows={2}
      />

      {/* Weddings Config */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Hochzeiten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Tab-Titel"
            name="weddingsTitle"
            value={content.weddingsTitle || ''}
            onChange={(val) => update('weddingsTitle', val)}
          />
          <TextField
            label="Tab-Untertitel"
            name="weddingsSubtitle"
            value={content.weddingsSubtitle || ''}
            onChange={(val) => update('weddingsSubtitle', val)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            label="Max. Anzahl"
            name="maxWeddings"
            value={String(content.maxWeddings || 6)}
            onChange={(val) => update('maxWeddings', parseInt(val) || 6)}
          />
          <TextField
            label="'Alle ansehen' Button Text"
            name="viewAllWeddingsText"
            value={content.viewAllWeddingsText || ''}
            onChange={(val) => update('viewAllWeddingsText', val)}
          />
        </div>
      </div>

      {/* Locations Config */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Tab-Titel"
            name="locationsTitle"
            value={content.locationsTitle || ''}
            onChange={(val) => update('locationsTitle', val)}
          />
          <TextField
            label="Tab-Untertitel"
            name="locationsSubtitle"
            value={content.locationsSubtitle || ''}
            onChange={(val) => update('locationsSubtitle', val)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            label="Max. Anzahl"
            name="maxLocations"
            value={String(content.maxLocations || 8)}
            onChange={(val) => update('maxLocations', parseInt(val) || 8)}
          />
          <TextField
            label="'Alle ansehen' Button Text"
            name="viewAllLocationsText"
            value={content.viewAllLocationsText || ''}
            onChange={(val) => update('viewAllLocationsText', val)}
          />
        </div>
      </div>

      {/* Display Options */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Anzeige-Optionen</h3>
        <ToggleField
          label="Nur Featured Items anzeigen"
          description="Zeigt nur Hochzeiten/Locations an, die als 'Featured' markiert sind"
          value={content.showFeaturedOnly ?? true}
          onChange={(val) => update('showFeaturedOnly', val)}
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <strong>Hinweis:</strong> Die angezeigten Hochzeiten und Locations werden aus den jeweiligen Content-Tabellen geladen. 
          Um die angezeigten Items zu ändern, bearbeiten Sie diese unter "Hochzeiten" bzw. "Locations" und setzen Sie das "Featured"-Flag.
        </p>
      </div>
    </div>
  );
}



