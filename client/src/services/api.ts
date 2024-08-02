import axios, { AxiosInstance } from 'axios';

// Get the protocol and domain from environment variables
const protocol = import.meta.env.VITE_API_PROTOCOL;
const domain = import.meta.env.VITE_API_DOMAIN;
const baseURL = `${protocol}://${domain}`;

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});

type TextResponse = {
  text: string;
};

// Type guard for runtime type checking
function isTextResponse(data: any): data is TextResponse {
  return data && typeof data.text === 'string';
}

export const fetchText = async (
  endpoint: string,
  controller: AbortController,
): Promise<string> => {
  try {
    const response = await instance.get<TextResponse>(endpoint, {
      signal: controller.signal,
    });
    if (isTextResponse(response.data)) {
      return response.data.text;
    } else {
      throw new Error('Invalid response structure from API');
    }
  } catch (error: any | Error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        throw error;
      } else if (error.name === 'Cancel') {
        throw error;
      } else {
        console.log(
          `Error fetching data from ${baseURL}/${endpoint}:`,
          error.message,
        );
      }
    }
    throw error;
  }
};
