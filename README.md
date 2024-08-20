# MarkovTextDisplay

A client-server application that generates text using Markov chains and displays it in a faux terminal within a React app.

## Overview

- **Server (Express):**

  - Provides a single endpoint that generates text using Markov chains.
  - When a request for text is made, a RequestConfiObj is sent as a set of URLSearchParams along with the Request. These values determine what the server sends back.
  - The Markov-generated text has been tweaked so that it sends text simulating an operating system that is failing and keeps updating the OS screen with these updates. The text is largely nonsense but occasionally profound.
  - It's the whisperer behind the scenes, weaving sentences from the fabric of probability.

- **Client (React/TypeScript):**
  - Renders the Markov text in a faux terminal interface.
  - Imagine a retro terminal typing out text as it glitches and prints mysterious output.
  - Users can watch the Markov text simulating an AI assistant that is failing and glitching. Think HAL 9000 aware of its collapse as the processors shut down.

## Installation

1. Clone this repository:
   git clone (https://github.com/edickins/restfulAPI_markovTextGenerator.git)

2. Install client dependencies:
   cd client
   npm install

3. Install server dependencies:
   cd server
   npm install

4. Start the client:
   cd client
   npm run dev

5. Start the server:
   cd server
   npm run dev

See the section on <configuration> to see how the server and client run in different environments.

## Usage

- Open your browser and visit `http://localhost:5173`.
- Behold the Markov-generated text flowing through the terminal.
- Feel free to tweak the Markov parameters or add your own data for even more cryptic results.

## MSW

A Mock Service Worker exists and can be run as an alternative to the Express RESTful api, locally. Both the MSW and the Express RESTful api server are running on PORT 5000.

The MSW is also used in tests for the client.
The MSW does not use Markov chain generators. It wraps the sentence 'the quick brown dog jumped over the lazy dog' with random amounts of 'lorem ipsum' text.

## Configuration - .env .env.local and .env.production

The default ports are as follows:

- client runs on http://localhost:5173
- express server runs on http://localhost:5000

## Using MSW or alternatively a local express server:

- .env if you are NOT using the express server and you want to use the MSW change VITE_LOCAL_SERVER to false.
- .env.local contains a VITE ENV varible VITE_API_RESTFUL_API_URL
  this env variable is used by axios to get data from either MSW or an instance of the express server running locally.
- .env.production.changeme also contains ITE_API_RESTFUL_API_URL but at the moment it is pointing at http://example.com. To use this in production you need to rename this file .env.production and change http:example.com to the name of your server where the express server is running.

find out more about .env files and vite here https://vitejs.dev/guide/env-and-mode

## Express server .env files

The express server is configured in server/config/config.env.changeme

Firstly rename this to config.env

PORT=5000
NODE_ENV=development

When you deploy the server to your own webserver you need to change NODE_ENV to production when this file is on your server. The default value is for running the Express RESTful api locally is 'development' (but without the quotes obviously).

## Contributing

Pull requests are welcome! If you discover a bug, have an improvement idea, or just want to say hi, feel free to contribute.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
