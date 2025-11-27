'use client';

import { useToast } from '@/components/ui/use-toast';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm
            animate-in slide-in-from-right-full duration-300
            ${toast.variant === 'destructive' 
              ? 'bg-red-500/90 border-red-400 text-white' 
              : 'bg-[#141414]/95 border-white/10 text-white'
            }
          `}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
          )}
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold text-sm">{toast.title}</p>
            )}
            {toast.description && (
              <p className={`text-sm ${toast.variant === 'destructive' ? 'text-white/90' : 'text-gray-400'}`}>
                {toast.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

