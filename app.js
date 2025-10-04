const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const pool = require("./db"); // PostgreSQL connection pool
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



// Routes
const customerProfilesRoutes = require("./routes/customerProfiles");
const authRoutes = require("./routes/auth");
const airportRoutes = require("./routes/airports");
const routesRouter = require("./routes/routes");
const aircraftRoutes = require("./routes/aircraft");
const flightsRouter = require("./routes/flights");
const { router: flightinstancesRouter, shiftExpiredFlights } = require("./routes/flightinstances");
const flightSeatsRoutes = require("./routes/flightseats");
const bookingsRoutes = require("./routes/bookings");
const paymentsRoutes = require("./routes/payments");
const refundsRoutes = require("./routes/refunds");




// Register routes
app.use("/customers", customerProfilesRoutes);
app.use("/auth", authRoutes);
app.use("/airports", airportRoutes);
app.use("/routes", routesRouter);

app.use("/aircraft", aircraftRoutes);
app.use("/flights", flightsRouter);
app.use("/flightinstances", flightinstancesRouter);
app.use("/flightseats", flightSeatsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/payments", paymentsRoutes);
app.use("/refunds", refundsRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("🚀 Flight Reservation API is running!");
});

// Cron job runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🌙 Midnight reached - shifting expired flights by +3 days...");
  try {
    await shiftExpiredFlights();
  } catch (err) {
    console.error("❌ Cron job failed:", err);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
