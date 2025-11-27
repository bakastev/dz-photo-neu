'use client';

import TextField from '@/components/admin/forms/TextField';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ServiceOption {
  value: string;
  label: string;
}

interface BusinessHour {
  day: string;
  time: string;
}

interface ContactContent {
  sectionTitle: string;
  sectionTitleHighlight: string;
  description: string;
  formTitle: string;
  serviceOptions: ServiceOption[];
  formLabels: {
    service: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    weddingDate: string;
    location: string;
    locationPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
  };
  successMessage: {
    title: string;
    description: string;
    buttonText: string;
  };
  contactInfo: {
    title: string;
    phone: string;
    phoneHours: string;
    email: string;
    emailResponse: string;
    address: string;
    addressNote: string;
  };
  businessHours: {
    title: string;
    hours: BusinessHour[];
  };
  socialMedia: {
    title: string;
    instagram: string;
    facebook: string;
  };
}

interface Props {
  content: ContactContent;
  onChange: (content: ContactContent) => void;
}

export default function ContactSectionEditor({ content, onChange }: Props) {
  const update = (key: keyof ContactContent, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const updateFormLabels = (field: string, value: string) => {
    update('formLabels', { ...content.formLabels, [field]: value });
  };

  const updateSuccessMessage = (field: string, value: string) => {
    update('successMessage', { ...content.successMessage, [field]: value });
  };

  const updateContactInfo = (field: string, value: string) => {
    update('contactInfo', { ...content.contactInfo, [field]: value });
  };

  const updateBusinessHours = (field: string, value: any) => {
    update('businessHours', { ...content.businessHours, [field]: value });
  };

  const updateHour = (index: number, field: keyof BusinessHour, value: string) => {
    const newHours = [...(content.businessHours?.hours || [])];
    newHours[index] = { ...newHours[index], [field]: value };
    updateBusinessHours('hours', newHours);
  };

  const addHour = () => {
    updateBusinessHours('hours', [...(content.businessHours?.hours || []), { day: '', time: '' }]);
  };

  const removeHour = (index: number) => {
    updateBusinessHours('hours', (content.businessHours?.hours || []).filter((_, i) => i !== index));
  };

  const updateSocialMedia = (field: string, value: string) => {
    update('socialMedia', { ...content.socialMedia, [field]: value });
  };

  const updateServiceOption = (index: number, field: keyof ServiceOption, value: string) => {
    const newOptions = [...(content.serviceOptions || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    update('serviceOptions', newOptions);
  };

  const addServiceOption = () => {
    update('serviceOptions', [...(content.serviceOptions || []), { value: '', label: '' }]);
  };

  const removeServiceOption = (index: number) => {
    update('serviceOptions', (content.serviceOptions || []).filter((_, i) => i !== index));
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

      <TextField
        label="Formular-Titel"
        name="formTitle"
        value={content.formTitle || ''}
        onChange={(val) => update('formTitle', val)}
      />

      {/* Service Options */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Service-Optionen</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addServiceOption}
            className="border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Option hinzufügen
          </Button>
        </div>

        <div className="space-y-2">
          {(content.serviceOptions || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option.value}
                onChange={(e) => updateServiceOption(index, 'value', e.target.value)}
                placeholder="Wert (z.B. hochzeitsfotografie)"
                className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                value={option.label}
                onChange={(e) => updateServiceOption(index, 'label', e.target.value)}
                placeholder="Label (z.B. Hochzeitsfotografie)"
                className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeServiceOption(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Kontaktinformationen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Telefon"
            name="phone"
            value={content.contactInfo?.phone || ''}
            onChange={(val) => updateContactInfo('phone', val)}
          />
          <TextField
            label="Telefon-Zeiten"
            name="phoneHours"
            value={content.contactInfo?.phoneHours || ''}
            onChange={(val) => updateContactInfo('phoneHours', val)}
          />
          <TextField
            label="E-Mail"
            name="email"
            value={content.contactInfo?.email || ''}
            onChange={(val) => updateContactInfo('email', val)}
          />
          <TextField
            label="E-Mail Antwortzeit"
            name="emailResponse"
            value={content.contactInfo?.emailResponse || ''}
            onChange={(val) => updateContactInfo('emailResponse', val)}
          />
          <TextField
            label="Adresse"
            name="address"
            value={content.contactInfo?.address || ''}
            onChange={(val) => updateContactInfo('address', val)}
          />
          <TextField
            label="Adress-Hinweis"
            name="addressNote"
            value={content.contactInfo?.addressNote || ''}
            onChange={(val) => updateContactInfo('addressNote', val)}
          />
        </div>
      </div>

      {/* Business Hours */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Öffnungszeiten</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHour}
            className="border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Zeile hinzufügen
          </Button>
        </div>

        <TextField
          label="Titel"
          name="businessHoursTitle"
          value={content.businessHours?.title || ''}
          onChange={(val) => updateBusinessHours('title', val)}
        />

        <div className="space-y-2 mt-4">
          {(content.businessHours?.hours || []).map((hour, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={hour.day}
                onChange={(e) => updateHour(index, 'day', e.target.value)}
                placeholder="Tag (z.B. Montag - Freitag)"
                className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                value={hour.time}
                onChange={(e) => updateHour(index, 'time', e.target.value)}
                placeholder="Zeit (z.B. 9:00 - 18:00)"
                className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHour(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Social Media</h3>
        <TextField
          label="Titel"
          name="socialTitle"
          value={content.socialMedia?.title || ''}
          onChange={(val) => updateSocialMedia('title', val)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            label="Instagram URL"
            name="instagram"
            value={content.socialMedia?.instagram || ''}
            onChange={(val) => updateSocialMedia('instagram', val)}
          />
          <TextField
            label="Facebook URL"
            name="facebook"
            value={content.socialMedia?.facebook || ''}
            onChange={(val) => updateSocialMedia('facebook', val)}
          />
        </div>
      </div>

      {/* Success Message */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-white font-medium mb-4">Erfolgsmeldung</h3>
        <div className="space-y-4">
          <TextField
            label="Titel"
            name="successTitle"
            value={content.successMessage?.title || ''}
            onChange={(val) => updateSuccessMessage('title', val)}
          />
          <TextField
            label="Beschreibung"
            name="successDescription"
            value={content.successMessage?.description || ''}
            onChange={(val) => updateSuccessMessage('description', val)}
            multiline
            rows={2}
          />
          <TextField
            label="Button Text"
            name="successButton"
            value={content.successMessage?.buttonText || ''}
            onChange={(val) => updateSuccessMessage('buttonText', val)}
          />
        </div>
      </div>
    </div>
  );
}

