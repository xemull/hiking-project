// src/app/components/TagBadge.tsx
interface TagBadgeProps {
  label: string;
  type: 'scenery' | 'season' | 'accommodation' | 'time';
}

export default function TagBadge({ label, type }: TagBadgeProps) {
  const getTagStyle = (type: string) => {
    switch (type) {
      case 'scenery':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'season':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accommodation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'time':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagStyle(type)}`}>
      {label}
    </span>
  );
}