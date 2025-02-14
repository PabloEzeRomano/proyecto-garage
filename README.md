# Proyecto Garage 🏠

A modern web application for managing events, items, and creating unique experiences. Built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login
  - Role-based access control (User, Admin, Root)
  - Protected routes and API endpoints

- **Event Management**
  - Create and manage events
  - Event reservations
  - Image upload and management
  - Search and filter events

- **Item Management**
  - Product catalog
  - Stock management
  - Shopping cart functionality
  - Secure checkout process

- **User Experience**
  - Responsive design
  - Dark/Light theme
  - Real-time updates
  - Mobile-first approach

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - Framer Motion
  - TypeScript

- **Backend:**
  - Supabase (Database & Authentication)
  - Next.js API Routes
  - TypeScript

- **Payment Processing:**
  - Mercado Pago Integration

- **Image Management:**
  - Sharp for optimization
  - Supabase Storage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd project-garage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in the required environment variables:
     - Supabase configuration
     - Mercado Pago keys
     - WhatsApp API credentials
     - Base URL

4. **Database Setup**
   - Run Supabase migrations
   - Initial data seeding (if required)

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# WhatsApp API
NEXT_PUBLIC_WHATSAPP_TOKEN=your-token
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID=your-phone-id
NEXT_PUBLIC_WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id

# Mercado Pago
NEXT_PUBLIC_MP_KEY=your-mp-key
NEXT_PUBLIC_MP_ACCESS_TOKEN=your-access-token
NEXT_PUBLIC_MP_CLIENT_ID=your-client-id
NEXT_PUBLIC_MP_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_MP_INTEGRATOR_ID=your-integrator-id
```

## 📁 Project Structure

```
project-garage/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Library configurations
│   ├── pages/        # Next.js pages
│   ├── styles/       # CSS styles
│   ├── types/        # TypeScript types
│   └── utils/        # Utility functions
├── supabase/         # Database migrations
└── scripts/         # Utility scripts
```

## 🔐 Authentication

The application uses Supabase Authentication with the following roles:
- **User**: Basic access to events and items
- **Admin**: Management of events, items, and stock
- **Root**: Full system access including user management

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom CSS modules for component-specific styles
- Theme support (light/dark mode)
- Responsive design breakpoints

## 🔄 State Management

- React Context for global state
- Custom hooks for reusable logic
- Supabase real-time subscriptions

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Authors

- Your Name - Initial work and maintenance

## 🙏 Acknowledgments

- Thanks to all contributors and supporters
- Special thanks to the open-source community
