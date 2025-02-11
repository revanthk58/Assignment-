const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

let db = null;
const dbpath = path.join(__dirname, "contacts.db");

// Function to create the 'Users' table in the SQLite database
const createTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        ContactID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        PhoneNumber INTEGER UNIQUE NOT NULL,
        Address TEXT,
        CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.run(createTableQuery); // Execute the table creation query
    console.log("Users table created successfully");
  } catch (error) {
    console.log(`Error creating table: ${error.message}`);
  }
};

// Function to set up the database connection and start the server
const UserMangement = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    await createTable(); // Create the Users table

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (error) {
    console.log("Database Error", error.message);
  }
};
UserMangement(); // Initialize the database and start the server

// GET endpoint to retrieve all contacts or search based on query parameters (Name, Email)
app.get("/contacts/", async (request, response) => {
  try {
    const { Name, Email } = request.query; // Extract Name and Email from query parameters

    // Switch to handle different search conditions
    switch (true) {
      case (Name !== undefined && Email !== undefined): { // Search by both Name and Email
        const query = `SELECT * FROM Users WHERE Name LIKE ? AND Email LIKE ?`;
        const result = await db.get(query, [`%${Name}%`, `%${Email}%`]);
        response.send(result);
        break;
      }

      case (Email !== undefined): { // Search by Email only
        const query = `SELECT * FROM Users WHERE Email LIKE ?`;
        const result = await db.get(query, [`%${Email}%`]);
        response.send(result);
        break;
      }

      case (Name !== undefined): { // Search by Name only
        const query = `SELECT * FROM Users WHERE Name LIKE ?`;
        const result = await db.get(query, [`%${Name}%`]);
        response.send(result);
        break;
      }

      default: { // If no search parameters, return all users in the database
        try {
          const query = `SELECT * FROM Users ORDER BY ContactID`; // Get all users, ordered by ContactID
          const result = await db.all(query);
          response.status(200).json(result); // Send all users as JSON response
          break;
        } catch (error) {
          response.send("An Error Occurred");
          response.status(400);
        }
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("An error occurred while searching for user details.");
  }
});

// POST endpoint to add a new contact
app.post("/contacts", async (request, response) => {
  try {
    const { Name, Email, PhoneNumber, Address } = request.body; // Extract data from the request body

    // Sanitize inputs to check if essential fields are present
    if (!Name || !Email || !PhoneNumber) {
      return response.status(400).send("Name, email, and phone number are required");
    }

    // Check if user with the same email already exists
    const Userexist = `SELECT * FROM Users WHERE Email=?`;
    const res = await db.get(Userexist, [Email]);

    if (res === undefined) { // If user doesn't exist, add the new user
      const query = `
        INSERT INTO Users (Name, Email, PhoneNumber, Address)
        VALUES (?, ?, ?, ?)
      `;
      await db.run(query, [Name, Email, PhoneNumber, Address]);
      response.status(200).send("Added New User Successfully");
    } else {
      response.status(201).send("User Already Exists");
    }
  } catch (error) {
    console.error("Error:", error.message);
    response.status(400).send("The Error Occurred");
  }
});

// PUT endpoint to update an existing user's contact details
app.put("/contacts/:ContactID", async (request, response) => {
  try {
    const { Name, Email, PhoneNumber, Address } = request.body; // Get the updated data from request body
    const { ContactID } = request.params; // Extract ContactID from request parameters

    // Ensure valid input before updating
    if (!Name || !Email || !PhoneNumber) {
      return response.status(400).send("Name, Email, and PhoneNumber are required.");
    }

    // Check if there's already an existing user with the same Email and Name
    const Userexist = `SELECT * FROM Users WHERE Email = ? AND Name = ?`;
    const existingUser = await db.get(Userexist, [Email, Name]);

    if (existingUser) {
      return response.status(400).send("User with this Email and Name already exists.");
    }

    // Check if the user exists by ContactID before updating
    const UserexistId = `SELECT * FROM Users WHERE ContactID = ?`;
    const user = await db.get(UserexistId, [ContactID]);

    if (!user) {
      return response.status(404).send("User Not Found");
    }

    // Update the user's details
    const query = `
      UPDATE Users
      SET Name = ?, Email = ?, PhoneNumber = ?, Address = ?
      WHERE ContactID = ?
    `;
    
    await db.run(query, [Name, Email, PhoneNumber, Address, ContactID]);
    response.status(200).send("User details updated.");
    
  } catch (err) {
    console.error("Error updating user:", err);
    response.status(500).send("An error occurred while updating user details.");
  }
});

// GET endpoint to retrieve a specific user's contact details by ContactID
app.get("/contacts/:ContactID", async (request, response) => {
  try {
    const { ContactID } = request.params; // Get the ContactID from request parameters
    const query = `SELECT * FROM Users WHERE ContactID = ?`;
    const result = await db.get(query, [ContactID]);
    
    if (!result) {
      return response.status(404).send(`User does not exist with ${ContactID}.`); // Return 404 if user not found
    }
    response.status(200).json(result); // Send the user details in the response
  } 
  catch (err) {
    console.error("Error fetching user:", err);
    response.status(500).send("An error occurred while fetching user details.");
  }
});

// DELETE endpoint to delete a specific user's contact by ContactID
app.delete("/contacts/:ContactID", async (request, response) => {
  try {
    const { ContactID } = request.params; // Extract ContactID from request parameters
    const query1 = `SELECT * FROM Users WHERE ContactID = ?`;
    const result1 = await db.get(query1, [ContactID]);
    
    if (!result1) {
      return response.status(404).send(`User does not exist with ContactID ${ContactID}.`); // Return 404 if user not found
    }

    // Run the delete query to remove the user from the database
    const query = `DELETE FROM Users WHERE ContactID = ?`;
    const result = await db.run(query, ContactID);

    // Check if any row was deleted
    if (result) {
      response.status(200).send("User deleted successfully.");
    } else {
      response.status(404).send("User not found."); // Return 404 if user doesn't exist
    }
  }
  catch (err) {
    console.error("Error deleting user:", err);
    response.status(400).send("An error occurred while deleting user.");
  }
});
