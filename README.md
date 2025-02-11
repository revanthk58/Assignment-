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
6. [License](#license)

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
| 1.   | Clone the repository: `git clone https://github.com/yourusername/contact-management-api.git` |
| 2.   | Navigate into the project directory: `cd contact-management-api` |
| 3.   | Install the dependencies: `npm install` |
| 4.   | Ensure **Node.js** and **npm** are installed on your machine. |
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



    


## POST/contacts:

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




## PUT/contacts:

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



## DELETE/contacts:

**Description**: To Delete the  user in Database which alredy exists, but primarly check if in/not in database.Then it proceeds to Delete the User.Other wise return with Bad request and message.

**Example Request**:

      DELETE http://localhost:3000/contacts/:ContactID

      


