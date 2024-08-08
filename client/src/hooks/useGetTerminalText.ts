import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import fetchText from '../services/api';

const useGetTerminalText = () => {
  const [text, setText] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (controller: AbortController) => {
    setLoading(true);
    setError(null);
    try {
      const newText = await fetchText('api/v1/markovtext', controller);
      setText(newText);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // set the initial 'text' value so there is something to return when the hook is used
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);

    return () => controller.abort();
  }, [fetchData]);

  // exported function that sets 'text'
  const getNewText = async () => {
    const controller = new AbortController();
    await fetchData(controller);
  };

  return { text, getNewText, loading, error };
};

export default useGetTerminalText;
