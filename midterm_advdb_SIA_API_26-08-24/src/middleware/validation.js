/**
 * Request Validation Middleware
 * 
 * This middleware intercepts incoming requests before they reach the route handler.
 * It parses the request body, validates required fields, and verifies data types.
 * 
 * Middleware execution flow:
 * 1. Request enters middleware chain
 * 2. Body is parsed and validated
 * 3. If validation passes, request proceeds to route handler
 * 4. If validation fails, returns 400 response immediately
 */
class ValidationMiddleware {
    /**
     * Product Creation Validation
     * 
     * Validates that all required fields are present and correctly formatted.
     * Checks:
     * - name: string, min length 2
     * - price: numeric, positive value
     * - stock_quantity: integer, non-negative
     */
    validateProductCreation(req, res, next) {
        const { name, price, stock_quantity, category } = req.body;
        
        // Validation error accumulator
        const errors = [];
        
        // Name validation
        if (!name || name.trim().length < 2) {
            errors.push('Product name is required and must be at least 2 characters');
        }
        
        // Price validation
        if (price === undefined || isNaN(price) || Number(price) < 0) {
            errors.push('Price is required and must be a valid positive number');
        }
        
        // Stock validation
        if (stock_quantity !== undefined && (!Number.isInteger(Number(stock_quantity)) || Number(stock_quantity) < 0)) {
            errors.push('Stock quantity must be a non-negative integer');
        }
        
        // If validation fails, send error response
        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }
        
        // Validation passed - proceed to route handler
        next();
    }

    /**
     * ID Parameter Validation
     * 
     * Ensures URL parameters are valid positive integers.
     * This prevents invalid database queries and injection attempts.
     */
    validateId(req, res, next) {
        const { id } = req.params;
        
        if (!id || isNaN(id) || Number(id) < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID parameter. Must be a positive integer'
            });
        }
        
        // Convert to number and store in request for convenience
        req.validatedId = Number(id);
        next();
    }

    /**
     * Error Handling Middleware
     * 
     * Catches all errors from route handlers and middleware.
     * Formats error responses consistently for the client.
     */
    errorHandler(err, req, res, next) {
        console.error('Error caught by middleware:', err);
        
        // Determine appropriate status code
        const status = err.status || 500;
        const message = err.message || 'Internal server error';
        
        res.status(status).json({
            status: 'error',
            message: message,
            timestamp: new Date().toISOString(),
            path: req.path
        });
    }

    /**
     * Request Logger Middleware
     * 
     * Logs all incoming requests with method, URL, and timestamp.
     * Useful for debugging and monitoring API usage.
     */
    logger(req, res, next) {
        const start = Date.now();
        
        // Log when response is sent
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        });
        
        next();
    }
}

module.exports = new ValidationMiddleware();