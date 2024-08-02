import { HttpResponse, http, delay } from 'msw';
import { LoremIpsum } from 'lorem-ipsum';

const protocol = import.meta.env.VITE_API_PROTOCOL;
const domain = import.meta.env.VITE_API_DOMAIN;
const lorem = new LoremIpsum({
  wordsPerSentence: { max: 5, min: 1 },
});

type TextResponseObject = {
  data: string;
};

const handlers = [
  http.get<{}, TextResponseObject>(
    `${protocol}://${domain}/markovText`,
    (req) => {
      return HttpResponse.json({
        text: `${lorem.generateWords()} the quick brown fox jumped over the lazy dog ${lorem.generateWords()}`,
      });
    },
  ),
];

export { handlers };
