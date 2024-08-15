import { useEffect, useState, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import useGetTerminalText from '../hooks/useGetTerminalText';
import TerminalText from './TerminalText';
import RequestConfigObj from '../services/RequestConfigObj';
import RequestConfigEnum from '../enums/RequestConfigEnum';

function TextContainer() {
  const [text, setText] = useState('');
  const [requestConfigObj, setRequestConfigObj] = useState<RequestConfigObj>(
    new RequestConfigObj(RequestConfigEnum.DEFAULT)
  );
  const [terminalTexts, setTerminalTexts] = useState<React.ReactNode[]>([]);
  const [toBeRemovedIndexes, setToBeRemovedIndexes] = useState<number[]>([]);
  const [isWaitingForAnimation, setIsWaitingForAnimation] =
    useState<boolean>(false);
  const [doReset, setDoReset] = useState(false);

  const glitchTimeoutIDRef = useRef<
    string | number | NodeJS.Timeout | undefined
  >(undefined);

  const restartTimeoutIDRef = useRef<
    string | number | NodeJS.Timeout | undefined
  >(undefined);

  const { getNewText } = useGetTerminalText();
  const containerRef = useRef<HTMLDivElement>(null);

  const resetRequestConfigObj = useCallback(
    (currentConfigObj: RequestConfigObj) => {
      if (currentConfigObj.isInitialised) {
        setTerminalTexts([]);
        setDoReset(false);
        return new RequestConfigObj(RequestConfigEnum.RESTART);
      }
      return currentConfigObj;
    },
    []
  );

  // restart side-effect
  useEffect(() => {
    if (doReset) return;
    const interval = Math.floor(Math.random() * 85000) + 20000;
    console.log(`interval: ${interval / 1000}s`);
    restartTimeoutIDRef.current = setTimeout(() => {
      setDoReset(true);
    }, interval);
  }, [doReset]);

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

  // initial side-effect to start the routine
  useEffect(() => {
    if (!text) {
      try {
        // getNewText from the server. returns {text:string, newRequestConfigObj:RequestObj}
        getNewText(requestConfigObj).then(
          ({ newText, newRequestConfigObj }) => {
            setText(newText);
            setRequestConfigObj((prevConfig) => ({
              ...prevConfig,
              ...newRequestConfigObj
            }));
          }
        );
      } catch (error) {
        throw new Error('There was an error fetching text.');
      }
    }
  }, [getNewText, requestConfigObj, text]);

  // Side effect for when a new text arrives from the API
  // adds a TerminalText component if there's text and we're not waiting for the animation to finish
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

  // Side effect to start typing-effect
  // if there is an item to animate and the app is waiting for animation to start
  useEffect(() => {
    const textElementToAnimate = document.querySelector('[data-typing-effect]');
    if (textElementToAnimate && isWaitingForAnimation) {
      typingEffect(textElementToAnimate, {
        speed: 100,
        reset: true
      }).then(() => {
        setTimeout(() => {
          getNewText(requestConfigObj).then(
            ({ newText, newRequestConfigObj }) => {
              let configObj = newRequestConfigObj;
              // reset config obj to display startup text?
              if (doReset) {
                configObj = resetRequestConfigObj(newRequestConfigObj);
              }
              setRequestConfigObj((prevConfig) => ({
                ...prevConfig,
                ...configObj
              }));
              setIsWaitingForAnimation(false);
              setText(newText);
            }
          );
        }, 1500);
      });
    }
  }, [
    text,
    getNewText,
    requestConfigObj,
    isWaitingForAnimation,
    resetRequestConfigObj,
    doReset
  ]);

  // Glitch effect
  useEffect(() => {
    const randomGlitch = () => {
      if (glitchTimeoutIDRef.current) return;

      // Randomly decide whether to apply the glitch effect
      const shouldGlitch = Math.random() < 0.5; // 20% chance to glitch

      if (shouldGlitch) {
        containerRef?.current?.classList.add('glitch-text');
        // Start a timer to stop the glitch and decide again
        glitchTimeoutIDRef.current = setTimeout(() => {
          containerRef?.current?.classList.remove('glitch-text');
          glitchTimeoutIDRef.current = undefined;
          // Start a new timer for the next decision
          const nextRandomDelay = Math.random() * 4000 + 100;
          setTimeout(randomGlitch, nextRandomDelay);
        }, 10000);
      } else {
        // Start a timer to make the decision again
        containerRef?.current?.classList.remove('glitch');
        const nextRandomDelay = Math.random() * 4000 + 100;

        glitchTimeoutIDRef.current = setTimeout(() => {
          glitchTimeoutIDRef.current = undefined;
          randomGlitch(); // Decide again
        }, nextRandomDelay);
      }
    };

    // Initial call to start the process
    randomGlitch();

    return () => {
      // Cleanup function to clear timeouts if the component unmounts
      clearTimeout(glitchTimeoutIDRef.current);
    };
  }, []);

  return (
    <div
      id='container-scroller'
      className='grid overflow-hidden relative max-h-full  p-8 md:p-12 '
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
