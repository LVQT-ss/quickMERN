import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
   console.log(req)
   return res.status(234).send("welcome to Mern")
});


mongoose.connect(mongoDBURL)
        .then(() => {
            console.log("MongoDB connected")
            app.listen(PORT, ()=>{
                console.log(`Server is running on port ${PORT}`);
            });
            
        }
    
    )
        .catch(err => console.log(err));

