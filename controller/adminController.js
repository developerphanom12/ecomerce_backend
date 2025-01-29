import pool from "../database/connection.js";  // Assuming you have a pool connection to MySQL
import xlsx from "xlsx"; // For reading Excel files
import { productfilter } from "../service/adminSevice.js";
import success from "../middleware/success.js";
 
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

    // Create the SQL query to create the table if it doesn't exist
    let createTableSql = `CREATE TABLE IF NOT EXISTS ProductListRecord (
      id INT AUTO_INCREMENT PRIMARY KEY, `;
    
    columns.forEach((col) => {
      createTableSql += `\`${col}\` TEXT, `;
    });
    
    createTableSql = createTableSql.slice(0, -2) + ")"; // Remove trailing comma and close the query

    console.log('SQL Query to Create Table:', createTableSql); // Log the query for debugging

    // Create the table if it doesn't exist
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

    // Prepare the INSERT INTO SQL query
    const insertDataSql = `INSERT INTO ProductListRecord (${columns.map(col => `\`${col}\``).join(", ")}) VALUES ?`;

    // Map the sheet data to values to insert into the database
    const values = sheetData.map(row => columns.map(col => row[col]));

    console.log('SQL Query to Insert Data:', insertDataSql); // Log the insert query for debugging
    console.log('Values to Insert:', values); // Log the values for debugging

    // Insert the data into the table
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


export const ProductList = async (req, res) => {
    const { category, type, page = 1, limit = 10 } = req.query;
        
    try {
      const { products, total } = await productfilter(category, type, page, limit);
  //ddd
      if (products.length > 0) {
        return res.status(200).json({
          status: success.successTrue,
          total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          data: products,
        });
      } else {
        return res.status(400).json({
          status: success.successFalse,
          message: success.nodata,
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: success.successFalse,
        message: error.message,
      });
    }
  };
  

  