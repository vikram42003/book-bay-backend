const PORT: string | undefined = process.env.PORT ?? "3003";
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

if (!MONGODB_URL) {
  console.error("MONGODB_URL is not defined");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined");
  process.exit(1);
}

const ENV = {
  MONGODB_URL,
  PORT,
  JWT_SECRET,
};

export default ENV;
