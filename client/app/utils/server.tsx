export const clientServer =
  process.env.NEXT_PUBLIC_NODE_ENV === 'DEVELOPMENT'
    ? 'http://localhost:3000'
    : 'https://uniqueiit-lms-api.vercel.app/';
