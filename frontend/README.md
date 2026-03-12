# AgentSwarm Pay Frontend

Welcome to the frontend repository for **AgentSwarm Pay**. This project is a modern, responsive Web3 application built with cutting-edge tools and a focus on beautiful, performant user interfaces.

## 🚀 Tech Stack

This project leverages the following technologies:

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Web3 Integration**: [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), and [RainbowKit](https://www.rainbowkit.com/)
- **State & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone <YOUR_GIT_URL>
   cd agentswarm-pay
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Vite development server with hot-module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or another port if 8080 is in use).

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be output to the `dist` directory. You can preview the production build locally via:

```bash
npm run preview
```

## 📂 Project Structure

- `src/` - The core application code.
  - `components/` - Reusable UI components (including shadcn-ui components).
  - `pages/` - Application routes/pages.
  - `lib/` - Utility functions and helpers.
  - `hooks/` - Custom React hooks.
- `public/` - Static files that are served directly.
- `tailwind.config.ts` - Tailwind CSS configuration.
- `vite.config.ts` - Vite bundler configuration.

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📝 License

All rights reserved.
