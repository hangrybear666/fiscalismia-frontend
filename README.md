# Fiscalismia Frontend
Admin Dashboard and User Interface for Fiscalismia.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments. Advanced capabilities are available for synthesizing supermarket grocery deals.

## Technical Overview

fiscalismia-frontend is a REACT service rendered with Material UI, utilizes axios to communicate with a Node.js REST API in the backend. JWT tokens are used for authentication.
The REACT elements are designed with full CRUD operations in mind, to seed, manipulate and analyze the data within the backend's cloud hosted db.
The frontend is built in a continuous integration pipeline, tested, scanned for vulnerabilities and published as a docker image to a public docker registry before being deployed to the cloud.

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)


## Technologies

- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext. Mid-project Migration from plain JavaScript (ECMAScript 2016).
- **React:** A JavaScript library for building user interfaces, maintained by Facebook.
- **Material UI:** A popular React UI framework developed by Google, providing a set of pre-designed components for a consistent and visually appealing interface.
- **Jenkins:** A DevOps automation server that orchestrates the development pipeline, helping in building, testing, and deploying the application fully automated.
- **JWT Auth:** JSON Web Token authentication is used for securing and verifying the authenticity of API requests.
- **Docker:** Jenkins runs in a Docker container, the pipeline itself uses further containers providing a consistent environment for the entire development workflow.
- **Vite:** A fast & efficient build tool with Hot Module Replacement (HMR) allowing modules to be updated in real-time during development without requiring a full page refresh.
- **Axios:** A promise-based HTTP client for making requests to the backend API and handling asynchronous operations.
- **Chart.js:** A simple yet flexible JavaScript charting library for adding interactive charts and graphs to the application.
- **Jest and React Testing Library:** Used for unit testing to ensure the reliability of individual components.
- **Playwright:** Employed for post-deployment integration testing, specifically Smoketesting, ensuring that the server isn't crashing and burning.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.

## Setup

**Dependencies**

1. **Node.js:** Ensure that Node.js is installed on your local machine, with a minimum version of 20.12.2 You can download Node.js via Node Version Switcher [here](https://github.com/jasongin/nvs) or directly from the source [here](https://nodejs.org/).

2. **Docker & Docker Compose** Ensure that Docker is installed in your local development environment. Get Docker [here](https://docs.docker.com/get-docker/) and Docker Compose [here](https://docs.docker.com/compose/install/).

3. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/fiscalismia-frontend.git
   ```

3. **The Backend and Database must be running:**
   See https://github.com/hangrybear666/fiscalismia-backend

**Installation**

1. **Navigate to the Project Folder:**

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
   PORT=3001
   SNYK_TOKEN=
   ```

**Running**

1. **Run the Frontend either locally or in Docker:**

   ```bash
   # Developing locally
   npm run dev
   ```

   ```bash
   # Developing in docker container
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-frontend:latest "."
   docker run -v %cd%\src:/fiscalismia-frontend/src --env-file .env --rm -it -p 3001:3001 --name fiscalismia-frontend fiscalismia-frontend:latest
   ```

## Usage

Once the frontend and backend are up and running, the website will be ready at http://localhost:3001

## Testing

**All tests generate report files in the `reports/` subdirectory.**

2. **Playwright Web Automation Integration Tests**

   todo

2. **Static Code Analysis**

   Eslint is used to ensure a consistent codebase adhering to certain coding standards configured in `.eslintrc.js`.
   Typecheck runs the Typescript Compiler which is configured with high strictness in `tsconfig.json`.


   ```bash
   npm run typeCheck
   npm run eslintAnalysis
   ```

3. **Snyk Security Analysis**

   `SNYK_TOKEN` has to be set in `.env` file.
   Get one for free by creating a snyk account [here](https://app.snyk.io/login)

   Vulnerability scanning of both the codebase, especially relevant for issues such as SQL Injection and XSS(Cross Site Scripting).
   ```bash
   npm run snykCodeAnalysis
   npm run snykDependencyAnalysis
   ```

## License

This project is licensed under the [MIT License](LICENSE).
