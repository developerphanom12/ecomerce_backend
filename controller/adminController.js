import pool from "../database/connection.js";  // Assuming you have a pool connection to MySQL
import xlsx from "xlsx"; // For reading Excel files

export const Productadd = async (req, res) => {
  try {
    const filePath = req.file.path;
    
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON array
    
    if (sheetData.length === 0) {
      return res.status(400).json({ message: 'Excel sheet is empty' });
    }

    const columns = Object.keys(sheetData[0]);

    let createTableSql = `CREATE TABLE IF NOT EXISTS productsssssssssssss (
      id INT AUTO_INCREMENT PRIMARY KEY, `;
    
    columns.forEach((col) => {
      createTableSql += `\`${col}\` TEXT, `;
    });
    
    createTableSql = createTableSql.slice(0, -2) + ")";

    console.log('SQL Query to Create Table:', createTableSql); // Log the query for debugging

    await new Promise((resolve, reject) => {
      pool.query(createTableSql, (error, results) => {
        if (error) {
          reject(`Error creating table: ${error.message}`);
        } else {
          console.log('Table created successfully:', results);
          resolve();
        }
      });
    });

    const insertDataSql = `INSERT INTO productsssssssssssss (${columns.map(col => `\`${col}\``).join(", ")}) VALUES ?`;
    const values = sheetData.map(row => columns.map(col => row[col])); // Map the row data to match the columns

    console.log('SQL Query to Insert Data:', insertDataSql); // Log the insert query for debugging

    await new Promise((resolve, reject) => {
      pool.query(insertDataSql, [values], (error, results) => {
        if (error) {
          reject(`Error inserting data: ${error.message}`);
        } else {
          console.log('Data inserted successfully:', results);
          resolve();
        }
      });
    });

    res.status(200).json({ message: "File uploaded and data processed successfully." });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
