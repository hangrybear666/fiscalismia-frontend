# Fiscalismia Frontend
Dashboard and Reporting UI for Fiscalismia.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments. Advanced capabilities are available for dynamically updating supermarket grocery deals via web automation scraping data from supermarket websites.

## Technical Overview

fiscalismia-frontend is a REACT service rendered with Material UI, utilizes axios to communicate with a Node.js REST API in the backend. JWT tokens are used for authentication.
The REACT elements are designed with full CRUD operations in mind, to seed, manipulate and analyze the data within the backend's cloud hosted production db.
The frontend is built in a continuous integration pipeline, tested, scanned for vulnerabilities and published as a docker image to a public docker registry for later deployment in your environment of choice.


## Table of Contents

- [Technologies](#technologies)
- [DevOps Pipeline](#pipeline)
- [Setup](#setup)
- [Running](#running)
- [Usage](#usage)
- [License](#license)


## Technologies

- **Github Actions:** CI/CD Pipeline for automating type checking, eslint analysis, integration testing, vulnerability scanning, building, publishing and deploying.
- **Docker:** Frontend, Backend and Dev-Database run within docker containers, orchestrated for fullstack development with one docker compose command.
- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext. Mid-project Migration from plain JavaScript (ECMAScript 2016).
- **React:** A JavaScript library for building user interfaces, maintained by Facebook.
- **Material UI:** A popular React UI framework developed by Google, providing a set of pre-designed components for a consistent and visually appealing interface.
- **JWT Auth:** JSON Web Token authentication is used for securing and verifying the authenticity of API requests.
- **Snyk:** Static Code security analysis, dependency security analysis, monitoring and notifications on detected security issues.
- **Vite:** A fast & efficient build tool with Hot Module Replacement (HMR) allowing modules to be updated in real-time during development without requiring a full page refresh.
- **Axios:** A promise-based HTTP client for making requests to the backend API and handling asynchronous operations.
- **Chart.js:** A simple yet flexible JavaScript charting library for adding interactive charts and graphs to the application.
- **Jest and React Testing Library:** Used for unit testing to ensure the reliability of individual components.
- **Playwright:** Employed for post-deployment integration testing, specifically Smoketesting, ensuring that the server isn't crashing and burning.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.

## Pipeline

1. **Triggers:**
   - The pipeline runs on every push and pull request to the `main` branch.

2. **Job: `test`**:
   - **Steps:**
     - Set up Node.js (v20.12.2), install dependencies and Snyk.
     - Run type checks and ESLint analysis.
     - Perform Snyk dependency security analysis.
     - Perform Snyk Static Code security analysis.
     - Publish type check, ESLint, and Snyk reports as artifacts.
     - TODO: Playwright Integration Test covering basic UI interactions.

3. **Job: `build`**:
   - **Steps:**
     - Build Frontend Docker image.
     - Publish Docker image to GHCR (TODO: Switch to AWS ECR)

4. **Job: `deploy`**:
   - **Steps:**
     - TODO: Deploy on EC2 Instance via AWS CLI

## Setup

**Dependencies**

1. **Node.js:** Ensure that Node.js is installed on your local machine, with a minimum version of 20.12.2 You can download Node.js via Node Version Switcher [here](https://github.com/jasongin/nvs) or directly from the source [here](https://nodejs.org/).

2. **Docker & Docker Compose** Ensure that Docker is installed in your local development environment. Get Docker [here](https://docs.docker.com/get-docker/) and Docker Compose [here](https://docs.docker.com/compose/install/).

3. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/fiscalismia-frontend.git
   ```

4. **The Backend and Database must be running:**
   See https://github.com/hangrybear666/fiscalismia-backend

**Installation**

1. **Navigate to Project Folder:**

   ```bash
   cd fiscalismia-frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Create Environment file**

   Create an `.env` file in the root directory with the following contents

   ```bash
   FRONTEND_PORT=3001
   SNYK_TOKEN=
   ```

4. **Github Secrets:**

   Set up Github Secrets in your Repository Settings, for the pipeline to run successfully. These can and should be the same as in your `.env` file.
   ```bash
   SNYK_TOKEN
   ```

## Running

1. **Option 1: Docker Compose**

   To run the entire stack in development mode, <b>change directory to</b> `fiscalismia-backend`

   ```bash
   docker compose build
   docker compose up
   ```

2. **Option 2: Locally:**

   Run only the frontend locally.
   ```bash
   npm run dev
   ```

3. **Option 3: Docker:**

   <details open>
   <summary><b>Run only the frontend container (Linux Syntax)</b></summary>

   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-frontend:latest "."
   docker run -v $PWD/src:/fiscalismia-frontend/src --env-file .env --net fiscalismia-network --rm -it -p 3001:3001 --name fiscalismia-frontend fiscalismia-frontend:latest
   ```

   </details>

   ------

   <details closed>
   <summary><b>Run only the frontend container (Windows Syntax)</b></summary>

   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-frontend:latest "."
   docker run -v %cd%\src:/fiscalismia-frontend/src --env-file .env --rm -it -p 3001:3001 --name fiscalismia-frontend fiscalismia-frontend:latest
   ```

   </details>

## Usage

Once the frontend, database and backend are up and running, the website will be ready at http://localhost:3001

## Testing

The tests are executed in each github-actions workflow execution but can be run manually.

All tests generate report files in the `reports/` subdirectory.

1. **Static Code Analysis**

   Eslint is used to ensure a consistent codebase adhering to certain coding standards configured in `.eslintrc.js`.
   Typecheck runs the Typescript Compiler which is configured with high strictness in `tsconfig.json`.


   ```bash
   npm run typeCheck
   npm run eslintAnalysis
   ```

2. **Playwright Web Automation Integration Tests**

   todo


3. **Snyk Security Analysis**

   `SNYK_TOKEN` has to be set in `.env` file.
   Get one for free by creating a snyk account [here](https://app.snyk.io/login)

   Vulnerability scanning of both the codebase and installed dependencies.

   Once per workspace
   ```bash
   # with snyk cli installed
   snyk auth SNYK_TOKEN
   # without snyk cli installed
   npx snyk auth SNYK_TOKEN
   ```

   On demand
   ```bash
   npm run snykCodeAnalysis
   npm run snykDependencyAnalysis
   ```

## License

This project is licensed under the [MIT License](LICENSE).
