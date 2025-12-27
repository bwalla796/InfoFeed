import dotenv from "dotenv";
dotenv.config();
export const config = {
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
