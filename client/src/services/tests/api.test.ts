import { HttpResponse, http } from 'msw';
import server from '../../mocks/server';
import fetchText from '../api';

describe('API service', () => {
  afterAll(() => {
    server.resetHandlers();
  });

  test('returns data from the RESTful api', async () => {
    const controller: AbortController = new AbortController();
    const regEx = /the quick brown fox jumped over the lazy dog/;

    try {
      const text: string = await fetchText('/api/v1/markovtext', controller);
      expect(text).toMatch(regEx);
    } catch (error) {
      console.log('Error in test', error);
    }
  });

  test('Network error throws an error object', async () => {
    const controller: AbortController = new AbortController();
    server.use(
      http.get('http://localhost:5000/api/v1/markovtext', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    try {
      await fetchText('/api/v1/markovtext', controller);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        expect(error.message).toEqual(`Request failed with status code 500`);
      }
    }
  });
});
