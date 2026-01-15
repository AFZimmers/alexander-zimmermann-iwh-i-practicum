# Integrating With HubSpot I: Foundations Practicum

This project is a Node.js application that integrates with the HubSpot API to manage custom objects.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```
   HUBSPOT_API_KEY=your_private_app_access_token_here
   CUSTOM_OBJECT_TYPE=your_custom_object_type_here
   PORT=3000
   ```
   
   **Important:** Do NOT commit your `.env` file to the repository. It is already included in `.gitignore`.

3. **Run the Application**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

## HubSpot Custom Object Setup

### Custom Object List View
https://app.hubspot.com/contacts/<test-account-id>/objects/2-56100384/views/all/list

**Note:** Replace `<test-account-id>` with your HubSpot test account ID to complete the link.

### Custom Object Configuration
- **Object Type:** `2-56100384` (Movie Characters)
- **Required Properties:**
  - At least 3 custom properties (one must be a string property called "Name")
  - Properties: `name`, `movie`, `actor`
  
  **Important:** You must update the property names in the following files to match your custom object:
  - `index.js` - Update the `properties` array in the GET route (line ~52) and the property mapping in the POST route (lines ~94-96)
  - `views/homepage.pug` - Update the table headers and data fields to match your properties
  - `views/updates.pug` - Update the form fields to match your properties
  
  *Note: HubSpot property names are typically lowercase internally (e.g., `name`), even if the display name is "Name".*

## Project Structure

```
.
├── public/
│   └── css/
│       └── style.css
├── views/
│   ├── homepage.pug
│   └── updates.pug
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Routes

- `GET /` - Homepage displaying all custom object records in a table
- `GET /update-cobj` - Form to create a new custom object record
- `POST /update-cobj` - Handles form submission to create a new record

## Requirements

- Node.js
- HubSpot Developer Test Account
- Private App with the following permissions:
  - `crm.schemas.custom` (read and write)
  - `crm.objects.custom` (read and write)
  - `crm.objects.contacts` (read and write)

## Notes

- This application uses Express.js for the server
- Axios for making HTTP requests to the HubSpot API
- Pug for templating
- The custom object must be associated with the contacts object type in HubSpot

