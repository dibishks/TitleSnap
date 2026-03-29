# PowerShell script to create a modern React boilerplate application
# Usage: .\create-react-boilerplate.ps1 [project-name]

param(
    [Parameter(Position=0)]
    [string]$ProjectName = "react-responsive-app"
)

Write-Host "🚀 Creating Modern React Boilerplate: $ProjectName" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Step 1: Create Vite React TypeScript project
Write-Host "📦 Creating Vite React TypeScript project..." -ForegroundColor Yellow
npm create vite@latest $ProjectName -- --template react-ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Vite project" -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Set-Location $ProjectName

# Step 2: Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
npm install react-router-dom autoprefixer postcss

# Install Tailwind CSS v3 (stable version)
npm install -D tailwindcss@^3.4.0

# Install ESLint and Prettier dependencies
npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-plugin-react-refresh

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Create folder structure
Write-Host "📁 Creating project structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src/components", "src/pages", "src/hooks", "src/utils", "src/assets" -Force | Out-Null

# Step 4: Create Tailwind configuration
Write-Host "🎨 Setting up Tailwind CSS..." -ForegroundColor Yellow
@"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# Step 5: Create PostCSS configuration
@"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# Step 6: Update index.css with Tailwind
@"
/* Tailwind CSS directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Inter font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Custom base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300;
  }
}

/* Custom components */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
  }
  
  .btn-secondary {
    @apply px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
  }
  
  .container-padding {
    @apply px-4 sm:px-6 lg:px-8;
  }
}
"@ | Out-File -FilePath "src/index.css" -Encoding UTF8

# Step 7: Create ESLint configuration
Write-Host "🔍 Setting up ESLint and Prettier..." -ForegroundColor Yellow
@"
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    '@typescript-eslint',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
"@ | Out-File -FilePath ".eslintrc.js" -Encoding UTF8

# Step 8: Create Prettier configuration
@"
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
"@ | Out-File -FilePath ".prettierrc" -Encoding UTF8

# Step 9: Update package.json scripts
Write-Host "📝 Updating package.json scripts..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$packageJson.scripts = [PSCustomObject]@{
    "dev" = "vite"
    "build" = "tsc -b && vite build"
    "lint" = "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    "lint:fix" = "eslint . --ext ts,tsx --fix"
    "format" = "prettier --write `"src/**/*.{js,jsx,ts,tsx,json,css,md}`""
    "format:check" = "prettier --check `"src/**/*.{js,jsx,ts,tsx,json,css,md}`""
    "type-check" = "tsc --noEmit"
    "preview" = "vite preview"
    "clean" = "rm -rf dist"
    "test" = "echo `"Error: no test specified`" && exit 1"
}
$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8

# Step 10: Create theme context
Write-Host "🌙 Creating theme context..." -ForegroundColor Yellow
@"
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
"@ | Out-File -FilePath "src/hooks/ThemeContext.tsx" -Encoding UTF8

# Step 11: Create Navbar component
Write-Host "🧭 Creating Navbar component..." -ForegroundColor Yellow
@"
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/ThemeContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              YourApp
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePage(item.href)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActivePage(item.href)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
"@ | Out-File -FilePath "src/components/Navbar.tsx" -Encoding UTF8

# Step 12: Create Hero component
Write-Host "🦸 Creating Hero component..." -ForegroundColor Yellow
@"
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            Build Amazing{' '}
            <span className="text-primary-600 dark:text-primary-400">
              Web Apps
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create responsive, fast, and modern web applications with React, TypeScript, and Tailwind CSS. 
            Get started with our production-ready template.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/services"
              className="btn-primary w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="btn-secondary w-full sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
"@ | Out-File -FilePath "src/components/Hero.tsx" -Encoding UTF8

# Step 13: Create Footer component
Write-Host "🦶 Creating Footer component..." -ForegroundColor Yellow
@"
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <Link 
              to="/" 
              className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              YourApp
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
              Building the future of web applications with modern technologies and exceptional user experiences.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; {currentYear} YourApp, Inc. All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 md:mt-0">
              Made with ❤️ using React & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"@ | Out-File -FilePath "src/components/Footer.tsx" -Encoding UTF8

# Step 14: Create pages
Write-Host "📄 Creating pages..." -ForegroundColor Yellow
@"
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
"@ | Out-File -FilePath "src/pages/Home.tsx" -Encoding UTF8

@"
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto container-padding py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            About Us
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We are passionate about creating innovative web applications that solve real-world problems. 
              Our team combines cutting-edge technology with thoughtful design to deliver exceptional user experiences.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
"@ | Out-File -FilePath "src/pages/About.tsx" -Encoding UTF8

# Step 15: Update App.tsx
Write-Host "⚛️ Creating App component..." -ForegroundColor Yellow
@"
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';

const Services: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Services</h1>
      <p className="text-gray-600 dark:text-gray-300">Services page coming soon!</p>
    </div>
  </div>
);

const Contact: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact</h1>
      <p className="text-gray-600 dark:text-gray-300">Contact page coming soon!</p>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
"@ | Out-File -FilePath "src/App.tsx" -Encoding UTF8

# Step 16: Update index.html with SEO meta tags
Write-Host "🔍 Adding SEO meta tags..." -ForegroundColor Yellow
$indexHtml = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>YourApp - Modern React Web Application</title>
    <meta name="description" content="Build amazing web applications with React, TypeScript, and Tailwind CSS. Modern, responsive, and fast development template." />
    <meta name="keywords" content="React, TypeScript, Tailwind CSS, Web Development, Modern UI, Responsive Design" />
    <meta name="author" content="YourApp Team" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourapp.com/" />
    <meta property="og:title" content="YourApp - Modern React Web Application" />
    <meta property="og:description" content="Build amazing web applications with React, TypeScript, and Tailwind CSS. Modern, responsive, and fast development template." />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yourapp.com/" />
    <meta property="twitter:title" content="YourApp - Modern React Web Application" />
    <meta property="twitter:description" content="Build amazing web applications with React, TypeScript, and Tailwind CSS. Modern, responsive, and fast development template." />
    
    <!-- Additional Meta Tags -->
    <meta name="theme-color" content="#3b82f6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="YourApp" />
    
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@
$indexHtml | Out-File -FilePath "index.html" -Encoding UTF8

# Step 17: Remove default App.css if it exists
if (Test-Path "src/App.css") {
    Remove-Item "src/App.css" -Force
}

# Step 18: Create README
Write-Host "📖 Creating comprehensive README..." -ForegroundColor Yellow
@"
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

## 🛠️ Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript checking

## 📱 Features

- ✅ Responsive design with mobile menu
- ✅ Dark/light theme toggle
- ✅ SEO optimized
- ✅ TypeScript support
- ✅ Modern React patterns
- ✅ Production ready

---

**Made with ❤️ using React & Tailwind CSS**
"@ | Out-File -FilePath "README.md" -Encoding UTF8

# Step 19: Build and test the project
Write-Host "🏗️ Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

# Final success message
Write-Host "" -ForegroundColor Green
Write-Host "🎉 SUCCESS! Your React boilerplate is ready!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "📁 Project created at: $((Get-Location).Path)" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green
Write-Host "🚀 To start developing:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "🔧 Other commands:" -ForegroundColor Yellow
Write-Host "   npm run build       # Build for production" -ForegroundColor White
Write-Host "   npm run lint        # Check code quality" -ForegroundColor White
Write-Host "   npm run format      # Format code" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "🌐 Your app will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Green