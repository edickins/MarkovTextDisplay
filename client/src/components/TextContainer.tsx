import { createRef, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import { useGetTerminalText } from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';

function TextContainer() {
  const [terminalTexts, setTerminalTexts] = useState<React.ReactElement[]>([]);
  const { text, getNewText } = useGetTerminalText();

  // side effect for when a new text arrives from the api
  useEffect(() => {
    if (text) {
      const ref = createRef<HTMLDivElement>();
      setTerminalTexts((prev) => [
        ...prev,
        <TerminalText text={text} key={nanoid()} ref={ref} />,
      ]);
    }
  }, [text]);

  // side effect to start typing-effect on the text in the new TerminalText component
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');

    if (textElementToAnimate) {
      typingEffect(textElementToAnimate).then(() => {
        console.log('animation finished');
      });
    }
  }, []);

  return <div>{terminalTexts}</div>;
}

export default TextContainer;
