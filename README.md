# Modern React Web Application

A comprehensive, production-ready React web application template built with modern technologies and best practices.

## 🚀 Features

- **React 19** with **TypeScript** for type safety
- **Vite** for ultra-fast development and building
- **Tailwind CSS** for utility-first styling
- **Responsive Design** optimized for desktop and mobile
- **Dark/Light Theme** with system preference detection
- **React Router DOM** for client-side routing
- **ESLint + Prettier** for code quality and formatting
- **SEO Optimized** with proper meta tags
- **Modern Architecture** with organized folder structure

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Responsive navigation with mobile menu
│   ├── Hero.tsx        # Hero section with CTA
│   └── Footer.tsx      # Footer with links and social media
├── pages/              # Page components for routing
│   ├── Home.tsx        # Homepage layout
│   └── About.tsx       # About page
├── hooks/              # Custom React hooks
│   └── ThemeContext.tsx # Theme management context
├── utils/              # Utility functions
├── assets/             # Static assets
└── index.css           # Global styles with Tailwind
```

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd react-responsive-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |
| `npm run clean` | Clean build directory |

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color palette:

```js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ... add your colors
  },
}
```

### Components

All components are fully customizable and located in `src/components/`:

- **Navbar**: Responsive navigation with mobile hamburger menu
- **Hero**: Landing page hero section with call-to-action buttons
- **Footer**: Multi-column footer with links and social media

### Dark/Light Theme

The theme system automatically:
- Detects system preference on first visit
- Persists user's choice in localStorage
- Provides a toggle button in the navbar

## 📱 Responsive Design

The application is mobile-first and includes:

- **Responsive navigation** with collapsible mobile menu
- **Flexible layouts** that adapt to all screen sizes
- **Touch-friendly** buttons and interactive elements
- **Optimized typography** for readability on all devices

## 🔍 SEO Features

- Comprehensive meta tags for social media sharing
- Open Graph and Twitter Card support
- Semantic HTML structure
- Accessible design following WCAG guidelines

## 🧰 Technologies Used

### Core
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool

### Styling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Inter Font](https://fonts.google.com/specimen/Inter) - Modern typography

### Routing & State
- [React Router DOM](https://reactrouter.com/) - Client-side routing
- React Context API for theme management

### Development Tools
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript](https://www.typescriptlang.org/) - Static type checking

## 📦 Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

This application can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Upload the `dist` contents
- **AWS S3**: Upload to S3 bucket with static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Open an [issue](issues/) on GitHub
3. Contact the development team

---

**Made with ❤️ using React & Tailwind CSS**