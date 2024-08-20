# MarkovTextDisplay

A client-server application that generates text using Markov chains and displays it in a faux terminal within a React app.

## Overview

- **Server (Express):**
  - Provides a single endpoint that generates text using Markov chains.
  - The Markov-generated text is like a digital oracle—cryptic, intriguing, and occasionally profound.
  - It's the whisperer behind the scenes, weaving sentences from the fabric of probability.

- **Client (React/TypeScript):**
  - Renders the Markov text in a faux terminal interface.
  - Imagine a retro terminal, complete with blinking cursor and mysterious output.
  - Users can watch the Markov text simulating an AI assistant that is failing and glitching.  Think HAL 9000 as the processors shut down.

## Installation

1. Clone this repository:
git clone <repository_url>


2. Install dependencies:
cd MarkovTextDisplay npm install


3. Start the server:
cd server
npm run dev


4. Start the client:
cd client
npm run dev


## Usage

- Open your browser and visit `http://localhost:5173`.
- Behold the Markov-generated wisdom flowing through the terminal.
- Feel free to tweak the Markov parameters or add your own data for even more cryptic results.

## MSW
a Mock Service Worker exists and can be run as an alternative, locally, to the Express server running on PORT 5000
the MSW is also used in tests for the client.

## Contributing

Pull requests are welcome! If you discover a bug, have an improvement idea, or just want to say hi, feel free to contribute.

## License

This project is licensed under the MIT License. See the LICENSE file for details.



