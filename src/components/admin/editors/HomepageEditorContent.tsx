'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, Loader2, Eye, EyeOff, GripVertical,
  Home, User, Briefcase, Image, Camera, Star, FileText, HelpCircle, Mail
} from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/auth-client';
import { useToast } from '@/components/ui/use-toast';
import HeroSectionEditor from '../homepage/HeroSectionEditor';
import AboutSectionEditor from '../homepage/AboutSectionEditor';
import ServicesSectionEditor from '../homepage/ServicesSectionEditor';
import PortfolioSectionEditor from '../homepage/PortfolioSectionEditor';
import FotoboxSectionEditor from '../homepage/FotoboxSectionEditor';
import TestimonialsSectionEditor from '../homepage/TestimonialsSectionEditor';
import BlogSectionEditor from '../homepage/BlogSectionEditor';
import FAQSectionEditor from '../homepage/FAQSectionEditor';
import ContactSectionEditor from '../homepage/ContactSectionEditor';

interface HomepageSection {
  id: string;
  section_key: string;
  section_name: string;
  content: any;
  display_order: number;
  enabled: boolean;
}

const sectionIcons: Record<string, any> = {
  hero: Home,
  about: User,
  services: Briefcase,
  portfolio: Image,
  fotobox: Camera,
  testimonials: Star,
  blog: FileText,
  faq: HelpCircle,
  contact: Mail,
};

export default function HomepageEditorContent() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: "Fehler",
        description: "Sektionen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } else {
      setSections(data || []);
      if (data && data.length > 0) {
        setActiveTab(data[0].section_key);
      }
    }
    setLoading(false);
  };

  const updateSection = (sectionKey: string, content: any) => {
    setSections(prev => prev.map(s => 
      s.section_key === sectionKey ? { ...s, content } : s
    ));
  };

  const toggleSection = async (sectionKey: string) => {
    const section = sections.find(s => s.section_key === sectionKey);
    if (!section) return;

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from('homepage_sections')
      .update({ enabled: !section.enabled })
      .eq('section_key', sectionKey);

    if (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden.",
        variant: "destructive",
      });
    } else {
      setSections(prev => prev.map(s => 
        s.section_key === sectionKey ? { ...s, enabled: !s.enabled } : s
      ));
      toast({
        title: "Erfolgreich",
        description: `Sektion ${section.enabled ? 'deaktiviert' : 'aktiviert'}.`,
      });
    }
  };

  const saveSection = async (sectionKey: string) => {
    setSaving(true);
    const section = sections.find(s => s.section_key === sectionKey);
    if (!section) return;

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from('homepage_sections')
      .update({ content: section.content, updated_at: new Date().toISOString() })
      .eq('section_key', sectionKey);

    if (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Gespeichert!",
        description: `${section.section_name} wurde aktualisiert.`,
      });
    }
    setSaving(false);
  };

  const saveAllSections = async () => {
    setSaving(true);
    const supabase = createBrowserSupabaseClient();

    for (const section of sections) {
      const { error } = await supabase
        .from('homepage_sections')
        .update({ content: section.content, updated_at: new Date().toISOString() })
        .eq('section_key', section.section_key);

      if (error) {
        console.error(`Error saving ${section.section_key}:`, error);
        toast({
          title: "Fehler",
          description: `${section.section_name} konnte nicht gespeichert werden.`,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({
      title: "Alle Sektionen gespeichert!",
      description: "Die Startseite wurde aktualisiert.",
    });
    setSaving(false);
  };

  const getSection = (key: string) => sections.find(s => s.section_key === key);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        Lade Startseiten-Einstellungen...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Bearbeiten Sie alle Sektionen der Startseite. Änderungen werden erst nach dem Speichern übernommen.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vorschau
          </Button>
          <Button
            onClick={saveAllSections}
            disabled={saving}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8960F]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Alle speichern
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-[#141414] border border-white/10 rounded-xl p-2">
          <TabsList className="bg-transparent flex flex-wrap gap-1">
            {sections.map((section) => {
              const Icon = sectionIcons[section.section_key] || FileText;
              return (
                <TabsTrigger
                  key={section.section_key}
                  value={section.section_key}
                  className={`
                    data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white
                    ${!section.enabled ? 'opacity-50' : ''}
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.section_name}
                  {!section.enabled && <EyeOff className="w-3 h-3 ml-1" />}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Hero Section */}
        <TabsContent value="hero">
          <SectionWrapper
            section={getSection('hero')!}
            onToggle={() => toggleSection('hero')}
            onSave={() => saveSection('hero')}
            saving={saving}
          >
            <HeroSectionEditor
              content={getSection('hero')?.content || {}}
              onChange={(content) => updateSection('hero', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <SectionWrapper
            section={getSection('about')!}
            onToggle={() => toggleSection('about')}
            onSave={() => saveSection('about')}
            saving={saving}
          >
            <AboutSectionEditor
              content={getSection('about')?.content || {}}
              onChange={(content) => updateSection('about', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services">
          <SectionWrapper
            section={getSection('services')!}
            onToggle={() => toggleSection('services')}
            onSave={() => saveSection('services')}
            saving={saving}
          >
            <ServicesSectionEditor
              content={getSection('services')?.content || {}}
              onChange={(content) => updateSection('services', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Portfolio Section */}
        <TabsContent value="portfolio">
          <SectionWrapper
            section={getSection('portfolio')!}
            onToggle={() => toggleSection('portfolio')}
            onSave={() => saveSection('portfolio')}
            saving={saving}
          >
            <PortfolioSectionEditor
              content={getSection('portfolio')?.content || {}}
              onChange={(content) => updateSection('portfolio', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Fotobox Section */}
        <TabsContent value="fotobox">
          <SectionWrapper
            section={getSection('fotobox')!}
            onToggle={() => toggleSection('fotobox')}
            onSave={() => saveSection('fotobox')}
            saving={saving}
          >
            <FotoboxSectionEditor
              content={getSection('fotobox')?.content || {}}
              onChange={(content) => updateSection('fotobox', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <SectionWrapper
            section={getSection('testimonials')!}
            onToggle={() => toggleSection('testimonials')}
            onSave={() => saveSection('testimonials')}
            saving={saving}
          >
            <TestimonialsSectionEditor
              content={getSection('testimonials')?.content || {}}
              onChange={(content) => updateSection('testimonials', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Blog Section */}
        <TabsContent value="blog">
          <SectionWrapper
            section={getSection('blog')!}
            onToggle={() => toggleSection('blog')}
            onSave={() => saveSection('blog')}
            saving={saving}
          >
            <BlogSectionEditor
              content={getSection('blog')?.content || {}}
              onChange={(content) => updateSection('blog', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* FAQ Section */}
        <TabsContent value="faq">
          <SectionWrapper
            section={getSection('faq')!}
            onToggle={() => toggleSection('faq')}
            onSave={() => saveSection('faq')}
            saving={saving}
          >
            <FAQSectionEditor
              content={getSection('faq')?.content || {}}
              onChange={(content) => updateSection('faq', content)}
            />
          </SectionWrapper>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact">
          <SectionWrapper
            section={getSection('contact')!}
            onToggle={() => toggleSection('contact')}
            onSave={() => saveSection('contact')}
            saving={saving}
          >
            <ContactSectionEditor
              content={getSection('contact')?.content || {}}
              onChange={(content) => updateSection('contact', content)}
            />
          </SectionWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SectionWrapperProps {
  section: HomepageSection;
  onToggle: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}

function SectionWrapper({ section, onToggle, onSave, saving, children }: SectionWrapperProps) {
  if (!section) return null;
  
  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-white">{section.section_name}</h2>
          <span className={`text-xs px-2 py-1 rounded ${section.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {section.enabled ? 'Aktiv' : 'Inaktiv'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/10"
          >
            {section.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {section.enabled ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            size="sm"
            className="bg-[#D4AF37] hover:bg-[#B8960F]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="ml-2">Speichern</span>
          </Button>
        </div>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

