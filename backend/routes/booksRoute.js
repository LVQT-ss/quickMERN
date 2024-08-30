import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Route for saving a new book
router.post("/", async (request, response) => {
    try {
        if (
            !request.body.title || 
            !request.body.author || 
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: "All fields are required" });
        }

        const newbook = new Book({
            title: request.body.title, 
            author: request.body.author,
            publishYear: request.body.publishYear
        });

        const savedBook = await newbook.save();
        return response.status(201).send(savedBook);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get all books 
router.get("/", async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get a single book by ID
router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        if (!book) {
            return response.status(404).send({ message: "Book not found" });
        }
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to update a book by ID
router.put("/:id", async (request, response) => {
    try {
        if (
            !request.body.title || 
            !request.body.author || 
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: "All fields are required" });
        }

        const { id } = request.params;
        const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });

        if (!updatedBook) {
            return response.status(404).send({ message: "Book not found" });
        }

        return response.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to delete a book by ID
router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Book.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).send({ message: "Book not found" });
        }
        return response.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
