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

  return (
    <div
      id='container-scroller'
      className='grid overflow-hidden relative max-h-full  p-12'
      style={{
        gridAutoRows: 'minmax(0, auto)', // Allow items to size themselves
        gap: '0.5rem', // Add some spacing between rows
        alignItems: 'start'
      }}
      ref={containerRef}
    >
      {terminalTexts}
    </div>
  );
}

export default TextContainer;
