# Emergency Plan Document Generator

Web app for creating, saving, and exporting emergency plan documents as PDF files.

## Features

- Email/password sign-in with Firebase Authentication
- Create emergency plan forms with structured sections
- Export completed plans to PDF
- Save drafts to Firestore
- Edit and delete saved drafts

## Tech Stack

- React 19
- Vite
- React Router
- Firebase (Authentication, Firestore, Analytics)
- jsPDF

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm
- Firebase project with Auth + Firestore enabled

## Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd emergency-plan-document-generator
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - run development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Project Structure

```text
src/
  components/      # Shared UI layout components
  config/          # Firebase configuration
  pages/           # Application pages
  services/        # Firestore draft CRUD logic
  utils/           # PDF generation utility
```

## Deployment Notes

- Ensure the project root contains `README.md` so GitHub shows it on the repository front page.
- If your GitHub repository root is different, move this file to that root folder.

## License

No license specified yet.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
