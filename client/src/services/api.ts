import axios, { AxiosInstance } from 'axios';
import RequestConfigObj from './RequestConfigObj';

// Get the domain and PORT from environment variables
const baseURL = import.meta.env.VITE_API_RESTFUL_API_URL;

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000
});

type ServerResponse = {
  text: string;
  configObj: RequestConfigObj;
};

// Type guard for runtime type checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isServerResponse(data: any): data is ServerResponse {
  return (
    data && typeof data.text === 'string' && typeof data.success === `boolean`
  );
}

const fetchText = async (
  endpoint: string,
  controller: AbortController,
  requestConfigObj: RequestConfigObj
): Promise<{ newText: string; newRequestConfigObj: RequestConfigObj }> => {
  try {
    const response = await instance.get<ServerResponse>(endpoint, {
      signal: controller.signal,
      params: {
        ...requestConfigObj
      }
    });

    if (isServerResponse(response.data)) {
      return {
        newText: response.data.text,
        newRequestConfigObj: response.data.configObj
      };
    }
    throw new Error('Invalid response structure from API');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any | Error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        throw new Error('Request failed with status code 500');
      } else if (error.name === 'CanceledError') {
        if (import.meta.env.DEV) {
          console.log('Request canceled:', error.message);
        }
        throw error;
      } else {
        console.log(
          `Error fetching data from ${baseURL}/${endpoint}:`,
          error.message
        );
        throw error;
      }
    }
    throw error;
  }
};

export default fetchText;
