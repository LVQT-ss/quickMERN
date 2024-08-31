import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import cors from "cors";
import booksRoute from "./routes/booksRoute.js"
const app = express();

// middleware for parsing request body
app.use(express.json());
// middleware for handiling cors policy
app.use(cors());
app.get("/", (request, response) => {
   console.log(req)
   return res.status(234).send("welcome to Mern")
});

app.use("/books",booksRoute)

mongoose.connect(mongoDBURL)
        .then(() => {
            console.log("MongoDB connected")
            app.listen(PORT, ()=>{
                console.log(`Server is running on port ${PORT}`);
            });
            
        }
    
    )
        .catch(err => console.log(err));

