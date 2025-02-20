# Aaltoes Brand Store

A modern e-commerce platform for Aaltoes merchandise, built with Next.js 14 and TypeScript.

## 🌟 Features

- **Product Management**
  - Multiple product types (T-shirts, hoodies, stickers, etc.)
  - Size variations for apparel
  - Stock status tracking
  - Image management

- **Shopping Experience**
  - Intuitive product browsing
  - Shopping cart functionality
  - Size selection for applicable items
  - Dark/Light mode support

- **User Management**
  - Google authentication
  - Role-based access (Admin/User)
  - Order history
  - Profile management

- **Admin Dashboard**
  - Product inventory management
  - Order processing
  - User role management
  - Sales tracking

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [@geist-ui/icons](https://github.com/geist-org/icons)

## 🛠️ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/aaltoes-store.git
cd aaltoes-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Update the following in your .env:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                  # Next.js app router pages
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   ├── cart/            # Shopping cart
│   └── components/      # Shared components
├── lib/                 # Utilities and configurations
├── prisma/              # Database schema
└── public/              # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 Environment Variables

```env
DATABASE_URL="your-neon-db-url"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🧪 Running Tests

```bash
npm run test
```

## 📦 Deployment

The application is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy!

## 🔑 License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more information.

## 🙏 Acknowledgments

- [Aaltoes](https://www.aaltoes.com/) - Aalto Entrepreneurship Society
- [Vercel](https://vercel.com) - Deployment platform
- [Neon](https://neon.tech) - Database hosting

## 📫 Contact

For questions or support, please open an issue or contact the Aaltoes team.
