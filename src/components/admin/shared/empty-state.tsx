'use client';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mx-auto mb-4">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="text-white/60 font-semibold mb-2">{title}</h3>
      <p className="text-white/30 text-sm max-w-sm mx-auto mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
