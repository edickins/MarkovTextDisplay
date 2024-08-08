import axios, { AxiosInstance } from 'axios';

// Get the protocol and domain from environment variables
const baseURL = `http://localhost:5000`;

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000
});

type TextResponse = {
  text: string;
};

// Type guard for runtime type checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTextResponse(data: any): data is TextResponse {
  return data && typeof data.text === 'string';
}

const fetchText = async (
  endpoint: string,
  controller: AbortController
): Promise<string> => {
  try {
    const response = await instance.get<TextResponse>(endpoint, {
      signal: controller.signal
    });
    if (isTextResponse(response.data)) {
      return response.data.text;
    }
    throw new Error('Invalid response structure from API');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any | Error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        throw error;
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
      }
    }
    throw error;
  }
};

export default fetchText;
