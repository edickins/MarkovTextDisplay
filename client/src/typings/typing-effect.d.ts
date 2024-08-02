// src/typings/typing-effect.d.ts
declare module 'typing-effect' {
  interface TypingEffectOptions {
    speed?: number;
    delay?: number;
    reset?: boolean;
  }

  export default function typingEffect(
    elements: Element | Element[],
    options?: TypingEffectOptions,
  ): Promise<void>;
}
