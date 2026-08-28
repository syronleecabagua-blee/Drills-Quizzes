const ProductModel = require('../models/productModel');

/**
 * Product Controller - Request/Response Lifecycle Manager
 * 
 * The controller layer handles HTTP request processing and response formatting.
 * Each method corresponds to an API endpoint and follows this pattern:
 * 
 * 1. Receive and parse request object (headers, body, params, query)
 * 2. Validate and sanitize input
 * 3. Call appropriate model method
 * 4. Format and send response object
 * 5. Handle and propagate errors
 */
class ProductController {
    /**
     * CREATE - POST /api/products
     * 
     * Request Flow:
     * 1. Extract product data from request body
     * 2. Pass data to model for database insertion
     * 3. Format successful response with 201 Created status
     * 4. Catch and handle any database errors
     */
    async createProduct(req, res, next) {
        try {
            // Extract validated data from request body
            const productData = req.body;
            
            // Call model to create product in database
            const newProduct = await ProductModel.create(productData);
            
            // Format and send 201 response with created product
            res.status(201).json({
                status: 'success',
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            // Pass error to error-handling middleware
            next(error);
        }
    }

    /**
     * READ ALL - GET /api/products
     * 
     * Request Flow:
     * 1. Extract pagination parameters from query string
     * 2. Default values applied if parameters are missing
     * 3. Call model to fetch products with pagination
     * 4. Format response with pagination metadata
     */
    async getAllProducts(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const products = await ProductModel.findAll(limit, offset);
            
            res.status(200).json({
                status: 'success',
                data: products,
                meta: {
                    count: products.length,
                    limit: limit,
                    offset: offset
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * READ ONE - GET /api/products/:id
     * 
     * Request Flow:
     * 1. Extract ID from request parameters
     * 2. Validate ID exists (handled by middleware)
     * 3. Call model to fetch single product
     * 4. Return 404 if product not found
     * 5. Return product data on success
     */
    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            
            // Call model to fetch product
            const product = await ProductModel.findById(id);
            
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: `Product with ID ${id} not found`
                });
            }
            
            res.status(200).json({
                status: 'success',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * SEARCH - GET /api/products/search
     * 
     * Request Flow:
     * 1. Extract search term from query parameter
     * 2. Validate search term presence
     * 3. Call model to perform search
     * 4. Return matching products
     */
    async searchProducts(req, res, next) {
        try {
            const { q } = req.query;
            
            if (!q || q.trim().length < 2) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query must be at least 2 characters'
                });
            }
            
            const products = await ProductModel.search(q);
            
            res.status(200).json({
                status: 'success',
                data: products,
                meta: {
                    query: q,
                    count: products.length
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * UPDATE - PUT /api/products/:id
     * 
     * Request Flow:
     * 1. Extract ID from parameters and update data from body
     * 2. Check if product exists before update
     * 3. Call model to perform update
     * 4. Return updated product on success
     */
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            // Verify product exists
            const existingProduct = await ProductModel.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: `Product with ID ${id} not found`
                });
            }
            
            // Perform update
            const updatedProduct = await ProductModel.update(id, updateData);
            
            if (!updatedProduct) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No valid fields provided for update'
                });
            }
            
            res.status(200).json({
                status: 'success',
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE - DELETE /api/products/:id
     * 
     * Request Flow:
     * 1. Extract ID from parameters
     * 2. Check if product exists
     * 3. Call model to delete product
     * 4. Return success message on deletion
     */
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            
            // Verify product exists before deletion
            const existingProduct = await ProductModel.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: `Product with ID ${id} not found`
                });
            }
            
            // Perform deletion
            await ProductModel.delete(id);
            
            res.status(200).json({
                status: 'success',
                message: `Product ${id} deleted successfully`,
                data: { deleted_id: id }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * BULK UPDATE - PATCH /api/products/bulk/stock
     * 
     * Demonstrates handling complex operations with transaction support
     */
    async bulkUpdateStock(req, res, next) {
        try {
            const { updates } = req.body;
            
            if (!Array.isArray(updates) || updates.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Updates array is required and must not be empty'
                });
            }
            
            // Validate each update entry
            for (const update of updates) {
                if (!update.id || update.quantity === undefined) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Each update must contain id and quantity'
                    });
                }
            }
            
            // Perform bulk update with transaction
            await ProductModel.updateBulkStock(updates);
            
            res.status(200).json({
                status: 'success',
                message: 'Stock quantities updated successfully',
                data: { updated_count: updates.length }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();