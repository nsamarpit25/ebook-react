# eBook Store and Reader Application

A modern full-stack eBook store application with integrated eBook reader functionality.

## 🚀 Technologies Used

### Frontend

- React 18 with TypeScript
- Vite as build tool
- Redux Toolkit for state management
- NextUI for UI components
- Tailwind CSS for styling
- EPubJS for eBook reading functionality
- React Router for navigation
- TipTap for rich text editing
- React Hot Toast for notifications
- Zod for form validation

### Key Features

#### 📚 Book Management

- Browse books catalog
- Book details with ratings and pricing
- Genre and language-based categorization
- Recommended books section

#### 📖 eBook Reader

- Integrated ePub reader
- Navigation controls
- Responsive layout
- Progress tracking

#### 🛒 Shopping Features

- Shopping cart functionality
- Price calculations
- Order management
- Secure checkout process

#### 👤 User Features

- Authentication system
- User profiles
- Author profiles
- Dark/Light mode toggle
- Responsive design

#### 📝 Author Features

- Book publication system
- Author dashboard
- Book management tools
- Rich text editor for descriptions

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
├── views/           # Page components
├── store/           # Redux store configuration
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── utils/           # Utility functions
└── api/            # API client configuration
```

## 🔑 Key Components

### Reader Component

- Implements ePub.js for eBook rendering
- Supports navigation and progress tracking
- Responsive design for various screen sizes

### Book Management

- Comprehensive book listing
- Detailed book views
- Author management system
- Publication workflow

### Shopping Cart

- Real-time price calculations
- Cart state management
- Order processing

## 💫 Features Implementation

### Authentication

- Secure user authentication
- Profile management
- Role-based access control

### Book Publication

- Author registration
- Book upload system
- Cover image management
- Pricing configuration

### Shopping Experience

- Intuitive cart management
- Price calculations
- Order processing
- Responsive design

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/Light mode support
- Modern UI components with NextUI
- Smooth transitions and animations
- User-friendly navigation
- Loading indicators
- Toast notifications

## 🛠️ Development Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

## 🔧 Configuration

The project uses various configuration files:

- `tsconfig.app.json` for TypeScript configuration
- `tailwind.config.js` for Tailwind CSS setup
- `postcss.config.js` for PostCSS plugins

## 📝 Notes

- Supports ePub format for eBooks
- Implements responsive design principles
- Uses modern React patterns and practices
- Follows TypeScript best practices
