import { createRef, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import useGetTerminalText from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';

function TextContainer() {
  const [terminalTexts, setTerminalTexts] = useState<React.ReactElement[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { text, getNewText } = useGetTerminalText();

  // Side effect for when a new text arrives from the API
  useEffect(() => {
    if (text && !isTyping) {
      const ref = createRef<HTMLDivElement>();
      setTerminalTexts((prev) => [
        ...prev,
        <TerminalText text={text} key={nanoid()} ref={ref} />
      ]);
    }
  }, [text, isTyping]);

  // Side effect to start typing-effect on the text in the new TerminalText component
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');

    if (textElementToAnimate && !isTyping) {
      setIsTyping(true);
      typingEffect(textElementToAnimate).then(() => {
        console.log('animation finished');
        setIsTyping(false);
        getNewText(); // Fetch new text after the animation completes
      });
    }
  }, [terminalTexts, isTyping, getNewText]);

  return <div>{terminalTexts}</div>;
}

export default TextContainer;
