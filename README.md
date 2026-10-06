# Contact Management System

A Contact Management System built using Node.js, Express.js, MongoDB and Mongoose.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Nodemon
- Thunder Client

## Features

- Create a new contact
- View all contacts
- View a contact by ID
- Update contact details
- Delete a contact
- Phone number validation
- Email validation
- Required field validation
- Unique contact ID
- Unique email

## Contact Fields

| Field | Type | Validation |
|---|---|---|
| contactId | String | Required, Unique |
| name | String | Required |
| phone | String | Required, 10 digits |
| email | String | Required, Valid format, Unique |

## Project Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL