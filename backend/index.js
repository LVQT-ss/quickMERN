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
    try {
        // Check if all required fields are present
        if (
            !request.body.title || 
            !request.body.author || 
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: "All fields are required" });
        }

        // Create a new book instance
        const newbook = new Book({
            title: request.body.title, 
            author: request.body.author,
            publishYear: request.body.publishYear
        });

        // Save the book to the database
        const savedBook = await newbook.save();

        // Respond with the saved book
        return response.status(201).send(savedBook);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route get all books 
app.get("/books", async (request, response) => {
    try{
            const books= await Book.find({});
            return response.status(200).json({

                count: books.length,
                data:books
            }
            );
    } catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});
// Route get all books 
app.get("/books/:id", async (request, response) => {
    try{
         const {id} = request.params;

            const books= await Book.findById(id);
            return response.status(200).json(books);
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

