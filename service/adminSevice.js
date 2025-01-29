// tableService.js
import pool from "../database/connection.js";
import xlsx from "xlsx";

// Function to create a table in MySQL
export const createTable = async (columns) => {
  return new Promise((resolve, reject) => {
    let sql = `CREATE TABLE IF NOT EXISTS productstessss (
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
  
