const mongoose = require("mongoose");
const app = require("./app");

const { MONGODB_HOST, PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_HOST)
  .then(() => {
    app.listen(PORT, () => {
        console.log("Database connection successful");
        console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
