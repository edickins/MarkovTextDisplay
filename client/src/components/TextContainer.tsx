import { useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import useGetTerminalText from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';

function TextContainer() {
  const [terminalTexts, setTerminalTexts] = useState<React.ReactNode[]>([]);
  const [toBeRemovedIndexes, setToBeRemovedIndexes] = useState<number[]>([]);
  const [isWaitingForAnimation, setIsWaitingForAnimation] =
    useState<boolean>(false);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutIDRef = useRef<string | number | NodeJS.Timeout | undefined>(
    undefined
  );

  const { text, getNewText } = useGetTerminalText();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTyping) {
      // Assuming you have an array of <span> elements
      const spans = document.querySelectorAll('span');

      if (spans && spans.length > 0) {
        // Get the last <span> (which is the most recently displayed one)
        const lastSpan = spans[spans.length - 2];

        // Create a pseudo-element for the cursor
        const cursor = document.createElement('span');
        cursor.classList.add('cursor'); // You can style this class in your CSS

        // Append the cursor to the last <span>
        lastSpan.appendChild(cursor);
      }
    }
  }, [isTyping]);

  // scroll container to the bottom of the screen
  useEffect(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [terminalTexts]);

  // Cleanup effect to remove components
  useEffect(() => {
    if (toBeRemovedIndexes.length > 0) {
      setTerminalTexts((prevTexts) =>
        prevTexts.filter((_, index) => !toBeRemovedIndexes.includes(index))
      );
      setToBeRemovedIndexes([]);
    }
  }, [toBeRemovedIndexes]);

  // Side effect for when a new text arrives from the API
  useEffect(() => {
    if (text && !isWaitingForAnimation) {
      setIsWaitingForAnimation(true);

      // if (terminalTexts.length > 3) return;
      setTerminalTexts((prevTexts) => [
        ...prevTexts,
        <TerminalText
          text={text}
          key={nanoid()}
          removeMe={() => {
            setToBeRemovedIndexes((prev) => [...prev, prevTexts.length]);
          }}
        />
      ]);
    }
  }, [text, terminalTexts, isWaitingForAnimation]);

  // Side effect to start typing-effect on the text in the new TerminalText component
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');
    if (textElementToAnimate) {
      setIsTyping(true);
      typingEffect(textElementToAnimate, {
        speed: 100,
        reset: true
      }).then(() => {
        setTimeout(() => {
          getNewText().then(() => {
            setIsTyping(false);
            setIsWaitingForAnimation(false);
          });
        }, 1500);
      });
    }
  }, [text, getNewText]);

  useEffect(() => {
    const randomGlitch = () => {
      if (timeoutIDRef.current) return;

      // Randomly decide whether to apply the glitch effect
      const shouldGlitch = Math.random() < 0.1; // 20% chance to glitch

      if (shouldGlitch) {
        containerRef?.current?.classList.add('glitch');
        // Start a timer to stop the glitch and decide again
        timeoutIDRef.current = setTimeout(() => {
          containerRef?.current?.classList.remove('glitch');
          timeoutIDRef.current = undefined;
          // Start a new timer for the next decision
          const nextRandomDelay = Math.random() * 4000 + 100;
          setTimeout(randomGlitch, nextRandomDelay);
        }, 500); // Glitch duration (adjust as needed)
      } else {
        // Start a timer to make the decision again

        containerRef?.current?.classList.remove('glitch');
        const nextRandomDelay = Math.random() * 4000 + 100;

        timeoutIDRef.current = setTimeout(() => {
          timeoutIDRef.current = undefined;
          randomGlitch(); // Decide again
        }, nextRandomDelay);
      }
    };

    // Initial call to start the process
    randomGlitch();

    return () => {
      // Cleanup function to clear timeouts if the component unmounts
      clearTimeout(timeoutIDRef.current);
    };
  }, []);

  return (
    <div
      id='container-scroller'
      className='grid overflow-hidden relative max-h-full  p-8 md:p-12 glitch-text'
      style={{
        gridAutoRows: 'minmax(0, auto)',
        gap: '0.5rem',
        alignItems: 'start'
      }}
      ref={containerRef}
    >
      {terminalTexts}
    </div>
  );
}

export default TextContainer;
