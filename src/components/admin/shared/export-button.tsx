'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
  loading?: boolean;
}

export function ExportButton({ onClick, label = 'Export CSV', loading }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
    >
      <Download className="h-4 w-4" />
      {loading ? 'Exporting...' : label}
    </Button>
  );
}
