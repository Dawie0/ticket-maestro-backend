const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})


// OAuth credentials
const client_id = process.env.TICKETMASTER_CLIENT_ID;
const client_secret = process.env.TICKETMASTER_CLIENT_SECRET;

// Redirect URL for OAuth callback
const redirect_uri = "http://localhost:5000/oauth/callback"; // Update with your actual callback URL

// Store user's access token (in-memory, for demonstration purposes)
let userAccessToken = null;

// Redirect user to Ticketmaster's authorization page
app.get("/oauth/login", (req, res) => {
  const authUrl = `https://app.ticketmaster.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`;
  res.redirect(authUrl);
});

// Handle OAuth callback
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  // Exchange authorization code for an access token
  try {
    const response = await axios.post(
      "https://app.ticketmaster.com/oauth/token",
      `client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`
    );
    userAccessToken = response.data.access_token;
    res.send("OAuth successful! You can close this window.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during OAuth.");
  }
});

// Protected API route using OAuth
app.get("/api/protected", async (req, res) => {
  if (!userAccessToken) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  try {
    const response = await axios.get(
      "https://app.ticketmaster.com/protected-api-endpoint",
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});



// Search Events
app.get("/api/search-events", async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: process.env.TICKETMASTER_CONSUMER_KEY,
          ...req.query,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get Event Details
app.get("/api/event-details/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`,
      {
        params: {
          apikey: process.env.TICKETMASTER_CONSUMER_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Add routes for other API calls (list venues, get venue details, list performer details, get performer details)...
// List Venues
app.get("/api/list-venues", async (req, res) => {
    try {
      const response = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/venues.json",
        {
          params: {
            apikey: process.env.TICKETMASTER_CONSUMER_KEY,
            ...req.query,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // Get Venue Details
  app.get("/api/venue-details/:venueId", async (req, res) => {
    try {
      const { venueId } = req.params;
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/venues/${venueId}.json`,
        {
          params: {
            apikey: process.env.TICKETMASTER_CONSUMER_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // List Performer Details
  app.get("/api/list-performers", async (req, res) => {
    try {
      const response = await axios.get(
        "https://app.ticketmaster.com/discovery/v2/attractions.json",
        {
          params: {
            apikey: process.env.TICKETMASTER_CONSUMER_KEY,
            ...req.query,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // Get Performer Details
  app.get("/api/performer-details/:performerId", async (req, res) => {
    try {
      const { performerId } = req.params;
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/attractions/${performerId}.json`,
        {
          params: {
            apikey: process.env.TICKETMASTER_CONSUMER_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});