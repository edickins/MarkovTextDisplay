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
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          // Clip is off-screen
          removeMe();
        }
      }
    };

    // Attach the scroll event listener to the container-scroller
    const containerScroller = document.getElementById('container-scroller');
    containerScroller?.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up the event listener when the component unmounts
      containerScroller?.removeEventListener('scroll', handleScroll);
    };
  }, [removeMe]);

  return (
    <div data-typing-effect className='text-xl text-green-300' ref={localRef}>
      <p className=''>{text}</p>
    </div>
  );
}

export default TerminalText;
