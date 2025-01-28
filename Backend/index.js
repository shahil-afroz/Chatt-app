import dotenv from "dotenv"; 
import express from "express"; 
import authRoutes from "./src/routes/authRoutes.js"; 
import messageRoutes from "./src/routes/messageRoutes.js";
import { connectDB } from "./src/lib/db.js"; 
import cookieParser from "cookie-parser"; 
import cors from "cors";

dotenv.config(); 

const app = express();


if (!process.env.PORT) {
    throw new Error("Environment variable PORT is not defined");
}

if (!process.env.MONGODB_URL) {
    throw new Error("Environment variable DB_URI is not defined");
}

const port = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));


app.use("/api/auth", authRoutes); 
app.use("/api/message", messageRoutes);


connectDB() 
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1); 
    });
