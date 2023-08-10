const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors());

const apiKey = process.env.CONSUMER_KEY



app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})


// Search Events
app.get("/api/list-events", async (req, res) => {
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/search-events/:keyword/:pageNumber", async (req, res) => {
  try {
    const { keyword, pageNumber } = req.params
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?page=${pageNumber}&size=20&apikey=${apiKey}&keyword=${keyword}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/suggest/:keyword", async (req, res) => {
  const { keyword } = req.params
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/suggest.json?&apikey=${apiKey}&keyword=${keyword}`
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