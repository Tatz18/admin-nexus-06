# 🚀 Admin Nexus 06: A Modern Dashboard Foundation

Admin Nexus 06 is a robust and flexible boilerplate for building powerful administration panels and dashboards. Leveraging the latest web technologies, including TypeScript, React, and Tailwind CSS, this project provides a solid foundation with a rich set of UI components from Radix UI, making it incredibly easy to craft beautiful and functional admin interfaces.

## ✨ Key Features

*   **TypeScript-First Development** 📐: Enjoy enhanced code quality, better maintainability, and fewer runtime errors with a fully typed codebase.
*   **React Power** ⚛️: Build dynamic and responsive user interfaces with the leading JavaScript library for UI development.
*   **Tailwind CSS for Rapid Styling** 🎨: Utilize a utility-first CSS framework for lightning-fast and highly customizable styling without writing traditional CSS.
*   **Shadcn/ui Components (Radix UI)** 🧩: Integrated beautiful, accessible, and customizable UI components built on Radix UI, providing a consistent and polished look and feel.
*   **Bundler Performance with Vite** ⚡: Experience incredibly fast development server startup and hot module reloading, along with optimized production builds.
*   **Form Management with React Hook Form** ✍️: Seamless and efficient form handling with validation powered by `@hookform/resolvers`.
*   **Supabase Integration (Planned)** ☁️: Designed with future-proof integration for Supabase, making it easy to connect to a powerful backend.
*   **ESLint for Code Quality** 🧹: Maintain consistent code style and catch potential issues early with pre-configured ESLint rules.
*   **Responsive Design** 📱: Components are built with responsiveness in mind, ensuring a great experience across all devices.

## 🛠️ Tech Stack

<p align="left">
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
  </a>
  <a href="https://react.dev/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/>
  </a>
  <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/main/icons/vitejs/vitejs-original.svg" alt="vite" width="40" height="40"/>
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/>
  </a>
  <a href="https://radix-ui.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> <!-- Radix UI doesn't have a devicon, using HTML5 as a placeholder -->
  </a>
  <a href="https://supabase.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg" alt="supabase" width="40" height="40"/>
  </a>
  <a href="https://eslint.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/eslint/eslint-original-wordmark.svg" alt="eslint" width="40" height="40"/>
  </a>
</p>

## 🚀 Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/).

### Clone the Repository

First, clone the repository to your local machine using git:

```bash
git clone https://github.com/Tatz18/admin-nexus-06.git
cd admin-nexus-06
```

### Install Dependencies

This project uses npm for package management. Install the required dependencies:

```bash
npm install
```

### Set up Environment Variables

Create a `.env` file in the root of the project. While not strictly necessary for basic local development without a backend, it's good practice to have it ready for future integrations (e.g., Supabase API keys).

```env
# Example environment variables (replace with your actual values)
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 🏃 Usage

### Development Server

To start the development server with hot-reloading, run:

```bash
npm run dev
```

This will typically start the application on `http://localhost:5173/`. Open this URL in your browser to see the application in action.

### Build for Production

To create an optimized production build of the application, run:

```bash
npm run build
```

This command will generate the production-ready static files in the `dist/` directory. You can then serve these files using any static file server.

### Linting

To run ESLint and check for code quality issues:

```bash
npm run lint
```

To fix automatically fixable linting errors:

```bash
npm run lint -- --fix
```

### Using Shadcn/ui Components

The project is pre-configured with Shadcn/ui components (based on Radix UI). You can add new components using the `npx shadcn-ui@latest add` command. For example, to add a `Button` component:

```bash
npx shadcn-ui@latest add button
```

This command will download the source code for the component into your `src/components/ui` directory, allowing you full control and customization.

## 📁 Project Structure

```
.
├── public/                 # Static assets (images, fonts, etc.)
├── src/                    # Source code for the application
│   ├── components/         # Reusable React components (e.g., UI components from shadcn/ui)
│   ├── lib/                # Utility functions, helpers, and configurations
│   ├── hooks/              # Custom React hooks
│   ├── assets/             # Project-specific assets like logos
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point of the application
├── supabase/               # Supabase related configuration/scripts
├── .env                    # Environment variables
├── .gitignore              # Files/directories to ignore in Git
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── ...                     # Other configuration files (eslint, postcss, etc.)
```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
4.  **Make your changes**, ensuring they adhere to the project's coding style (ESLint will help).
5.  **Test your changes** (if applicable).
6.  **Commit your changes** with a clear and concise commit message.
7.  **Push your branch** to your forked repository.
8.  **Open a Pull Request** to the `main` branch of the original repository.

Please provide a detailed description of your changes in the pull request. Thank you for making this project better!

## 📄 License

This project is currently **unlicensed**.
Please contact the repository owner for licensing information.

---

**Admin Nexus 06** – Built with ❤️ and cutting-edge web tech.
