# CodeTypingTest
A simple typing code game written in TypeScript. It also uses the Octokit API.

The app has one button. Once you click it to start the game, a call to the Octokit API will return the sample code from GitHub.
At this point, a text input component will be visible. After you click on it to start typing, a countdown will begin and stop after 10 seconds. The goal is to type the same code shown in this box and do it as fast as possible. Once the countdown ends, you'll get a number representing accuracy and completeness.

## Running it locally

- Clone the repo
- Get a personal GitHub token to access the Octokit API
- Add your personal token to `process.env.OCTOKIT_API_KEY` 
- run `npm i`
- run `npx parcel src/index.html`
