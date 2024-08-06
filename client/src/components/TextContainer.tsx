import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import useGetTerminalText from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';

function TextContainer() {
  const [terminalTexts, setTerminalTexts] = useState<React.ReactNode[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { text, getNewText } = useGetTerminalText();

  const removeTerminalTextItem = useCallback(
    (index: number) => {
      terminalTexts.splice(index, 1);
    },
    [terminalTexts]
  );

  // Side effect for when a new text arrives from the API
  useEffect(() => {
    if (text && !isTyping) {
      setTerminalTexts((prev) => [
        ...prev,
        <TerminalText
          text={text}
          key={nanoid()}
          removeMe={() => removeTerminalTextItem(0)}
        />
      ]);
    }
  }, [text, isTyping, terminalTexts, removeTerminalTextItem]);

  // Side effect to start typing-effect on the text in the new TerminalText component
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');

    if (textElementToAnimate && !isTyping) {
      setIsTyping(true);
      typingEffect(textElementToAnimate).then(() => {
        setTimeout(() => {
          setIsTyping(false);
          getNewText();
        }, 1000);
      });
    }
  }, [isTyping, getNewText]);

  return (
    <div
      id='container-scroller'
      className='flex flex-col h-screen relative bottom-0 bg-red-400'
    >
      {terminalTexts}
    </div>
  );
}

export default TextContainer;
