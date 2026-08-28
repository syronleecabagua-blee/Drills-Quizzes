const mysql = require('mysql2');
require('dotenv').config();

/**
 * Database Connection Lifecycle
 * 
 * The connection pool establishes and manages multiple database connections
 * that are created when the server initializes and remain active throughout
 * the application lifecycle. Connection pooling is implemented to:
 * 
 * 1. Reduce overhead of creating new connections for each request
 * 2. Manage concurrent database operations efficiently
 * 3. Automatically handle connection timeouts and reconnections
 */
class DatabaseConnection {
    constructor() {
        // Connection pool initialization with config values from environment variables
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,        // Database server address
            user: process.env.DB_USER,        // Authentication credentials
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,         // Queue requests when connections are busy
            connectionLimit: 10,              // Maximum concurrent connections
            queueLimit: 0,                    // Unlimited queue size
            enableKeepAlive: true,            // Maintain connection through idle periods
            keepAliveInitialDelay: 0
        });

        // Promisify pool queries for async/await support
        this.promisePool = this.pool.promise();
        
        // Connection health check on startup
        this.verifyConnection();
    }

    /**
     * Connection Verification and Error Handling
     * 
     * This method tests the database connection during initialization.
     * If the connection fails, it throws an error that will crash the server,
     * preventing the application from running without a valid database connection.
     */
    async verifyConnection() {
        try {
            const connection = await this.promisePool.getConnection();
            console.log('✅ Database connection established successfully');
            connection.release(); // Release back to pool for reuse
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            // Terminate process if database is unreachable
            process.exit(1);
        }
    }

    /**
     * Query Execution Lifecycle
     * 
     * This method handles the complete query execution lifecycle:
     * 1. Acquires a connection from the pool (blocks if none available)
     * 2. Prepares and executes the SQL query with parameterized values
     * 3. Receives and processes the result set from MySQL
     * 4. Releases the connection back to the pool
     * 5. Handles any errors that occur during execution
     */
    async executeQuery(sql, params = []) {
        let connection;
        try {
            // Step 1: Acquire connection from pool
            connection = await this.promisePool.getConnection();
            
            // Step 2: Execute parameterized query to prevent SQL injection
            const [rows, fields] = await connection.query(sql, params);
            
            // Step 3: Process and transform MySQL result set
            // MySQL returns RowDataPacket objects - convert to plain objects
            const result = Array.isArray(rows) ? rows.map(row => ({ ...row })) : { ...rows };
            
            return result;
        } catch (error) {
            // Error handling with detailed error context
            console.error('Query execution error:', {
                sql: sql,
                params: params,
                error: error.message
            });
            throw new Error(`Database operation failed: ${error.message}`);
        } finally {
            // Step 4: Always release connection back to pool
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Transaction Support
     * 
     * Enables ACID-compliant operations by grouping multiple queries
     * into a single atomic unit. All queries must succeed for the
     * transaction to commit; any failure triggers a rollback.
     */
    async beginTransaction() {
        const connection = await this.promisePool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async commitTransaction(connection) {
        await connection.commit();
        connection.release();
    }

    async rollbackTransaction(connection) {
        await connection.rollback();
        connection.release();
    }
}

// Export singleton instance - ensures only one connection pool exists
module.exports = new DatabaseConnection();