require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("Received inquiry:", req.body);

    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name,
          email,
          phone,
          message
        }
      ])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({
        error: error.message
      });
    }

    console.log("Saved successfully!");

    res.status(201).json({
      message: "Inquiry saved successfully!",
      data
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      error: "Server error"
    });
  }
});

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("SERVER LISTEN ERROR:", error);
});