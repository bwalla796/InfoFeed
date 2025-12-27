import dotenv from "dotenv";
dotenv.config();

type Config = {
  db: DBConfig;
  api: APIConfig;
};

type APIConfig = {
  port: string | undefined;
  jwt: {
    secret: string | undefined;
  }
};

type DBConfig = {
  url: string | undefined;
};

export const config: Config = {
  api: {
    port: process.env.PORT,
    jwt: {
      secret: process.env.JWT_SECRET
    }
  },
  db: {
    url: process.env.DB_FILE_NAME,
  },
};
