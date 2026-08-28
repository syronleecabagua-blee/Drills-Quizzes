const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const ValidationMiddleware = require('../middleware/validation');

/**
 * Route Definitions and Middleware Registration
 * 
 * The routing layer maps HTTP methods and URL patterns to controller methods.
 * Middleware execution order is crucial - each middleware modifies the request
 * object or can short-circuit the response chain.
 * 
 * Execution flow for each route:
 * 1. Express receives HTTP request
 * 2. URL matching against route patterns
 * 3. Middleware functions execute in registration order
 * 4. Controller method executes after all middleware passes
 * 5. Response is sent back to client
 */

// === CREATE Operations ===

/**
 * POST /api/products
 * Middleware chain:
 * 1. validateProductCreation - validates request body
 * 2. ProductController.createProduct - handles creation
 */
router.post(
    '/products',
    ValidationMiddleware.validateProductCreation,
    ProductController.createProduct
);

// === READ Operations ===

/**
 * GET /api/products
 * No middleware - directly calls controller
 * Query parameters: limit, offset for pagination
 */
router.get(
    '/products',
    ProductController.getAllProducts
);

/**
 * GET /api/products/search
 * Controller validates search parameter
 */
router.get(
    '/products/search',
    ProductController.searchProducts
);

/**
 * GET /api/products/:id
 * Middleware validates ID parameter is numeric
 */
router.get(
    '/products/:id',
    ValidationMiddleware.validateId,
    ProductController.getProductById
);

// === UPDATE Operations ===

/**
 * PUT /api/products/:id
 * Updates entire product or partial fields
 * Middleware validates ID then controller handles update
 */
router.put(
    '/products/:id',
    ValidationMiddleware.validateId,
    ProductController.updateProduct
);

// === DELETE Operations ===

/**
 * DELETE /api/products/:id
 * Removes product from database
 * Middleware validates ID before deletion
 */
router.delete(
    '/products/:id',
    ValidationMiddleware.validateId,
    ProductController.deleteProduct
);

// === BULK Operations ===

/**
 * PATCH /api/products/bulk/stock
 * Demonstrates custom route for specialized operation
 */
router.patch(
    '/products/bulk/stock',
    ProductController.bulkUpdateStock
);

module.exports = router;