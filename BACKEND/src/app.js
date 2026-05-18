const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  const railwayOrigin = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  if (!frontendOrigins.includes(railwayOrigin)) {
    frontendOrigins.push(railwayOrigin);
  }
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

const shouldServeFrontend =
  process.env.SERVE_FRONTEND === "true" || process.env.NODE_ENV === "production";

if (shouldServeFrontend) {
  const frontendDist = path.resolve(__dirname, "../../FRONTEND/dist/public");
  const fs = require("fs");

  if (!fs.existsSync(path.join(frontendDist, "index.html"))) {
    console.error("Frontend build missing at:", frontendDist);
  }

  app.use(express.static(frontendDist, { maxAge: "1d", index: false }));

  app.get(/^(?!\/api).*/, (_req, res, next) => {
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
