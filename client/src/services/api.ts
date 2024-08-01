import axios, { isAxiosError } from 'axios';
const protocol = import.meta.env.VITE_API_PROTOCOL;
const domain = import.meta.env.VITE_API_DOMAIN;

const baseURL = `${protocol}://${domain}`;

type TextResponse = {
  text: string;
};

// runtime type safeguarding
function isTextResponse(data: any): data is TextResponse {
  return data && typeof data.text === 'string';
}

export const fetchText = async (
  endpoint: string,
  controller: AbortController,
): Promise<string> => {
  try {
    const response: any = await axios.get<{ text: string }>(
      `${baseURL}/${endpoint}`,
      {
        signal: controller.signal,
      },
    );
    if (isTextResponse(response.data)) {
      return response.data.text;
    } else {
      throw new Error('Invalid response structure from api');
    }
  } catch (error: any) {
    if (isAxiosError(error)) {
      if (error.response?.status === 500) {
        throw error;
      } else if (error.name === 'CancelledError') {
        throw error;
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }

    throw error;
  }
};
