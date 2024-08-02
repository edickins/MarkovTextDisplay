import { useState, useEffect } from 'react';
import { fetchText } from '../services/api';

export const useGetTerminalText = () => {
  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      const newText = await fetchText('markovText', controller);
      setText(newText);
    };

    fetchData();

    // cleanup function
    return () => controller.abort();
  }, []);

  const getNewText = async () => {
    const controller = new AbortController();
    try {
      const newText = await fetchText('markovText', controller);
      setText(newText);
    } finally {
      controller.abort();
    }
  };

  return { text, getNewText };
};
