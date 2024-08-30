import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";

import booksRoute from "./routes/booksRoute.js"
const app = express();

// middleware for parsing request body
app.use(express.json());

app.get("/", (req, res) => {
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

