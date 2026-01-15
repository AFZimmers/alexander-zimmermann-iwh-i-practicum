require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Pug as the templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HubSpot API configuration
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || 'pets'; // Change this to your custom object type

// Helper function to make HubSpot API calls
const hubspotRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `https://api.hubapi.com${endpoint}`,
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('HubSpot API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Route: Homepage - Display all custom object records
app.get('/', async (req, res) => {
  try {
    // Get all custom object records with all properties
    // IMPORTANT: Update the properties array below to match your custom object's property names
    // One property must be called "name" (or "Name" - HubSpot typically uses lowercase internally)
    const endpoint = `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const params = {
      properties: ['name', 'movie', 'actor'], // Movie Characters properties
      limit: 100
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await hubspotRequest('GET', `${endpoint}?${queryString}`);
    
    const records = response.results || [];
    
    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      records: records,
      customObjectType: CUSTOM_OBJECT_TYPE
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      records: [],
      error: 'Failed to load records. Please check your API key and custom object type.',
      customObjectType: CUSTOM_OBJECT_TYPE
    });
  }
});

// Route: Display form to create/update custom object
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Route: Handle form submission to create new custom object record
app.post('/update-cobj', async (req, res) => {
  try {
    const formData = req.body;
    
    // Prepare the data for HubSpot API
    const properties = {};
    
    // Map form fields to custom properties
    // IMPORTANT: Adjust these property names to match your custom object properties
    // One property must be called "name" (or "Name" - HubSpot typically uses lowercase internally)
    if (formData.name) properties.name = formData.name;
    if (formData.movie) properties.movie = formData.movie;
    if (formData.actor) properties.actor = formData.actor;
    
    const endpoint = `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const payload = {
      properties: properties
    };

    await hubspotRequest('POST', endpoint, payload);
    
    // Redirect to homepage after successful creation
    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error);
    res.render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      error: 'Failed to create record. Please check your form data and try again.'
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Make sure to set HUBSPOT_API_KEY and CUSTOM_OBJECT_TYPE in your .env file`);
});

