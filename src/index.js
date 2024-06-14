import express from "express"
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors"
import authrouter from "./router/auth"
import articlesrouter from "./router/articles"
import CommentRouter from "./router/comment"


import uploadImage from "./router/uploadImage"

import connectDB from "./config/database";
// Khởi tạo một ứng dụng Express
const app = express();
dotenv.config();
connectDB( process.env.MONGO_URI );
console.log( process.env.MONGO_URI );
app.use( express.json() );
app.use( morgan( "tiny" ) );
app.use( cors() );
app.use( "/api/users", authrouter )
app.use( "/api/articles", articlesrouter )
app.use( "/api/comment", CommentRouter )


app.use( "/api/image", uploadImage )



export const viteNodeApp = app;
