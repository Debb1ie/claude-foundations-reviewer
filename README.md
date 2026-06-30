# Claude Foundations Reviewer

Claude Foundations Reviewer is an interactive, web-based exam preparation platform designed to help users test their knowledge across various domains. It provides a comprehensive examination environment with features like mode selection, advanced practice, result summaries, and review overviews.

## Features

- **Interactive Exam Interface**: Take exams in a distraction-free, responsive UI.
- **Multiple Modes**: Choose between different practice modes and domains using the `ModeSelector`.
- **Advanced Practice**: Challenge yourself with an advanced set of questions.
- **Result Summaries**: Get immediate, detailed feedback on your performance after completing an exam.
- **State Management**: Robust exam state handling built with Zustand.
- **Modern UI**: Polished, accessible design powered by Chakra UI and animated with Framer Motion.

## Tech Stack

This project is built with a modern frontend stack:
- **[Next.js](https://nextjs.org/)**: React framework for production (App Router).
- **[React](https://reactjs.org/)**: Library for building user interfaces.
- **[Chakra UI](https://chakra-ui.com/)**: Simple, modular, and accessible component library.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library for React.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Small, fast, and scalable bearbones state-management.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **TypeScript**: Static typing for better developer experience and reliability.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. We recommend using `npm` or `yarn` or `pnpm` or `bun` as your package manager.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd claude-foundations-reviewer
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will automatically redirect you to the `/home` page to start your exam session.

## Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint to catch and fix code issues.

## Project Structure

- `app/`: Contains the Next.js App Router pages (`home/`, `exam/`, `overview/`, `advanced/`, `sources/`).
- `components/`: Reusable React components (`ModeSelector`, `ExamView`, `AdvancedPracticeView`, `ResultsSummary`, etc.).
- `data/`: Exam questions and domain data (`questions.json`, `advanced-questions.json`).
- `hooks/`: Custom React hooks, including Zustand store for exam state (`useExamState.ts`).
- `theme/`: Theme customization and overrides for Chakra UI.
- `types/`: TypeScript definitions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
