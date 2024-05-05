# Fiscalismia Frontend


## Overview

Fiscalismia Frontend is a REACT service communicating via axios with a Node.js express server in the backend. JWT tokens are used for authentication.
The UI itself displays financial data in different timelines and aggregates. The REACT elements are designed with full CRUD operations in mind, to seed, manipulate and analyze the data within the backend's db.

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
- **Vite:** A build tool for modern web development, designed to be fast and efficient.
- **Axios:** A promise-based HTTP client for making requests to the backend API and handling asynchronous operations.
- **Chart.js:** A simple yet flexible JavaScript charting library for adding interactive charts and graphs to the application.
- **Jest and React Testing Library:** Used for unit testing to ensure the reliability of individual components.
- **Playwright:** Employed for post-deployment integration testing, specifically Smoketesting, ensuring that the server isn't crashing and burning.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.

## Setup

**Dependencies**

1. **Node.js:** Ensure that Node.js is installed on your local machine, with a minimum version of 20.9. You can download Node.js via Node Version Switcher [here](https://github.com/jasongin/nvs) or directly from the source [here](https://nodejs.org/).

2. **Clone the Repository:**
   git clone https://github.com/your-username/fiscalismia-frontend.git

**Installation**

1. **Navigate to the Project Folder:**

```bash
cd fiscalismia-frontend
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Run the Frontend Development Server:**

```bash
npm run dev
```

## Usage

Once the server is up and running, it will be ready at http://localhost:5173/

## License

This project is licensed under the [MIT License](LICENSE).
