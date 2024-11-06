This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, setup all the dependencies
1. Docker
2. Database
3. Create .env.development config file
```
cp -rp .env.example .env.development
```
Change the values of .env.development file based on your database access 

Finally, run the development server:

```bash
Run for development:
docker-compose build --no-cache && docker-compose up -d
or
docker-compose build && docker-compose up -d

Build for production:
NODE_ENV=production docker-compose up --build
```

## Debug Docker
```
# check the container logs to see any specific error messages:
docker-compose logs -f web

# If not running, try running the container interactively to debug:
docker run -it --entrypoint sh divine-jewel-web
npm install
npm run dev
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

## Database: products table cleanup

-- Step 1: Delete from `stocks` where the product is archived
```
DELETE FROM stocks
WHERE product_id IN (SELECT id FROM products WHERE is_archive = 1);
```

-- Step 2: Delete from `stock_details` where the product is archived
```
DELETE FROM stock_details
WHERE product_id IN (SELECT id FROM products WHERE is_archive = 1);
```

-- Step 3: Delete from `order_details` where the product is archived
```
DELETE FROM order_details
WHERE product_id IN (SELECT id FROM products WHERE is_archive = 1);
```

-- Step 4: Delete the archived `products` from the products table
```
DELETE FROM products
WHERE is_archive = 1;
```

