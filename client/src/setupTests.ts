/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import { Server } from './mocks/server';

beforeAll(() => {
  Server.listen();
});

afterEach(() => {
  Server.resetHandlers();
});

afterAll(() => {
  Server.close();
});
