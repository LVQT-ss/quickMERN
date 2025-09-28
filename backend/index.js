import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerDocs from './utils/swagger.js';
import authRoutes from './routes/auth.route.js';
import tutorialRoutes from './routes/tutorial.route.js';
import categoryRoutes from './routes/category.route.js';
import interactionRoutes from './routes/interaction.route.js';
import initDB from './database/init.js';
import './models/associations.js';

const port = process.env.PORT || 3000;
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', interactionRoutes);


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

