# Auction Project

A modern auction platform built with React and Vite.

## 🚀 Features

- Modern React frontend with Vite build system
- Responsive design
- Fast development with Hot Module Replacement (HMR)
- ESLint for code quality

## 📋 Prerequisites

- Node.js 20.x or higher
- npm (comes with Node.js)

## 🛠️ Development

### Installation

```bash
cd frontend
npm install
```

### Running the Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
cd frontend
npm run build
```

The production build will be created in the `frontend/dist` directory.

### Preview Production Build

```bash
cd frontend
npm run preview
```

### Linting

```bash
cd frontend
npm run lint
```

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

- **CI Workflow**: Runs on every push and pull request to `main` and `develop` branches
  - Lints code with ESLint
  - Builds the application
  - Uploads build artifacts

- **Deploy Workflow**: Automatically deploys to GitHub Pages when changes are pushed to `main`
  - Builds the production application
  - Deploys to GitHub Pages

### Setting Up GitHub Pages

To enable automatic deployment:

1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment", set Source to **GitHub Actions**
3. The site will be automatically deployed on push to `main`

For more details, see [.github/workflows/README.md](.github/workflows/README.md)

## 📁 Project Structure

```
AuctionProject/
├── .github/
│   └── workflows/         # GitHub Actions workflows
│       ├── ci.yml        # Continuous Integration
│       ├── deploy.yml    # Deployment to GitHub Pages
│       └── README.md     # Workflows documentation
└── frontend/
    ├── public/           # Static assets
    ├── src/              # Source code
    │   ├── assets/       # Images, fonts, etc.
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── package.json      # Dependencies and scripts
    └── vite.config.js    # Vite configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All pull requests will be automatically tested by the CI workflow.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
