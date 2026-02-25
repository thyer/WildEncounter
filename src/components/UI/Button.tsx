import './Button.css';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
}

export default function Button({ onClick, disabled = false, children, variant = 'primary', style }: ButtonProps) {
  return (
    <button
      className={`game-button game-button-${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
