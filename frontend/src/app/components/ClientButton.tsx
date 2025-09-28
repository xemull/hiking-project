'use client';

interface ClientButtonProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ClientButton({ targetId, children, className, style }: ClientButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}