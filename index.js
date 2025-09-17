// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to handle consultation form submission
app.post("/api/book-consultation", async (req, res) => {
  const { name, phone, city, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"ACE Your Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "📩 New Consultation Booking",
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>City:</strong> ${city || "Not provided"}</p>
        <p><strong>Message:</strong> ${message || "No message"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Form submitted successfully!" });
    console.log("✅ Form data received:", req.body);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email. Try again later." });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
