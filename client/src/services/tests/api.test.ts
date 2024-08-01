import { fetchText } from '../api';

describe('API service', () => {
  test('returns data from the RESTful api', async () => {
    const controller: AbortController = new AbortController();
    const regEx = /the quick brown fox jumped over the lazy dog/;

    const text: any = await fetchText('markovText', controller);
    console.log(text);
    expect(text).toMatch(regEx);
  });
});
