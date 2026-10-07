const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/Contact");

const app = express();

// =========================
// Middleware
// =========================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


// =========================
// MongoDB Connection
// =========================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });


// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Contact Management API is running",
        status: "success"
    });
});


// =========================
// POST /contacts
// Create Contact
// =========================

app.post("/contacts", async (req, res) => {
    try {
        const { contactId, name, phone, email } = req.body;

        if (!contactId || !name || !phone || !email) {
            return res.status(400).json({
                message: "All fields are required",
                requiredFields: [
                    "contactId",
                    "name",
                    "phone",
                    "email"
                ]
            });
        }

        const contact = new Contact({
            contactId,
            name,
            phone,
            email
        });

        const savedContact = await contact.save();

        res.status(201).json({
            message: "Contact created successfully",
            contact: savedContact
        });

    } catch (error) {

        // Duplicate contactId or email
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                message: `${duplicateField} already exists`,
                error: error.message
            });
        }

        res.status(400).json({
            message: "Error creating contact",
            error: error.message
        });
    }
});


// =========================
// GET /contacts
// Get All Contacts
// =========================

app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();

        res.status(200).json({
            count: contacts.length,
            contacts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching contacts",
            error: error.message
        });
    }
});


// =========================
// GET /contacts/:id
// Get Single Contact
// =========================

app.get("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json({
            contact
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid contact ID",
            error: error.message
        });
    }
});


// =========================
// PUT /contacts/:id
// Update Contact
// =========================

app.put("/contacts/:id", async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json({
            message: "Contact updated successfully",
            contact: updatedContact
        });

    } catch (error) {

        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                message: `${duplicateField} already exists`,
                error: error.message
            });
        }

        res.status(400).json({
            message: "Error updating contact",
            error: error.message
        });
    }
});


// =========================
// DELETE /contacts/:id
// Delete Contact
// =========================

app.delete("/contacts/:id", async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(
            req.params.id
        );

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json({
            message: "Contact deleted successfully",
            contact: deletedContact
        });

    } catch (error) {
        res.status(400).json({
            message: "Error deleting contact",
            error: error.message
        });
    }
});


// =========================
// Unknown Route Handler
// =========================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});