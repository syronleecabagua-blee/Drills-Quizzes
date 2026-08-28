    const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const ValidationMiddleware = require('./middleware/validation');

/**
 * Express Application Initialization
 * 
 * The application follows a layered architecture:
 * 1. Configuration Layer - middleware registration
 * 2. Routing Layer - route handling
 * 3. Error Handling Layer - centralized error processing
 * 
 * Request processing pipeline:
 * Request → Middleware Stack → Route Handler → Controller → Model → Database
 * Response flows back through the same path in reverse
 */
class App {
    constructor() {
        // Initialize Express instance
        this.app = express();
        
        // Configure middleware and routes
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
        
        // Start server
        this.startServer();
    }

    /**
     * Middleware Setup
     * 
     * Middleware functions in Express execute in the order they're registered.
     * Each middleware receives req, res, and next parameters:
     * - req: contains request data (headers, body, params, query)
     * - res: used to send response to client
     * - next: passes control to next middleware or route handler
     */
    setupMiddleware() {
        // Security middleware
        this.app.use(helmet()); // Sets various HTTP headers for security
        
        // CORS - enables cross-origin requests
        this.app.use(cors({
            origin: '*', // In production, restrict this to specific domains
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        // Request logging middleware
        this.app.use(ValidationMiddleware.logger);
        
        // Body parsing middleware
        // Express parses incoming request bodies and makes them available under req.body
        this.app.use(express.json({ limit: '10mb' })); // JSON payloads
        this.app.use(express.urlencoded({ extended: true })); // URL-encoded data
        
        // Static file serving (if needed)
        // this.app.use('/uploads', express.static('uploads'));
    }

    /**
     * Route Registration
     * 
     * Routes define the API endpoints and map them to controllers.
     * All product endpoints are prefixed with /api
     */
    setupRoutes() {
        // API versioning for future compatibility
        this.app.use('/api', productRoutes);
        
        // Root endpoint for API health check
        this.app.get('/', (req, res) => {
            res.json({
                status: 'online',
                message: 'E-Commerce Product API is running',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                endpoints: {
                    products: '/api/products',
                    productById: '/api/products/:id',
                    search: '/api/products/search',
                    bulkUpdate: '/api/products/bulk/stock'
                }
            });
        });
        
        // 404 handler for unmatched routes
        this.app.use((req, res) => {
            res.status(404).json({
                status: 'error',
                message: `Route ${req.method} ${req.path} not found`
            });
        });
    }

    /**
     * Centralized Error Handling
     * 
     * This middleware catches any errors that occur during request processing.
     * It formats error responses consistently and logs errors for debugging.
     */
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            // Log error details for debugging
            console.error('Error details:', {
                method: req.method,
                path: req.path,
                error: err.stack || err.message,
                timestamp: new Date().toISOString()
            });
            
            // Determine appropriate response based on error type
            const statusCode = err.status || 500;
            const message = err.message || 'Internal Server Error';
            
            // Send formatted error response
            res.status(statusCode).json({
                status: 'error',
                message: message,
                path: req.path,
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * Server Initialization
     * 
     * Starts the HTTP server and begins listening for incoming connections.
     * The server handles the following events:
     * - Listening: Server is ready to accept connections
     * - Error: Handles port conflicts and other startup errors
     * - Close: Graceful shutdown on termination signals
     */
    startServer() {
        const PORT = process.env.PORT || 5000;
        
        const server = this.app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API documentation available at /`);
            console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
        });
        
        // Graceful shutdown on termination signals
        const shutdown = () => {
            console.log('🛑 Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        };
        
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
        
        // Error handling for server
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
                process.exit(1);
            }
            console.error('❌ Server error:', error);
        });
    }
}

// Create and start the application
const app = new App();

// Export for testing purposes
module.exports = app.app;