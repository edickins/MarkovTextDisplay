// eslint-disable-next-line import/no-extraneous-dependencies
import { setupWorker } from 'msw/browser';
import handlers from './handlers';

const worker = setupWorker(...handlers);

worker.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

export default worker;
