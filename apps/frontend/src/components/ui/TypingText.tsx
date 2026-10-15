import { useState, useEffect } from "react";

export interface TypingTextProps {
  text: string;
  speed?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  blurry?: boolean;
}

export const TypingText = ({ text, speed = 60, style, className, onClick }: TypingTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    let i = 0;
    let cancelled = false;
    function type() {
      if (cancelled) return;
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
        setTimeout(type, speed);
      }
    }
    type();
    const cursorInterval = setInterval(() => setShowCursor(c => !c), 500);
    return () => { cancelled = true; clearInterval(cursorInterval); };
  }, [text, speed]);
  return (
    <span
      className={className}
      style={{
        ...style,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'filter 0.5s',
      }}
      onClick={onClick}
    >
      {displayed}
      <span style={{opacity: showCursor ? 1 : 0}}>|</span>
    </span>
  );
}; 