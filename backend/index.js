import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerDocs from './utils/swagger.js';
import authRoutes from './routes/auth.route.js';
import usersRoutes from './routes/users.route.js';
import postsRoutes from './routes/posts.route.js';
import commentsRoutes from './routes/comments.route.js';
import postLikesRoutes from './routes/postLikes.route.js';
import categoryRoutes from './routes/category.route.js';
import initDB from './database/init.js';
import './models/associations.js';

const port = process.env.PORT || 3000;
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', postsRoutes);
app.use('/api', commentsRoutes);
app.use('/api', postLikesRoutes);
app.use('/api/categories', categoryRoutes);


initDB().then(() => {
    // Setup associations after database is initialized

    console.log('Auto-complete scheduler started');

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        // Initialize Swagger docs
        swaggerDocs(app, port);
    });
}).catch(error => {
    console.error('Invalid database connection:', error);
});

