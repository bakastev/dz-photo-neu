'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Database, 
  Shield, 
  Zap, 
  Search, 
  Smartphone, 
  BarChart3,
  Lock,
  Edit,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  CreditCard,
  Calendar,
  Sparkles,
  Banknote,
  Copy,
  Gauge,
  Server,
  FileText,
  Users,
  Camera,
  MapPin,
  BookOpen,
  Star,
  Mail,
  Bell,
  Eye,
  TrendingUp,
  Cpu,
  Cloud,
  Key,
  Settings,
  Layout,
  Code,
  Palette,
  Rocket,
  Target,
  Brain,
  Network,
  Globe2,
  ShieldCheck,
  Clock,
  DollarSign,
  Heart,
  Award,
  Layers,
  Boxes,
  FileCheck,
  RefreshCw,
  Link as LinkIcon,
  ImagePlus,
  FolderOpen,
  Type,
  List,
  Grid3x3,
  Save,
  Upload,
  Download,
  Trash2,
  Share2
} from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPresentation() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background text-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gold/15 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gold-light/20 rounded-full blur-[100px] z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-white font-medium">Willkommen zu deiner neuen Website!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Deine professionelle <span className="gold-gradient-text">Hochzeitsfotografie-Website</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Modern, schnell und perfekt optimiert für deine Kunden. 
              Hier erfährst du, was dein neues System alles kann und warum es dich voranbringt.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>83 Content-Items migriert</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>74 Schema.org Objekte</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>KI-optimiert</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frontend Section - Detailed */}
      <section id="frontend" className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6">
                <Globe className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
                Frontend – <span className="text-gold">Was deine Kunden sehen</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Deine öffentliche Website, die jeden Besucher begeistert
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Next.js 16 */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Next.js 16 Framework</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Das modernste Web-Framework von Vercel, 
                  das von Netflix, TikTok und Hulu verwendet wird.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Blitzschnelle Ladezeiten:</strong> Seiten laden in unter 1 Sekunde</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Bessere Google-Rankings:</strong> Schnelle Seiten = höhere Position</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Weniger Absprünge:</strong> Kunden bleiben länger auf deiner Seite</span>
                  </li>
                </ul>
              </div>

              {/* Static Site Generation */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileCheck className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Static Site Generation (SSG)</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Deine Seiten werden vorab generiert 
                  und als statische HTML-Dateien gespeichert.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Extrem schnell:</strong> Keine Server-Berechnung bei jedem Besuch</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Kostenlos skalierbar:</strong> 10 oder 10.000 Besucher – kein Unterschied</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>99,9% Uptime:</strong> Deine Website läuft immer</span>
                  </li>
                </ul>
              </div>

              {/* Image Optimization */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ImageIcon className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Automatische Bildoptimierung</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Alle Bilder werden automatisch 
                  in moderne Formate (WebP, AVIF) konvertiert und in verschiedenen Größen bereitgestellt.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>70% kleinere Dateien:</strong> Deine Hochzeitsbilder laden viel schneller</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Weniger Datenverbrauch:</strong> Wichtig für mobile Nutzer</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Bessere Core Web Vitals:</strong> Google belohnt schnelle Seiten</span>
                  </li>
                </ul>
              </div>

              {/* SEO Optimization */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">SEO-Optimierung</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Deine Website ist so aufgebaut, 
                  dass Google sie perfekt versteht und indexiert.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Mehr organische Besucher:</strong> Kunden finden dich ohne Werbung</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Rich Snippets:</strong> Deine Ergebnisse erscheinen prominenter</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Strukturierte Daten:</strong> 74 Schema.org Objekte für maximale Sichtbarkeit</span>
                  </li>
                </ul>
              </div>

              {/* Mobile-First Design */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Smartphone className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Mobile-First Design</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Deine Website wurde zuerst für 
                  Smartphones entwickelt und dann für größere Bildschirme erweitert.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>60-70% deiner Besucher:</strong> Kommen vom Handy – perfekt optimiert</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Touch-optimiert:</strong> Buttons und Navigation perfekt für Finger</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Google Mobile-First:</strong> Bessere Rankings durch mobile Optimierung</span>
                  </li>
                </ul>
              </div>

              {/* Lightbox Gallery */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Camera className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Professionelle Bildergalerie</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Eine moderne Lightbox-Galerie 
                  mit Zoom, Thumbnails und Touch-Gesten.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Professioneller Eindruck:</strong> Wie bei teuren Hochzeitswebsites</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Mehr Engagement:</strong> Besucher bleiben länger und sehen mehr Bilder</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Social Sharing:</strong> Kunden teilen deine Arbeit leichter</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Section - Detailed */}
      <section id="backend" className="py-20 bg-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6">
                <Database className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
                Backend – <span className="text-gold">Die unsichtbare Kraft</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Datenbank, KI-Integration und intelligente Systeme im Hintergrund
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Supabase PostgreSQL */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Server className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Supabase PostgreSQL</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Eine professionelle, 
                  skalierbare Datenbank (wie bei großen Unternehmen verwendet).
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>83 Content-Items:</strong> Alle deine Hochzeiten, Locations, Blog-Posts gespeichert</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automatische Backups:</strong> Deine Daten sind immer sicher</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Skalierbar:</strong> Wächst mit deinem Business mit</span>
                  </li>
                </ul>
              </div>

              {/* KI-Integration */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">KI-gestützte Optimierung</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> OpenAI Embeddings analysieren 
                  deine Inhalte und optimieren sie automatisch für Suchmaschinen.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>83 Embeddings:</strong> Jeder Content ist KI-optimiert</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Semantic Search:</strong> Kunden finden dich auch mit ähnlichen Begriffen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automatische SEO:</strong> Meta-Descriptions, Keywords – alles automatisch</span>
                  </li>
                </ul>
              </div>

              {/* Schema.org */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Layers className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">74 Schema.org Objekte</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Strukturierte Daten, 
                  die Google helfen, deine Inhalte besser zu verstehen.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Rich Snippets:</strong> Deine Ergebnisse haben Sterne, Bilder, Preise</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Mehr Klicks:</strong> Prominente Ergebnisse = mehr Besucher</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>KI-Agent Ready:</strong> ChatGPT & Co. finden dich leichter</span>
                  </li>
                </ul>
              </div>

              {/* Analytics & Tracking */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Server-Side Analytics</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> Tracking direkt vom Server, 
                  nicht vom Browser – GDPR-konform und zuverlässiger.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Meta Conversion API:</strong> Deine Facebook-Werbung wird besser gemessen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Google Analytics 4:</strong> Detaillierte Einblicke in deine Besucher</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>GDPR-konform:</strong> Keine Probleme mit Datenschutz</span>
                  </li>
                </ul>
              </div>

              {/* GEO Intelligence */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">GEO Intelligence</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> 13 Locations mit präzisen 
                  Koordinaten, Google Maps Integration und Umkreissuche.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Lokale Suche:</strong> "Hochzeitsfotograf Linz" – du wirst gefunden</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Google Maps:</strong> Direkte Navigation zu Locations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Umkreissuche:</strong> Kunden finden Locations in ihrer Nähe</span>
                  </li>
                </ul>
              </div>

              {/* llms.txt */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Network className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">KI-Agent Discovery</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist das?</strong> llms.txt Datei, die KI-Agents 
                  (wie ChatGPT) hilft, deine Website zu verstehen.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Zukunftssicher:</strong> Wenn jemand ChatGPT fragt, wird deine Website erwähnt</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>73 priorisierte URLs:</strong> Wichtigste Seiten zuerst</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Content Attribution:</strong> Deine Arbeit wird immer korrekt zitiert</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section - Detailed */}
      <section id="admin" className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6">
                <Edit className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
                Admin-Bereich – <span className="text-gold">Dein Kontrollzentrum</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Alles selbst verwalten – ohne technisches Wissen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Content Management */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Content Management</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was kannst du machen?</strong> Hochzeiten, Locations, 
                  Blog-Posts, Fotobox-Services und mehr verwalten.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Selbstständigkeit:</strong> Keine Wartezeiten auf Webdesigner</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Rich Text Editor:</strong> Texte formatieren wie in Word</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Sofort online:</strong> Änderungen sind sofort sichtbar</span>
                  </li>
                </ul>
              </div>

              {/* Media Library */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FolderOpen className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Media Library</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was kannst du machen?</strong> Alle Bilder verwalten, 
                  hochladen, organisieren und in Galerien verwenden.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Drag & Drop:</strong> Bilder einfach per Drag & Drop hochladen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automatische Optimierung:</strong> Bilder werden automatisch komprimiert</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Organisiert:</strong> Nach Hochzeiten, Locations, etc. sortiert</span>
                  </li>
                </ul>
              </div>

              {/* Homepage Editor */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Layout className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Homepage Editor</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was kannst du machen?</strong> Jede Section deiner 
                  Homepage einzeln bearbeiten – Hero, About, Services, Portfolio, etc.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Vollständige Kontrolle:</strong> Jeden Text, jedes Bild ändern</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Live Preview:</strong> Siehst sofort, wie es aussieht</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Keine Fehler:</strong> Validierung verhindert Probleme</span>
                  </li>
                </ul>
              </div>

              {/* User Management */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">User Management</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was kannst du machen?</strong> Weitere Admin-User 
                  einladen (z.B. Assistenten) mit verschiedenen Rollen.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Teamarbeit:</strong> Mehrere Personen können Inhalte pflegen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Rollen-System:</strong> Admin (alles) oder Editor (nur Content)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Sicher:</strong> Nur autorisierte Personen haben Zugang</span>
                  </li>
                </ul>
              </div>

              {/* SEO Tools */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">SEO-Tools</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was kannst du machen?</strong> Meta-Titel, 
                  Meta-Beschreibungen, Keywords für jede Seite setzen.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Bessere Rankings:</strong> Optimierte Meta-Daten = mehr Klicks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Vorschau:</strong> Siehst, wie es in Google aussieht</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automatische Vorschläge:</strong> KI schlägt optimale Texte vor</span>
                  </li>
                </ul>
              </div>

              {/* Security */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                  <h3 className="text-xl font-semibold text-white">Sicherheit</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was ist geschützt?</strong> Session-basierte 
                  Authentifizierung, verschlüsselte Verbindungen, Rollen-basierte Zugriffe.
                </p>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold">Was bringt dir das?</strong>
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Keine Hacker:</strong> Moderne Sicherheitsstandards</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Automatische Logouts:</strong> Bei Inaktivität wird abgemeldet</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span><strong>Backups:</strong> Täglich automatische Sicherungen</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance & Statistics */}
      <section className="py-20 bg-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
                Zahlen, die <span className="text-gold">überzeugen</span>
              </h2>
              <p className="text-xl text-gray-300">
                Konkrete Fakten zu deinem neuen System
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">83</div>
                <div className="text-gray-300">Content-Items</div>
                <div className="text-sm text-gray-400 mt-2">Hochzeiten, Locations, Blog-Posts</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">74</div>
                <div className="text-gray-300">Schema.org Objekte</div>
                <div className="text-sm text-gray-400 mt-2">Für maximale Sichtbarkeit</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">&lt;1s</div>
                <div className="text-gray-300">Ladezeit</div>
                <div className="text-sm text-gray-400 mt-2">Blitzschnell geladen</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gold mb-2">99.9%</div>
                <div className="text-gray-300">Uptime</div>
                <div className="text-sm text-gray-400 mt-2">Deine Website läuft immer</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-serif font-bold mb-6 text-white text-center">
                Was bedeutet das für dich?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold text-white mb-2">Mehr Besucher</h4>
                  <p className="text-gray-300 text-sm">
                    Schnelle Seiten + SEO = mehr organische Besucher ohne Werbung
                  </p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold text-white mb-2">Weniger Kosten</h4>
                  <p className="text-gray-300 text-sm">
                    Keine monatlichen Wartungskosten für einfache Änderungen
                  </p>
                </div>
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h4 className="font-semibold text-white mb-2">Mehr Zeit</h4>
                  <p className="text-gray-300 text-sm">
                    Selbstständig arbeiten statt auf Webdesigner warten
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Payment */}
      <section className="py-20 bg-gradient-to-b from-dark-surface to-dark-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-12">
              <div className="flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6 mx-auto">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                Bereit loszulegen?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Nach der Zahlung machen wir gemeinsam einen <strong className="text-gold">Kickoff-/Setup Call</strong>, 
                bei dem ich dir alles Schritt für Schritt zeige und wir deine Website 
                gemeinsam einrichten.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span>Terminvereinbarung über WhatsApp</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  <span>Persönliche Einführung in alle Funktionen</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gold" />
                  <span>Support bei der ersten Einrichtung</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Payment Options */}
                <div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-4">
                    Zahlungsoptionen
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Mollie Payment Link */}
                    <a 
                      href="https://payment-links.mollie.com/payment/yoj63UgbfZebPmdX7uH5b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        variant="gold" 
                        size="lg"
                        className="w-full text-base py-5 px-6 group"
                      >
                        <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Zahlung via Mollie
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                    
                    {/* Qonto Payment Link */}
                    <a 
                      href="https://pay.qonto.com/payment-links/019aceea-9d84-7841-bc26-ca16ac2ac3df?resource_id=019aceea-9d7b-7ddd-b952-09a32d961e25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        variant="gold" 
                        size="lg"
                        className="w-full text-base py-5 px-6 group"
                      >
                        <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Zahlung via Qonto
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                  
                  <p className="text-sm text-gray-400 text-center">
                    Sichere Zahlung über Mollie oder Qonto. Nach erfolgreicher Zahlung erhältst du 
                    eine Bestätigung und wir vereinbaren den Setup-Call.
                  </p>
                </div>

                {/* Manual Bank Transfer */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-serif font-semibold text-white mb-4 flex items-center">
                    <Banknote className="w-6 h-6 text-gold mr-2" />
                    Oder per Überweisung
                  </h3>
                  
                  <div className="glass-card rounded-xl p-6 text-left">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">Zahlung an</p>
                        <p className="text-white font-medium">Steve Baka-Growing Brands</p>
                        <p className="text-gray-300 text-sm">Maximilian-von-Welsch-Str. 4</p>
                        <p className="text-gray-300 text-sm">76646 Bruchsal, DE</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">IBAN</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-mono text-base">DE81 1001 0123 6148 3415 64</p>
                            <button
                              onClick={() => handleCopy('DE81100101236148341564', 'iban')}
                              className="text-gold hover:text-gold-light transition-colors"
                              title="Kopieren"
                            >
                              {copiedField === 'iban' ? (
                                <CheckCircle2 className="w-4 h-4 text-gold" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">BIC</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-mono text-base">QNTODEB2XXX</p>
                            <button
                              onClick={() => handleCopy('QNTODEB2XXX', 'bic')}
                              className="text-gold hover:text-gold-light transition-colors"
                              title="Kopieren"
                            >
                              {copiedField === 'bic' ? (
                                <CheckCircle2 className="w-4 h-4 text-gold" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">Überweisungsbetrag</p>
                        <p className="text-2xl font-serif font-bold text-gold">1.000,00 €</p>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">Verwendungszweck</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">dz-photo.at Webseite Re-Design</p>
                            <button
                              onClick={() => handleCopy('dz-photo.at Webseite Re-Design', 'zweck')}
                              className="text-gold hover:text-gold-light transition-colors"
                              title="Kopieren"
                            >
                              {copiedField === 'zweck' ? (
                                <CheckCircle2 className="w-4 h-4 text-gold" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Bitte gib diesen Verwendungszweck bei der Überweisung an, damit wir deine Zahlung zuordnen können.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-300 mb-4">
                  Fragen vorab? Terminvereinbarung für den Setup-Call?
                </p>
                <a
                  href="https://wa.me/4915225317285?text=Hallo!%20Ich%20habe%20Fragen%20zu%20meiner%20neuen%20Website%20oder%20möchte%20einen%20Setup-Call%20vereinbaren."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gold hover:text-gold-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Schreib mir auf WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
