'use client';

import TextField from '@/components/admin/forms/TextField';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface QuickStat {
  value: string;
  label: string;
  icon: string;
}

interface FAQContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  badge: {
    text: string;
    icon: string;
  };
  faqs: FAQ[];
  quickStats: QuickStat[];
  ctaBox: {
    title: string;
    description: string;
    buttonPrimary: string;
    buttonSecondary: string;
  };
}

interface Props {
  content: FAQContent;
  onChange: (content: FAQContent) => void;
}

export default function FAQSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof FAQContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const updateBadge = (field: string, value: string) => {
    update('badge', { ...content.badge, [field]: value });
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFAQs = [...(content.faqs || [])];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    update('faqs', newFAQs);
  };

  const addFAQ = () => {
    update('faqs', [...(content.faqs || []), { question: '', answer: '', category: '' }]);
  };

  const removeFAQ = (index: number) => {
    update('faqs', (content.faqs || []).filter((_, i) => i !== index));
  };

  const updateQuickStat = (index: number, field: keyof QuickStat, value: string) => {
    const newStats = [...(content.quickStats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    update('quickStats', newStats);
  };

  const addQuickStat = () => {
    update('quickStats', [...(content.quickStats || []), { value: '', label: '', icon: '' }]);
  };

  const removeQuickStat = (index: number) => {
    update('quickStats', (content.quickStats || []).filter((_, i) => i !== index));
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

      {/* Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Badge Text"
          name="badgeText"
          value={content.badge?.text || ''}
          onChange={(val) => updateBadge('text', val)}
        />
        <TextField
          label="Badge Icon"
          name="badgeIcon"
          value={content.badge?.icon || ''}
          onChange={(val) => updateBadge('icon', val)}
        />
      </div>

      {/* FAQs */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Fragen & Antworten</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFAQ}
            className="border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            FAQ hinzufügen
          </Button>
        </div>

        <div className="space-y-4">
          {(content.faqs || []).map((faq, index) => (
            <div key={index} className="bg-black/30 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 text-sm">FAQ {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFAQ(index)}
                  className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <TextField
                label="Frage"
                name={`faq-question-${index}`}
                value={faq.question}
                onChange={(val) => updateFAQ(index, 'question', val)}
              />
              <TextField
                label="Antwort"
                name={`faq-answer-${index}`}
                value={faq.answer}
                onChange={(val) => updateFAQ(index, 'answer', val)}
                multiline
                rows={3}
              />
              <TextField
                label="Kategorie (optional)"
                name={`faq-category-${index}`}
                value={faq.category || ''}
                onChange={(val) => updateFAQ(index, 'category', val)}
                placeholder="z.B. Buchung, Leistungen, Fotobox"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Quick Stats</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addQuickStat}
            className="border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Stat hinzufügen
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(content.quickStats || []).map((stat, index) => (
            <div key={index} className="bg-black/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Stat {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuickStat(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateQuickStat(index, 'value', e.target.value)}
                placeholder="24h"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateQuickStat(index, 'label', e.target.value)}
                placeholder="Antwortzeit"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                value={stat.icon}
                onChange={(e) => updateQuickStat(index, 'icon', e.target.value)}
                placeholder="MessageCircle"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Primärer Button"
              name="ctaButtonPrimary"
              value={content.ctaBox?.buttonPrimary || ''}
              onChange={(val) => updateCtaBox('buttonPrimary', val)}
            />
            <TextField
              label="Sekundärer Button"
              name="ctaButtonSecondary"
              value={content.ctaBox?.buttonSecondary || ''}
              onChange={(val) => updateCtaBox('buttonSecondary', val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

