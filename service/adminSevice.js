// tableService.js
import pool from "../database/connection.js";
import xlsx from "xlsx";

// Function to create a table in MySQL
export const createTable = async (columns) => {
  return new Promise((resolve, reject) => {
    let sql = `CREATE TABLE IF NOT EXISTS ProductsList (
      id INT AUTO_INCREMENT PRIMARY KEY, `;

    // Adding columns dynamically
    columns.forEach((col) => {
      sql += `\`${col}\` TEXT, `;
    });

    sql = sql.slice(0, -2) + ")"; // Remove last comma and close bracket

    // Using the pool.query method to execute the SQL
    pool.query(sql, (error, results) => {
      if (error) {
        reject(`Error creating table: ${error.message}`);
      } else {
        resolve("Table created successfully.");
      }
    });
  });
};

// Function to insert data into the products table
export const insertData = async (data) => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(data[0]).map((key) => `\`${key}\``).join(", ");
      const values = data
        .map(
          (row) =>
            `(${Object.values(row)
              .map((val) => `'${val}'`)
              .join(", ")})`
        )
        .join(", ");
  
      const sql = `INSERT INTO products (${keys}) VALUES ${values}`;
  
      pool.query(sql, (error, results) => {
        if (error) {
          reject(`Error inserting data: ${error.message}`);
        } else {
          resolve("Data inserted successfully.");
        }
      });
    });
  };
  
  export const  executeQueryUsers = async (query, params) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(results);
        }
      });
    });
  };

  export const productfilterTag = async (tag) => {
  
    let query = `
      SELECT * FROM ProductListRecord
      WHERE  tag = ?
    `;
    
    let countQuery = `
      SELECT COUNT(*) AS total FROM ProductListRecord
      WHERE tag = ?
    `;
    
    const queryParams = [tag];
   
    try {
      const products = await executeQueryUsers(query, queryParams);
      const totalResult = await executeQueryUsers(countQuery, queryParams);
      const total = totalResult[0]?.total || 0;
  
      return { products, total };
    } catch (err) {
      throw new Error(`Failed to fetch assigned products: ${err.message}`);
    }
  };
  
  
  export const productfilter = async (category, type, page, limit, price) => {
    const offset = (page - 1) * limit;
  
    let query = `
      SELECT * FROM ProductListRecord
      WHERE category = ? AND type = ?
    `;
    
    let countQuery = `
      SELECT COUNT(*) AS total FROM ProductListRecord
      WHERE category = ? AND type = ?
    `;
    
    const queryParams = [category, type];
    if (price) {
      query += ' AND price = ?';
      countQuery += ' AND price = ?';
      queryParams.push(Number(price));
    }
  
    query += ' LIMIT ? OFFSET ?';
    countQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), Number(offset));
  
    try {
      const products = await executeQueryUsers(query, queryParams);
      const totalResult = await executeQueryUsers(countQuery, queryParams);
      const total = totalResult[0]?.total || 0;
  
      return { products, total };
    } catch (err) {
      throw new Error(`Failed to fetch assigned products: ${err.message}`);
    }
  };