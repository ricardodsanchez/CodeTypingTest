import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";

console.log(process.env.OCTOKIT_API_KEY);
console.log(process.env);

const octokit = new Octokit({
  auth: process.env.OCTOKIT_API_KEY,
  throttle: {
    onRateLimit: (
      retryAfter: any,
      options: { method: any; url: any; request: { retryCount: number } }
    ) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (
      retryAfter: any,
      options: { method: any; url: any }
    ) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      );
    },
  },
  plugins: [throttling],
});

const codeContainerElement = document.getElementById(
  "codeContainer"
) as HTMLPreElement;
const codeSnippetElement = document.getElementById(
  "codeSnippet"
) as HTMLElement;
const inputElement = document.getElementById(
  "userInput"
) as HTMLTextAreaElement;
const buttonElement = document.getElementById(
  "submitButton"
) as HTMLButtonElement;
const accuracyElement = document.getElementById("accuracy") as HTMLElement;
const timeElement = document.getElementById("time") as HTMLElement;
const counterElement = document.getElementById("counter") as HTMLElement;
const countdownElement = document.getElementById("countdown") as HTMLElement;
const repoNameElement = document.getElementById("repoName") as HTMLElement;
const repoUrlElement = document.getElementById("repoUrl") as HTMLElement;

let codeSnippet: string;
let startTime: number;
let endTime: number;
let lastCallTime = 0;

async function getCodeSnippet(): Promise<string> {
  // Check if enough time has passed since the last call
  const now = Date.now();
  if (now - lastCallTime < 30000) {
    buttonElement.className = "button";
    return "The game can't be started more than once in 30 seconds. Wait a minute and try again.";
  }
  lastCallTime = now;

  const jsQuery = "function language:js in:file size:<500";
  const cSharp = "public language:csharp in:file size:<500";

  const query = cSharp;
  const { data } = await octokit.rest.search.code({ q: query, per_page: 50 });
  const items = data.items.filter(
    (item) => item.repository.owner.type === "User" && !item.repository.private
  );

  if (items.length === 0) {
    buttonElement.className = "button";
    return "No matching repositories found";
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  const repository = items[randomIndex];

  repoNameElement.textContent = `Repo name: ${repository.repository.name}`;
  repoUrlElement.textContent = `Repo URL: ${repository.repository.url}`;

  const { data: fileContent } = await octokit.request(`GET ${repository.url}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  });

  return fileContent;
}

async function startGame() {
  codeSnippet = "";
  codeSnippetElement.textContent = "";
  accuracyElement.textContent = "";
  timeElement.textContent = "";
  inputElement.value = "";
  inputElement.disabled = false;
  repoNameElement.textContent = "";
  repoUrlElement.textContent = "";
  countdownElement.textContent = "";
  counterElement.textContent = "";
  

  console.log("Starting game...");
  buttonElement.className = "button disabled";
  codeSnippet = await getCodeSnippet();
  codeContainerElement.style.display = "block";
  codeSnippetElement.textContent = codeSnippet;
  inputElement.style.display = "block";

  const timerWriteCodeId = setInterval(typeText, 15);
}

let currentIndex = 0;

function typeText() {
  if (codeSnippet !== undefined) {
    if (currentIndex < codeSnippet.length) {
      codeSnippetElement.textContent = codeSnippet.substring(
        0,
        currentIndex + 1
      );
      currentIndex++;
    } else {
      clearInterval(timerWriteCodeId);
    }
  }
}

const timerWriteCodeId = setInterval(typeText, 25);

function endGame() {
  endTime = new Date().getTime();
  const totalTime = (endTime - startTime) / 1000;
  const totalChars: number = codeSnippet.length;
  const typedChars = inputElement.value.length;
  const accuracy = (typedChars / totalChars) * 100;
  accuracyElement.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
  timeElement.textContent = `Time: ${totalTime.toFixed(2)} seconds`;
  inputElement.disabled = true;
  buttonElement.className = "button";
  codeSnippet = "";
}

function updateCountdown() {
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - startTime;
  const timeLeft = 10000 - timeElapsed;
  const secondsLeft = Math.max(Math.ceil(timeLeft / 1500), 0);
  countdownElement.textContent = `Seconds left: ${secondsLeft.toString()}`;

  if (timeLeft <= 0) {
    endGame();
  } else {
    setTimeout(updateCountdown, 1000);
  }
}

buttonElement.addEventListener("click", startGame);

let timerId: string | number | NodeJS.Timeout | undefined; // declare a variable to hold the timeout ID

inputElement.addEventListener("input", () => {
  if (!startTime) {
    startTime = new Date().getTime();
    updateCountdown(); // start the countdown timer
  }
  clearTimeout(timerId); // clear any previous timeouts
  timerId = setTimeout(endGame, 10000); // set a new timeout for 10 seconds
  const typedChars = inputElement.value.length;
  const matchingChars = codeSnippet.substring(0, typedChars);

  counterElement.textContent = `Characters typed: ${typedChars.toString()} | `;

  if (inputElement.value === codeSnippet) {
    endGame();
  }
});
