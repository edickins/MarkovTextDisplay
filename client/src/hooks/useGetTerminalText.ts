import axios from 'axios';
import { useState, useCallback } from 'react';
import fetchText from '../services/api';
import RequestConfigObj, { RequestConfig } from '../services/RequestConfigObj';
import RequestConfigEnum from '../enums/RequestConfigEnum';

const useGetTerminalText = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      controller: AbortController,
      requestConfigObj?: RequestConfig
    ): Promise<{ newText: string; newRequestConfigObj: RequestConfig }> => {
      // if no requestConfigObj is passed create a new one to initial AI startup responses
      const configObj =
        requestConfigObj || new RequestConfigObj(RequestConfigEnum.DEFAULT);

      setLoading(true);
      setError(null);
      try {
        const { newText, newRequestConfigObj } = await fetchText(
          'api/v1/markovtext',
          controller,
          configObj
        );
        return { newText, newRequestConfigObj };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // exported function that sets 'text'
  const getNewText = async (requestConfigObj: RequestConfig) => {
    const controller = new AbortController();

    try {
      // fetchData passing the requestConfigObj
      const { newText, newRequestConfigObj } = await fetchData(
        controller,
        requestConfigObj
      );
      return { newText, newRequestConfigObj };
    } catch (err) {
      throw new Error('there was an error fetching text');
    }
  };

  return { getNewText, loading, error };
};

export default useGetTerminalText;
