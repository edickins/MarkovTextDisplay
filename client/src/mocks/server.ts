import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const Server = setupServer(...handlers);

Server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});
