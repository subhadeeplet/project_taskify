const REQUIRED_VARS = ["MONGO_URI", "JWT_SECRET"];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("Copy BACKEND/.env.example to BACKEND/.env and fill in the values.");
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.warn("Warning: JWT_SECRET should be at least 32 characters for production.");
  }
}

module.exports = { validateEnv };
