'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-16 w-16 text-xl',
  md: 'h-24 w-24 text-3xl',
  lg: 'h-32 w-32 text-4xl',
};

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function AvatarUpload({
  value,
  onChange,
  fallbackText = 'U',
  size = 'md',
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please select a JPG, PNG, GIF, or WebP image.');
        return;
      }

      if (file.size > MAX_SIZE) {
        setError('Image must be smaller than 2MB.');
        return;
      }

      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read image. Please try again.');
        setLoading(false);
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [onChange]
  );

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <button
        type="button"
        onClick={handleClick}
        className="relative group cursor-pointer focus:outline-none"
        aria-label="Upload avatar"
      >
        {value ? (
          <img
            src={value}
            alt="Avatar"
            className={cn(
              'rounded-full object-cover border-2 border-white/10 transition-all group-hover:border-white/20 group-hover:scale-105',
              SIZE_MAP[size]
            )}
          />
        ) : (
          <div
            className={cn(
              'rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-white border-2 border-white/10 transition-all group-hover:border-white/20 group-hover:scale-105',
              SIZE_MAP[size]
            )}
          >
            {fallbackText[0]?.toUpperCase() || 'U'}
          </div>
        )}

        {/* Camera overlay */}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {loading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>

        {/* Bottom-right camera badge */}
        <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#1a1f36] border border-white/10 flex items-center justify-center">
          <Camera className="h-3.5 w-3.5 text-white/60" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-xs text-red-400 text-center max-w-[200px]">{error}</p>
      )}
    </div>
  );
}
