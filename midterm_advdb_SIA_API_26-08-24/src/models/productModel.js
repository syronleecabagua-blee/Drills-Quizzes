const db = require('../config/database');

/**
 * Product Model - Data Access Layer
 * 
 * The model layer abstracts database operations from the controller.
 * Each method represents a specific CRUD operation, handling the
 * SQL query construction and parameter binding.
 */
class ProductModel {
    /**
     * CREATE Operation
     * 
     * Inserts a new product record into the database.
     * The SQL INSERT statement uses named placeholders for security.
     * Returns the ID of the newly created record.
     */
    async create(productData) {
        const { name, description, price, category, stock_quantity } = productData;
        
        const sql = `
            INSERT INTO products (name, description, price, category, stock_quantity)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const params = [name, description, price, category, stock_quantity || 0];
        
        // Execute query and capture the insertId from the result
        const result = await db.executeQuery(sql, params);
        return { id: result.insertId, ...productData };
    }

    /**
     * READ - Get All Products
     * 
     * Retrieves all product records with optional pagination.
     * The SELECT query fetches all columns from the products table.
     * Results are ordered by creation date (newest first).
     */
    async findAll(limit = 100, offset = 0) {
        const sql = `
            SELECT * FROM products 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        return await db.executeQuery(sql, [limit, offset]);
    }

    /**
     * READ - Get Single Product by ID
     * 
     * Fetches a single product using its primary key.
     * Returns null if no matching record exists.
     */
    async findById(id) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const results = await db.executeQuery(sql, [id]);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * READ - Search Products
     * 
     * Implements full-text search across name and description fields.
     * Uses SQL LIKE pattern matching with wildcards for flexible searching.
     */
    async search(searchTerm) {
        const sql = `
            SELECT * FROM products 
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
            ORDER BY name ASC
        `;
        const pattern = `%${searchTerm}%`;
        return await db.executeQuery(sql, [pattern, pattern, pattern]);
    }

    /**
     * UPDATE Operation
     * 
     * Updates specific fields of an existing product record.
     * Dynamically builds the SET clause based on which fields are provided.
     * The updated_at timestamp is automatically managed by MySQL.
     */
    async update(id, updateData) {
        // Build dynamic UPDATE query based on provided fields
        const fields = [];
        const values = [];
        
        if (updateData.name) {
            fields.push('name = ?');
            values.push(updateData.name);
        }
        if (updateData.description !== undefined) {
            fields.push('description = ?');
            values.push(updateData.description);
        }
        if (updateData.price !== undefined) {
            fields.push('price = ?');
            values.push(updateData.price);
        }
        if (updateData.category) {
            fields.push('category = ?');
            values.push(updateData.category);
        }
        if (updateData.stock_quantity !== undefined) {
            fields.push('stock_quantity = ?');
            values.push(updateData.stock_quantity);
        }
        
        // If no fields to update, return without executing
        if (fields.length === 0) {
            return null;
        }
        
        values.push(id); // For WHERE clause
        
        const sql = `
            UPDATE products 
            SET ${fields.join(', ')} 
            WHERE id = ?
        `;
        
        await db.executeQuery(sql, values);
        return await this.findById(id);
    }

    /**
     * DELETE Operation
     * 
     * Removes a product record from the database.
     * Returns the number of affected rows to confirm deletion.
     */
    async delete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';
        const result = await db.executeQuery(sql, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Bulk Stock Update
     * 
     * Demonstrates batch update capability using a transaction.
     * Updates stock quantities for multiple products in one atomic operation.
     */
    async updateBulkStock(stockUpdates) {
        const connection = await db.beginTransaction();
        
        try {
            const updatePromises = stockUpdates.map(({ id, quantity }) => {
                const sql = 'UPDATE products SET stock_quantity = ? WHERE id = ?';
                return connection.query(sql, [quantity, id]);
            });
            
            await Promise.all(updatePromises);
            await db.commitTransaction(connection);
            return true;
        } catch (error) {
            await db.rollbackTransaction(connection);
            throw error;
        }
    }
}

module.exports = new ProductModel();