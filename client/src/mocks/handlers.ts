// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpResponse, http } from 'msw';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  wordsPerSentence: { max: 5, min: 1 }
});

type TextResponseObject = {
  data: string;
};

const handlers = [
  http.get<Record<string, never>, TextResponseObject>(
    `http://localhost:5000/api/v1/markovtext`,
    () => {
      return HttpResponse.json({
        success: true,
        text: `${lorem.generateWords()} the quick brown fox jumped over the lazy dog ${lorem.generateWords()}`
      });
    }
  )
];

export default handlers;
