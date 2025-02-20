# Contributing to Aaltoes Brand Store

First off, thank you for considering contributing to the Aaltoes Brand Store! 👋

## Project Status

🚧 **Early Development Stage**

This project was recently initiated and is in its very early stages. Currently, it's a static showcase without actual e-commerce functionality. We're building the foundation and would love your help in shaping its future!

## How Can I Contribute?

We welcome all types of contributions, including but not limited to:

- 🎨 UI/UX improvements
- 🔧 Bug fixes
- ✨ New features
- 📝 Documentation
- 🌐 Internationalization
- 🧪 Testing

## Current Focus Areas

We're particularly interested in help with:

1. Setting up e-commerce functionality
2. Implementing secure payment processing
3. Building the product management system
4. Improving the shopping experience
5. Adding authentication
6. Setting up the order management system

## Getting Started

1. Fork and clone the repository:
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
# Update DATABASE_URL and other required variables
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── components/        # Shared components
│   └── lib/              # Utilities and constants
├── prisma/                # Database schema
└── public/                # Static assets
```

## Development Guidelines

### TypeScript
- Use TypeScript for all new files
- Define interfaces for component props
- Use Prisma-generated types for database models

### Components
- Place reusable components in `app/components`
- Use shadcn/ui components when possible
- Follow the existing component structure

### API Routes
- Place API routes in `app/api`
- Use proper error handling
- Validate requests with appropriate status codes

### Database
- Make schema changes in `prisma/schema.prisma`
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to update database

### Styling
- Use Tailwind CSS for styling
- Follow the existing color scheme
- Use the theme variables for dark/light mode

## Pull Request Process

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git commit -m "feat: add your feature description"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Steps to test

## Code Style

- Use ESLint and Prettier
- Run `npm run lint` before committing
- Follow existing naming conventions
- Use meaningful variable names

## Testing

- Add tests for new features
- Ensure existing tests pass
- Test both light and dark themes
- Test responsive layouts

## Commit Messages

Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for styling changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance

## Need Help?

- Check existing issues
- Create a new issue for discussions
- Read the [README.md](README.md) for project overview

## License

By contributing, you agree that your contributions will be licensed under the Apache License, Version 2.0.

## Questions?

Feel free to open an issue or reach out to the Aaltoes team if you have any questions.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Thank you for helping make Aaltoes Brand Store better! 🙌 