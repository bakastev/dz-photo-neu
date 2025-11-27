'use client';

import TextField from '@/components/admin/forms/TextField';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  link?: string;
}

interface ServicesContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  services: Service[];
  ctaBox: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface Props {
  content: ServicesContent;
  onChange: (content: ServicesContent) => void;
}

export default function ServicesSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof ServicesContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const newServices = [...(content.services || [])];
    newServices[index] = { ...newServices[index], [field]: value };
    update('services', newServices);
  };

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const newServices = [...(content.services || [])];
    const features = [...(newServices[serviceIndex].features || [])];
    features[featureIndex] = value;
    newServices[serviceIndex] = { ...newServices[serviceIndex], features };
    update('services', newServices);
  };

  const addFeature = (serviceIndex: number) => {
    const newServices = [...(content.services || [])];
    newServices[serviceIndex] = {
      ...newServices[serviceIndex],
      features: [...(newServices[serviceIndex].features || []), '']
    };
    update('services', newServices);
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const newServices = [...(content.services || [])];
    newServices[serviceIndex] = {
      ...newServices[serviceIndex],
      features: newServices[serviceIndex].features.filter((_, i) => i !== featureIndex)
    };
    update('services', newServices);
  };

  const updateCtaBox = (field: string, value: string) => {
    update('ctaBox', { ...content.ctaBox, [field]: value });
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

      {/* Services */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Services</h3>
        <div className="space-y-6">
          {(content.services || []).map((service, index) => (
            <div key={index} className="bg-black/30 p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <GripVertical className="w-5 h-5 text-gray-500" />
                <span className="text-white font-medium">Service {index + 1}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Titel"
                  name={`service-title-${index}`}
                  value={service.title}
                  onChange={(val) => updateService(index, 'title', val)}
                />
                <TextField
                  label="Icon (Heart, MapPin, Camera)"
                  name={`service-icon-${index}`}
                  value={service.icon}
                  onChange={(val) => updateService(index, 'icon', val)}
                />
              </div>

              <TextField
                label="Beschreibung"
                name={`service-desc-${index}`}
                value={service.description}
                onChange={(val) => updateService(index, 'description', val)}
              />

              <TextField
                label="Link"
                name={`service-link-${index}`}
                value={service.link || ''}
                onChange={(val) => updateService(index, 'link', val)}
                placeholder="/hochzeit"
              />

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                <div className="space-y-2">
                  {(service.features || []).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
                        placeholder="Feature..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index, featureIndex)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(index)}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Feature hinzufügen
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">CTA Box</h3>
        <div className="space-y-4">
          <TextField
            label="Titel"
            name="ctaTitle"
            value={content.ctaBox?.title || ''}
            onChange={(val) => updateCtaBox('title', val)}
          />
          <TextField
            label="Beschreibung"
            name="ctaDescription"
            value={content.ctaBox?.description || ''}
            onChange={(val) => updateCtaBox('description', val)}
            multiline
            rows={2}
          />
          <TextField
            label="Button Text"
            name="ctaButtonText"
            value={content.ctaBox?.buttonText || ''}
            onChange={(val) => updateCtaBox('buttonText', val)}
          />
        </div>
      </div>
    </div>
  );
}

