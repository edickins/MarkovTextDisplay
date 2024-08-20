import axios from 'axios';
import { useState, useCallback } from 'react';
import fetchText from '../services/api';
import RequestConfigObj from '../services/RequestConfigObj';
import RequestConfigEnum from '../enums/RequestConfigEnum';

const useGetTerminalText = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      controller: AbortController,
      requestConfigObj?: RequestConfigObj
    ): Promise<{ newText: string; newRequestConfigObj: RequestConfigObj }> => {
      // if no requestConfigObj is passed create a new one to initial AI startup responses
      const configObj =
        requestConfigObj || new RequestConfigObj(RequestConfigEnum.DEFAULT);

      setLoading(true);
      setError('');
      try {
        const { newText, newRequestConfigObj } = await fetchText(
          'api/v1/markovtext',
          controller,
          configObj
        );
        setError('');
        return { newText, newRequestConfigObj };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError('Error fetching text from the API');
        } else {
          setError('An unexpected error occurred');
        }
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // exported function that sets 'text'
  const getNewText = async (requestConfigObj: RequestConfigObj) => {
    const controller = new AbortController();

    try {
      // fetchData passing the requestConfigObj
      const { newText, newRequestConfigObj } = await fetchData(
        controller,
        requestConfigObj
      );
      return { newText, newRequestConfigObj };
    } catch (err) {
      throw new Error('There was an error fetching text');
    }
  };

  return { getNewText, loading, error };
};

export default useGetTerminalText;
