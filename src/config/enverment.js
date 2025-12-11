import dotenv from "dotenv";
dotenv.config();

const Mongo_Url = process.env.MONGO_URL;
const Port = process.env.PORT;
const Access_Token_Secret = process.env.ACCESS_TOKEN_SECRET;
const Access_Token_Expiry = process.env.ACCESS_TOKEN_EXPIRY;
const Refresh_Token_Secret = process.env.REFRESH_TOKEN_SECRET;
const Refresh_Token_Expiry = process.env.REFRESH_TOKEN_EXPIRY;

export {
  Mongo_Url,
  Port,
  Access_Token_Secret,
  Access_Token_Expiry,
  Refresh_Token_Secret,
  Refresh_Token_Expiry,
};
