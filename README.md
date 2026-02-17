# IELTSIFY Admin Panel 🎓

Professional admin panel for managing IELTS learning materials with modern design, light/dark theme support, and real API integration.

## ✨ Features

- 🎨 **Modern Professional Design** - Clean, intuitive interface with gradient animations
- 🌓 **Light & Dark Theme** - Seamless theme switching with CSS variables
- 🔐 **Real API Authentication** - JWT-based authentication with token management
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🚀 **Lightning Fast** - Pure CSS, no framework overhead
- 🎯 **Type-Safe** - Full TypeScript support
- 📊 **Dashboard** - Overview with statistics and activity tracking
- 📚 **Material Management** - Upload and manage all IELTS materials
- 🔄 **Token Refresh** - Automatic token refresh for seamless experience

## 🛠️ Tech Stack

- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Pure CSS** - Custom CSS with variables and animations
- **Lucide React** - Beautiful icons
- **React Router DOM 7** - Client-side routing
- **Vite 7** - Next generation build tool
- **REST API** - Backend integration with JWT authentication

## 🔌 API Integration

### Base URL
```
https://ieltsify.pythonanywhere.com
```

### Authentication Endpoint
```
POST /token/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```

### Token Refresh
```
POST /token/refresh/
Content-Type: application/json

{
  "refresh": "jwt_refresh_token"
}

Response:
{
  "access": "new_jwt_access_token"
}
```

### Listening Tests API

#### Get All Tests
```
GET /listening-tests/
Authorization: Bearer {access_token}

Response: ListeningTest[]
```

#### Create Test
```
POST /listening-tests/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

FormData:
- title: string (required)
- description: string (required)
- html_file: File (required, .html)
- cover_image: File (optional, image)
- difficulty: string (optional, default: "--")
- is_active: boolean (optional, default: true)

Response: ListeningTest
```

#### Delete Test
```
DELETE /listening-tests/{id}/
Authorization: Bearer {access_token}

Response: 204 No Content
```

#### ListeningTest Interface
```typescript
{
  id: number;
  title: string;
  description: string;
  html_file: string;
  cover_image: string | null;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### API Client Features
- Automatic token management
- Token storage in localStorage
- Authorization header injection
- Error handling with user-friendly messages
- Token refresh capability
- Generic HTTP methods (GET, POST, PUT, DELETE)

## 📋 Pages & Features

### 1. Login Page
- **Professional Design**: Gradient animated background with floating orbs
- **Two-Column Layout**: Branding on left, form on right
- **Feature Cards**: Highlight security and management capabilities
- **Real API Integration**: JWT authentication
- **Error Handling**: User-friendly error messages
- **Loading States**: Spinner animation during login
- **Responsive**: Mobile-optimized layout

### 2. Dashboard
- **Statistics Cards**: Total tests, best score, weak areas, strong skills
- **Activity Chart**: Weekly activity visualization
- **Target Score**: Progress tracking for each skill
- **Goal Badge**: Current target score display

### 3. Resource Manager (4 Tabs)
- **Article Tab**: Title, content, level, optional image
- **Listening Tab**: Name, YouTube URL, category
- **Writing Tab**: Task 1 & Task 2 with questions and images
- **Vocabulary Tab**: Word, definition, example, level

### 4. Reading Materials
- Upload HTML files and images
- Professional collapsible form
- Empty state with icons
- Delete functionality

### 5. Listening Materials
- Upload HTML files and images
- Professional collapsible form
- Empty state with icons
- Delete functionality

### 6. Profile
- Personal information management
- Change password
- Account statistics
- View account details

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Application runs on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 🔑 Login

Use your API credentials:

```
Username: your_username
Password: your_password
```

The system will authenticate against the real API and store JWT tokens.

## 📁 Project Structure

```
src/
├── components/
│   └── ui/              # UI components
│       ├── button.tsx/css
│       ├── card.tsx/css
│       ├── input.tsx/css
│       └── label.tsx/css
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Real API authentication
│   ├── ThemeContext.ts
│   └── ThemeProvider.tsx
├── hooks/               # Custom hooks
│   └── useTheme.ts
├── layouts/             # Layout components
│   ├── AdminLayout.tsx
│   └── AdminLayout.css
├── lib/                 # Utilities
│   └── api.ts          # API client with JWT handling
├── pages/               # Page components
│   ├── DashboardPage.tsx/css
│   ├── ReadingPage.tsx/css
│   ├── ListeningPage.tsx/css
│   ├── ResourcesPage.tsx/css
│   ├── ProfilePage.tsx/css
│   └── LoginPage.tsx/css
├── types/               # TypeScript types
├── mock/                # Mock data
├── index.css            # Global styles with theme variables
├── App.tsx
└── main.tsx
```

## 🎨 Design Features

### Login Page
- **Animated Background**: 3 floating gradient orbs with smooth animations
- **Professional Layout**: Two-column design (branding + form)
- **Feature Highlights**: Security and management features
- **Gradient Effects**: Modern gradient buttons and icons
- **Loading States**: Spinner animation
- **Error Handling**: Shake animation for errors
- **Dark Mode**: Backdrop blur and transparency effects

### Admin Layout
- **Professional Sidebar**: Gradient logo, smooth transitions
- **Active Indicators**: Left border indicator for active items
- **Hover Effects**: Transform and background changes
- **Header**: Search, theme toggle, notifications, user avatar
- **Responsive**: Mobile overlay with backdrop blur
- **Smooth Animations**: Cubic-bezier easing functions

### Color Scheme
- **Primary**: Green (#10b981) - Success, progress
- **Background (Light)**: White (#ffffff)
- **Background (Dark)**: Deep blue (#0a0f1e)
- **Card (Dark)**: Navy (#1a1f35)
- **Border (Dark)**: Subtle gray (#2d3548)

### Components
- **Cards**: Rounded corners, subtle shadows, backdrop blur
- **Buttons**: Gradient backgrounds, hover effects
- **Inputs**: Icon support, focus rings, smooth transitions
- **Icons**: Lucide React icons throughout

## 🔧 API Client Usage

### Basic Usage

```typescript
import { apiClient } from '@/lib/api';

// Login
const response = await apiClient.login(username, password);

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const result = await apiClient.post('/endpoint', { data });

// PUT request
const updated = await apiClient.put('/endpoint', { data });

// DELETE request
await apiClient.delete('/endpoint');

// Check authentication
const isAuth = apiClient.isAuthenticated();

// Get access token
const token = apiClient.getAccessToken();

// Logout
apiClient.logout();
```

### Error Handling

The API client provides user-friendly error messages in Uzbek:
- 401: "Username yoki parol noto'g'ri!"
- 403: "Kirish taqiqlangan!"
- 404: "API endpoint topilmadi!"
- 500: "Server xatosi yuz berdi!"
- Network errors: "Tarmoq xatosi yuz berdi!"

## 📊 Authentication Flow

1. User enters username and password
2. LoginPage calls `login()` from AuthContext
3. AuthContext calls `apiClient.login()`
4. API client sends POST request to `/token/`
5. Server returns access and refresh tokens
6. Tokens stored in localStorage
7. User object created and stored
8. User redirected to dashboard
9. All subsequent requests include Authorization header
10. Token refresh handled automatically when needed

## 🎯 Best Practices

- **Pure CSS** - No framework dependencies
- **Component-Scoped CSS** - Each component has its own styles
- **CSS Variables** - Easy theming
- **Mobile-First** - Responsive design
- **Type-Safe** - Full TypeScript support
- **Clean Code** - Well-organized structure
- **Error Handling** - User-friendly messages
- **Token Management** - Secure JWT handling
- **Loading States** - Visual feedback for async operations

## 📦 Build & Deploy

### Build

```bash
npm run build
```

Output: `dist/` directory

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=https://ieltsify.pythonanywhere.com
```

### Deploy

Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with authentication check
- Authorization header on all authenticated requests
- Secure logout with token cleanup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- [Lucide](https://lucide.dev/) - Icon library
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

Made with ❤️ for IELTSIFY - Professional IELTS Learning Platform
