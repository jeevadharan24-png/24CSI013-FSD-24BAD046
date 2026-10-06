const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/Contact");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });


// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Contact Management API is running"
    });
});


// POST /contacts
// Create a new contact
app.post("/contacts", async (req, res) => {
    try {

        const contact = new Contact(req.body);

        const savedContact = await contact.save();

        res.status(201).json({
            message: "Contact created successfully",
            contact: savedContact
        });

    } catch (error) {

        res.status(400).json({
            message: "Error creating contact",
            error: error.message
        });
    }
});


// GET /contacts
// Get all contacts
app.get("/contacts", async (req, res) => {
    try {

        const contacts = await Contact.find();

        res.status(200).json({
            count: contacts.length,
            contacts: contacts
        });

    } catch (error) {

        res.status(500).json({
            message: "Error fetching contacts",
            error: error.message
        });
    }
});


// GET /contacts/:id
// Get contact by MongoDB ID
app.get("/contacts/:id", async (req, res) => {
    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json({
            contact: contact
        });

    } catch (error) {

        res.status(400).json({
            message: "Invalid contact ID",
            error: error.message
        });
    }
});


// PUT /contacts/:id
// Update contact
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

        res.status(400).json({
            message: "Error updating contact",
            error: error.message
        });
    }
});


// DELETE /contacts/:id
// Delete contact
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


// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});