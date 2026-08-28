const mysql = require('mysql2');
require('dotenv').config();

class DatabaseConnection {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });

        this.promisePool = this.pool.promise();
        
        this.verifyConnection();
    }

    async verifyConnection() {
        try {
            const connection = await this.promisePool.getConnection();
            console.log('✅ Database connection established successfully');
            connection.release();
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        }
    }

    async executeQuery(sql, params = []) {
        let connection;
        try {
            connection = await this.promisePool.getConnection();
            
            const [rows, fields] = await connection.query(sql, params);
            
            const result = Array.isArray(rows) 
                ? rows.map(row => ({ ...row })) 
                : { ...rows };
            
            return result;
        } catch (error) {
            console.error('Query execution error:', {
                sql: sql,
                params: params,
                error: error.message
            });
            throw new Error(`Database operation failed: ${error.message}`);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

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

module.exports = new DatabaseConnection();