import { useCallback, useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import useGetTerminalText from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';

function TextContainer() {
  const [terminalTexts, setTerminalTexts] = useState<React.ReactNode[]>([]);
  const [isWaitingForAnimation, setIsWaitingForAnimation] =
    useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { text, getNewText } = useGetTerminalText();

  const removeTerminalTextItem = useCallback(
    (index: number) => {
      terminalTexts.splice(index, 1);
    },
    [terminalTexts]
  );

  // Side effect for when a new text arrives from the API
  useEffect(() => {
    if (text && !isWaitingForAnimation) {
      setIsWaitingForAnimation(true);
      setTerminalTexts((prev) => [
        ...prev,
        <TerminalText
          text={text}
          key={nanoid()}
          removeMe={() => removeTerminalTextItem(0)}
        />
      ]);
    }
  }, [text, terminalTexts, removeTerminalTextItem, isWaitingForAnimation]);

  // Side effect to start typing-effect on the text in the new TerminalText component
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');
    if (textElementToAnimate) {
      typingEffect(textElementToAnimate).then(() => {
        setTimeout(() => {
          getNewText().then(() => setIsWaitingForAnimation(false));
        }, 1500);
      });
    }
  }, [text, getNewText]);

  return (
    <div
      id='container-scroller'
      className='flex flex-col  overflow-auto  relative h-full bottom-0 p-12 bg-red-400'
      ref={containerRef}
    >
      {terminalTexts}
    </div>
  );
}

export default TextContainer;
