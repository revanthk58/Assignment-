# Cantact Management API

This is an API built using **Node.js** and **SQLite** to manage user contacts in a database. The API allows you to add, update, delete, and retrieve user contact information, including Name, Email, PhoneNumber, and Address. It exposes several endpoints for interacting with the data.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation Instructions](#installation-instructions)
3. [Endpoints](#endpoints)
   - [GET /contacts](#get-contacts)
   - [POST /contacts](#post-contacts)
   - [GET /contacts/:ContactID](#get-contact-by-id)
   - [PUT /contacts/:ContactID](#put-contact-by-id)
   - [DELETE /contacts/:ContactID](#delete-contact-by-id)
4. [Database Setup](#database-setup)
5. [Error Handling](#error-handling)

---

## Technologies Used

- **Node.js**: Server-side JavaScript environment.
- **Express**: Framework to create the RESTful API.
- **SQLite**: Lightweight database to store user contact information.
- **SQLite3**: SQLite3 package used to interact with the database.
- **SQLite**: SQLite wrapper to handle database connections.

---

## Installation Instructions

| Step | Description |
|------|-------------|
| 1.   | Clone the repository: `git clone https://github.com/revanthk58/Assignment-.git` |
| 2.   | Navigate into the project directory: `cd backend directory` |
| 3.   | Install the dependencies: `npm install` |
| 4.   | Ensure **Node.js** and **npm** are installed on your Device. |
| 5.   | Start the server: `npm start` |
| 6.   | The server will run at `http://localhost:3000`. |

---

## Endpoints

### GET /contacts

**Description**: Retrieves all contacts from the database. You can also filter results using `Name` and/or `Email` query parameters.

**Request Parameters**:
- `Name`: Optional. Filter contacts by name (case-insensitive).
- `Email`: Optional. Filter contacts by email (case-insensitive).

**Example Request**:
       
    -GET http://localhost:3000/contacts/
    
    -GET http://localhost:3000/contacts/?Name=Rohit
    
    -GET http://localhost:3000/contacts/?Email=shreyas.iyer@example.com&Name=Shreyas
    
    -GET http://localhost:3000/contacts/?Email=mayank.agarwal@example.com



    


### POST/contacts:

**Description**: To Add new user to Database,but primarly chech if already exists.if not Added to successfully.Other wise return with Bad request and message.



**Example Request**:

      POST http://localhost:3000/contacts
      Content-Tyep: application/json
      {
       - "Name": "John Doe",
      -  "Email": "john.doe@example.com",
       - "PhoneNumber": "1234567890",
       - "Address": "123 Main St" 
      }




### PUT/contacts:

**Description**: To Upadte the  user in Database whuch alredy exists, but primarly check if in/not in database.updates successfully.Other wise return with Bad request and message.

**Example Request**:

      PUT http://localhost:3000/contacts/:ContactID
      Content-Type: application/json
      {
       - "Name": "revanth Doe",
      -  "Email": "bannu.doe@exkanna.com",
       - "PhoneNumber": "8790565759",
       - "Address": "123 Main St" 
      }



### DELETE/contacts:

**Description**: To Delete the  user in Database which alredy exists, but primarly check if in/not in database.Then it proceeds to Delete the User.Other wise return with Bad request and message.

**Example Request**:

      DELETE http://localhost:3000/contacts/:ContactID



# Testing
## test.js
 create a js file in __test__ folder   with  test.js

 **Write the test cases in javascript 
 
 ** install package.json file  with npm init or npm init -y
 
 ** install dependecies for testing such as "jest,sqlite and supertest etc"

 After complteing above redirect to  __test__ folder   and  run testCases


 ####After Testing
 ![image alt](https://github.com/revanthk58/Assignment-/blob/master/Screenshot%20(5).png?raw=true)



 # Database Setup

 Here we used Sqlite database to  make CRUD operations on the data 

 created a table with "Users" name
         
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
         UserMangement();







#OUT PUT 
 ![image alt]( )


 I have created A html page to show the users data colourfully
 
