import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  removeMe: () => void;
};

function TerminalText({ text, removeMe }: Props) {
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localRef.current === null) return;

    const rect = localRef.current.getBoundingClientRect();
    if (rect.top > -500) {
      removeMe();
    }
  }, [removeMe]);

  return (
    <div data-typing-effect ref={localRef}>
      {text}
    </div>
  );
}

export default TerminalText;
