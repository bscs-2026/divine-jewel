This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, setup all the dependencies
1. Docker
2. Database
3. Create .env config file
```
cp -rp .env.example .env
```
Change the values of .env file based on your database access 

Finally, run the development server:

```bash
docker-compose build 
docker-compose up -d
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Additional Info
Tools: Next.js, Typescript, ESLint, CSS Tailwind
And also, this project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/).
