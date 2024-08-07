import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  removeMe: () => void;
};

function TerminalText({ text, removeMe }: Props) {
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (localRef.current) {
        const rect = localRef.current.getBoundingClientRect();
        console.log(`rect.top ${rect.top}`);
        console.log(`window.innerHeight ${window.innerHeight}`);
        console.log(`rect.bottom ${rect.bottom}`);
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          // Clip is off-screen
          removeMe();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [removeMe]);

  return (
    <div data-typing-effect className='text-3xl bg-white' ref={localRef}>
      <p className='bg-blue-400'>{text}</p>
    </div>
  );
}

export default TerminalText;
