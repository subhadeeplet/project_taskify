require("dotenv").config();

const { validateEnv } = require("./src/configs/env");
const app = require("./src/app");
const connectDb = require("./src/configs/db");

validateEnv();

const port = Number(process.env.PORT || 3000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

connectDb();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port} (${process.env.NODE_ENV || "development"})`);
});
