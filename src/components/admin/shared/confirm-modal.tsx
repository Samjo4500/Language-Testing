'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading }: ConfirmModalProps) {
  if (!open) return null;

  const variantStyles = {
    danger: 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400',
    warning: 'from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400',
    default: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 max-w-md w-full mx-4 border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            variant === 'danger' ? 'bg-red-500/20' : variant === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              variant === 'danger' ? 'text-red-400' : variant === 'warning' ? 'text-yellow-400' : 'text-blue-400'
            }`} />
          </div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`bg-gradient-to-r ${variantStyles[variant]} text-white shadow-lg`}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
