const request = require("supertest");
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

// Mock SQLite3 and open function
jest.mock("sqlite3");
jest.mock("sqlite", () => ({
  open: jest.fn(),
}));

const app = express();
app.use(express.json());

// Mock database object
let db;

// Define the database file path
const dbpath = path.join(__dirname, "contacts.db");

// Test setup before all tests
beforeAll(async () => {
  // Mock the `open` method to simulate a database connection.
  db = {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
  };

  // Mock the actual open function to return the mocked db instance.
  open.mockResolvedValue(db);

  // Now initialize the app and database connection
  await open({
    filename: dbpath,
    driver: sqlite3.Database,
  });

  // Define your routes as usual
  app.post("/contacts", async (req, res) => {
    const { Name, Email, PhoneNumber } = req.body;

    if (!Name || !Email || !PhoneNumber) {
      return res.status(400).send("Name, email, and phone number are required");
    }

    const existingUser = await db.get("SELECT * FROM Users WHERE Email=?", [Email]);
    if (existingUser) {
      return res.status(201).send("User Already Exists");
    }

    await db.run("INSERT INTO Users (Name, Email, PhoneNumber) VALUES (?, ?, ?)", [Name, Email, PhoneNumber]);
    return res.status(200).send("User Added Successfully");
  });

  app.get("/contacts/:ContactID", async (req, res) => {
    const { ContactID } = req.params;
    const user = await db.get("SELECT * FROM Users WHERE ContactID=?", [ContactID]);

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    return res.status(200).send(user);
  });

  // Initialize the server to listen on port 3000
  app.listen(3000);
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Test suite for POST /contacts
describe("POST /contacts", () => {
  it("should add a new user", async () => {
    const newUser = {
      Name: "John Doe",
      Email: "john@example.com",
      PhoneNumber: "123456789",
    };

    db.get.mockResolvedValueOnce(undefined); // Simulate no existing user
    db.run.mockResolvedValueOnce(undefined); // Simulate successful insert

    const response = await request(app).post("/contacts").send(newUser);

    expect(response.status).toBe(200);
    expect(response.text).toBe("User Added Successfully");
  });

  it("should return 400 if required fields are missing", async () => {
    const newUser = { Name: "John Doe" }; // Missing email and phone number

    const response = await request(app).post("/contacts").send(newUser);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Name, email, and phone number are required");
  });

  it("should return 201 if the user already exists", async () => {
    const existingUser = {
      Name: "John Doe",
      Email: "john@example.com",
      PhoneNumber: "123456789",
    };

    db.get.mockResolvedValueOnce(existingUser); // Simulate existing user

    const response = await request(app).post("/contacts").send(existingUser);

    expect(response.status).toBe(201);
    expect(response.text).toBe("User Already Exists");
  });
});

// Test suite for GET /contacts/:ContactID
describe("GET /contacts/:ContactID", () => {
  it("should return user details if the user exists", async () => {
    const user = {
      ContactID: 1,
      Name: "John Doe",
      Email: "john@example.com",
      PhoneNumber: "123456789",
    };

    db.get.mockResolvedValueOnce(user); // Simulate user exists

    const response = await request(app).get("/contacts/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  it("should return 404 if the user does not exist", async () => {
    db.get.mockResolvedValueOnce(undefined); // Simulate user does not exist

    const response = await request(app).get("/contacts/999");

    expect(response.status).toBe(404);
    expect(response.text).toBe("User Not Found");
  });
});
