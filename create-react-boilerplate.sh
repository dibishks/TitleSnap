#!/bin/bash

# Bash script to create a modern React boilerplate application
# Usage: ./create-react-boilerplate.sh [project-name]

PROJECT_NAME=${1:-"react-responsive-app"}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Creating Modern React Boilerplate: $PROJECT_NAME${NC}"
echo -e "${GREEN}================================================${NC}"

# Step 1: Create Vite React TypeScript project
echo -e "${YELLOW}📦 Creating Vite React TypeScript project...${NC}"
npm create vite@latest "$PROJECT_NAME" -- --template react-ts

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create Vite project${NC}"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_NAME" || exit

# Step 2: Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install react-router-dom autoprefixer postcss

# Install Tailwind CSS v3 (stable version)
npm install -D tailwindcss@^3.4.0

# Install ESLint and Prettier dependencies
npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-plugin-react-refresh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 3: Create folder structure
echo -e "${YELLOW}📁 Creating project structure...${NC}"
mkdir -p src/{components,pages,hooks,utils,assets}

# Step 4: Create Tailwind configuration
echo -e "${YELLOW}🎨 Setting up Tailwind CSS...${NC}"
cat > tailwind.config.js << 'EOF'
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
EOF

# Step 5: Create PostCSS configuration
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Step 6: Update index.css with Tailwind
cat > src/index.css << 'EOF'
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
EOF

# Step 7: Create ESLint configuration
echo -e "${YELLOW}🔍 Setting up ESLint and Prettier...${NC}"
cat > .eslintrc.js << 'EOF'
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
EOF

# Step 8: Create Prettier configuration
cat > .prettierrc << 'EOF'
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
EOF

# Step 9: Update package.json scripts
echo -e "${YELLOW}📝 Updating package.json scripts...${NC}"
npx json -I -f package.json -e 'this.scripts={
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
  "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
  "type-check": "tsc --noEmit",
  "preview": "vite preview",
  "clean": "rm -rf dist",
  "test": "echo \"Error: no test specified\" && exit 1"
}' 2>/dev/null || {
  # Fallback method using sed
  sed -i.bak '/"scripts": {/,/},/{
    /"scripts": {/!{
      /},/!d
    }
  }' package.json
  
  sed -i.bak '/"scripts": {/a\
    "dev": "vite",\
    "build": "tsc -b && vite build",\
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",\
    "lint:fix": "eslint . --ext ts,tsx --fix",\
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",\
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",\
    "type-check": "tsc --noEmit",\
    "preview": "vite preview",\
    "clean": "rm -rf dist",\
    "test": "echo \"Error: no test specified\" && exit 1",
' package.json
}

# Step 10: Create theme context
echo -e "${YELLOW}🌙 Creating theme context...${NC}"
cat > src/hooks/ThemeContext.tsx << 'EOF'
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
EOF

# Step 11: Create components (simplified for brevity - contains essential structure)
echo -e "${YELLOW}🧭 Creating components...${NC}"

# Create Navbar component
cat > src/components/Navbar.tsx << 'EOF'
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

  const isActivePage = (href: string) => location.pathname === href;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
            YourApp
          </Link>
          
          <div className="hidden md:flex space-x-4">
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

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
EOF

# Create Hero component
cat > src/components/Hero.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto container-padding text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Build Amazing{' '}
          <span className="text-primary-600 dark:text-primary-400">Web Apps</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Create responsive, fast, and modern web applications with React, TypeScript, and Tailwind CSS.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/services" className="btn-primary">
            Get Started
          </Link>
          <Link to="/about" className="btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
EOF

# Create Footer component
cat > src/components/Footer.tsx << 'EOF'
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto container-padding py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          © 2024 YourApp, Inc. All rights reserved. Made with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
EOF

# Step 12: Create pages
echo -e "${YELLOW}📄 Creating pages...${NC}"

# Create Home page
cat > src/pages/Home.tsx << 'EOF'
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
EOF

# Create About page
cat > src/pages/About.tsx << 'EOF'
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container-padding py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            About Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We are passionate about creating innovative web applications that solve real-world problems.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
EOF

# Step 13: Update App.tsx
echo -e "${YELLOW}⚛️ Creating App component...${NC}"
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';

const Services = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Services</h1>
      <p className="text-gray-600 dark:text-gray-300">Coming soon!</p>
    </div>
  </div>
);

const Contact = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact</h1>
      <p className="text-gray-600 dark:text-gray-300">Coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
EOF

# Step 14: Update index.html with SEO meta tags
echo -e "${YELLOW}🔍 Adding SEO meta tags...${NC}"
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>YourApp - Modern React Web Application</title>
    <meta name="description" content="Build amazing web applications with React, TypeScript, and Tailwind CSS." />
    <meta name="keywords" content="React, TypeScript, Tailwind CSS, Web Development" />
    <meta name="theme-color" content="#3b82f6" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Step 15: Remove default files
[ -f "src/App.css" ] && rm src/App.css

# Step 16: Create README
echo -e "${YELLOW}📖 Creating README...${NC}"
cat > README.md << 'EOF'
# Modern React Web Application

A production-ready React boilerplate with modern technologies and best practices.

## 🚀 Features

- **React 19** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Responsive Design**
- **Dark/Light Theme**
- **React Router DOM**
- **ESLint + Prettier**
- **SEO Optimized**

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Features

- ✅ Responsive design
- ✅ Dark/light theme toggle
- ✅ TypeScript support
- ✅ Modern React patterns
- ✅ Production ready

---

**Made with ❤️ using React & Tailwind CSS**
EOF

# Step 17: Build and test the project
echo -e "${YELLOW}🏗️ Building the project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
    exit 1
fi

# Final success message
echo ""
echo -e "${GREEN}🎉 SUCCESS! Your React boilerplate is ready!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "${CYAN}📁 Project created at: $(pwd)${NC}"
echo ""
echo -e "${YELLOW}🚀 To start developing:${NC}"
echo -e "${WHITE}   npm run dev${NC}"
echo ""
echo -e "${YELLOW}🔧 Other commands:${NC}"
echo -e "${WHITE}   npm run build       # Build for production${NC}"
echo -e "${WHITE}   npm run lint        # Check code quality${NC}"
echo -e "${WHITE}   npm run format      # Format code${NC}"
echo ""
echo -e "${CYAN}🌐 Your app will be available at: http://localhost:5173${NC}"
echo ""