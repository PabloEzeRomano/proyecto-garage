# Proyecto Garage

A Next.js application for managing a garage/bar business, including event management, menu items, and user authentication.

## Features

- 🔐 Authentication with NextAuth.js
- 🛒 Shopping Cart functionality
- 💳 MercadoPago integration
- 📱 WhatsApp notifications
- 👥 User role management (Admin/User)
- 📅 Event management
- 🍽️ Menu management
- 📦 Stock control

## Tech Stack

- **Framework:** Next.js 14
- **Authentication:** NextAuth.js
- **Database:** Prisma with PostgreSQL
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Payment:** MercadoPago SDK
- **Messaging:** WhatsApp Business API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/project-garage.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_MP_ACCESS_TOKEN=
NEXT_PUBLIC_MP_INTEGRATOR_ID=
NEXT_PUBLIC_WHATSAPP_TOKEN=
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID=
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
project-garage/
├── public/
│   └── icons/          # SVG icons components
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Next.js pages
│   ├── styles/        # CSS styles
│   └── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
