# Code Typing Game

A simple web-based typing game that allows users to practice their coding skills by typing randomly-selected code snippets within a time limit.

## Features

- Fetches random code snippets from GitHub
- Displays a countdown timer for the user to complete the typing challenge
- Calculates and displays the user's accuracy and time taken to type the code snippet
- Implements a rate-limiting mechanism for the GitHub API to avoid quota exhaustion

## Setup

1. Clone the repository: `git clone https://github.com/ricardodsanchez/code-typing-game.git`

2. In VS Code, type the following in terminal window:
`npx parcel src/index.html`

`npx`: is a command-line tool that comes with npm. It is used to execute a package without installing it globally, making it easier to run packages that are installed locally within a project.

`parcel`: Parcel is a web application bundler that bundles web assets like HTML, CSS, JavaScript, and images. It handles dependency management, optimization of bundled assets for production, and features a zero-configuration approach.

`src/index.html`: This is the entry point of your web application. It is the main HTML file from which your application starts. The src folder typically contains the source code for your web application, including HTML, CSS, JavaScript, and other assets.

## Usage

1. Click the "Start Game" button to fetch a random code snippet.
2. Start typing the code snippet in the provided text area.
3. The countdown timer will start as soon as you start typing.
4. Try to type the entire code snippet before the timer reaches zero.
5. The game will display your accuracy and time taken to type the code snippet once you complete it or when the time runs out.

## Contributing

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit and push your changes to your branch.
4. Open a pull request with a description of the changes you've made.

## License

MIT
