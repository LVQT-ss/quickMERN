import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

// middleware for parsing request body
app.use(express.json());

app.get("/", (req, res) => {
   console.log(req)
   return res.status(234).send("welcome to Mern")
});

// Route for savee a new book model
app.post("/books", async (request, response) => {
        try{
            if(

                !request.body.title || 
                !request.body.author || 
                !request.body.publishYear

            ){
                return response.status(400)
                .send({message: "All fields are required"});

            }
            const newbook = {title: request.body.title, 
                author: request.body.author,
                publishYear: request.body.publishYear};
            const book = await Book(newbook);

            return response.status(201).send(book);

        } catch(error){
                console.log(error.message);
                response.status(500).send({message: error.message});
        }
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

