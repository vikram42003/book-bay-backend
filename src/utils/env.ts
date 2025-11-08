const PORT: string | undefined = process.env.PORT ?? "3003";
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;

const ENV = {
  MONGODB_URL,
  PORT,
};

export default ENV;
