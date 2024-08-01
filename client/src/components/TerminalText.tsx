import React from 'react';

type Props = {
  text: string;
};

const TerminalText = React.forwardRef<HTMLDivElement, Props>(
  ({ text }: Props, ref) => {
    return (
      <div data-typing-effect ref={ref}>
        {text}
      </div>
    );
  },
);

export default TerminalText;
