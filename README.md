# Quick Open Commerce (QCO) • Next.js Ecommerce Starter
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/qcohq/qco?utm_source=oss&utm_medium=github&utm_campaign=qcohq%2Fqco&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

[demo](https://demo.qco.me) 

> **Quick Open Commerce (QCO)** is a modern, lightweight ecommerce template built with Next.js. Designed for developers, it offers a fast, scalable, and customizable foundation for building online stores without complex backend overhead.

## Stack

1. **Core**: [Next.js 15.3](https://nextjs.org) + [React 19.1](https://react.dev) + [TypeScript 5.8](https://typescriptlang.org)
2. **UI**: [Tailwind CSS 4.1](https://tailwindcss.com) + [Shadcn/UI](https://ui.shadcn.com)
3. **Auth**: [Better Auth](https://better-auth.com)
4. **Animations**: [Framer Motion](https://framer.com/motion)
5. **Storage**: [AWS S3](https://aws.amazon.com/s3/) via [AWS SDK](https://aws.amazon.com/sdk-for-javascript/)
6. **Analytics**: [Vercel Analytics](https://vercel.com/docs/analytics)
7. **DB**: [Drizzle ORM](https://orm.drizzle.team) + [NeonDB](https://neon.tech)
8. **DX**: [ESLint](https://eslint.org) + [Biome](https://biomejs.dev) + [Knip](https://knip.dev)
9. **Forms**: [React Hook Form](https://react-hook-form.com)
10. **Tables**: [TanStack Table](https://tanstack.com/table)
11. **i18n**: [next-intl](https://next-intl.dev) _(w.i.p)_
12. **Email**: [Resend](https://resend.com)
13. **API**: [tRPC](https://trpc.io)

> This stack defines QCO‚ core. For an alternative setup with Clerk, Stripe, and GraphQL, explore [QCO Plus](https://github.com/qco-me/qco-plus).

## Quick Start

1. Install [Git](https://git-scm.com), [Bun](https://bun.sh).
2. Run:

   ```bash
   git clone https://github.com/qco-me/quick-open-commerce.git
   cd quick-open-commerce
   bun install
   cp .env.example .env
   ```

3. Configure the required environment variables in the `.env` file (see [Environment Variables](#environment-variables)).
4. Optionally, customize `src/config/app.ts` to personalize your store.
5. Run:

   ```bash
   bun db:push # Apply database schema
   bun dev # Start development server
   bun build # Build for production
   ```

6. Edit the code manually or use AI tools to assist.
7. Done! Your store is ready to grow.

### Commands

| Command         | Description                    |
|-----------------|--------------------------------|
| `bun dev`       | Start local development        |
| `bun build`     | Create a production build      |
| `bun latest`    | Update dependencies            |
| `bun ui`        | Add Shadcn/UI components       |
| `bun db:push`   | Apply database schema changes  |
| `bun db:studio` | Open Drizzle Studio            |

## Environment Variables

Key variables for `.env`:

```
# NeonDB
DATABASE_URL="postgresql://user:password@neon-host/dbname"

# AWS S3
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_S3_BUCKET="your_bucket_name"
AWS_REGION="your_region"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"

# Better Auth
BETTER_AUTH_SECRET="your_random_secret"
BETTER_AUTH_URL="http://localhost:3000"
```

## Notes

- QCO 1.0.0+ is optimized for AI-assisted development with tools like Cursor or GitHub Copilot.
- AWS S3 handles file storage (e.g., product images) via the AWS SDK.
- NeonDB with Drizzle ORM provides a serverless PostgreSQL experience.
- Resend manages transactional emails (e.g., order confirmations).
- tRPC ensures type-safe API routes for seamless frontend-backend communication.
- Better Auth offers a flexible and secure authentication solution.
- React Hook Form provides robust form handling for user inputs.
- Auto-save functionality for checkout forms prevents data loss during order completion.
- For an alternative stack with Clerk, Stripe, and GraphQL, check [QCO Plus](https://github.com/qco-me/qco-plus) ([demo](https://plus.qco.me), [docs](https://docs.qco.me/plus)).

## Support QCO

- Star the repo to grow the QCO community.
- Follow the QCO team for updates.
- Sponsor us to support intuitive ecommerce tools.

> Your support fuels tools that make ecommerce development effortless.

## License

MIT В© 2025 QCO Team
