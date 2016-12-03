import dotenv from 'dotenv';

const PATH_ENV_FILE = '../.env';
dotenv.config(PATH_ENV_FILE);

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID.trim();
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET.trim();
export const MONGO_URL = process.env.MONGO_URL.trim();

export default { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, MONGO_URL};
