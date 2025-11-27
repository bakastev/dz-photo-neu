'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
  buttonText?: string;
}

export default function ShareButton({ title, text, className, buttonText = 'Teilen' }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title,
        text: text || '',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className={className || "inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full text-white hover:text-gold transition-colors"}
    >
      <Share2 className="w-5 h-5" />
      <span>{buttonText}</span>
    </button>
  );
}

