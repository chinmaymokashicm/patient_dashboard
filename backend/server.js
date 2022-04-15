// https://www.youtube.com/watch?v=-0exw-9YJBo

const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

const app = express();

var cors = require("cors");
app.use(cors());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/fetch", require("./routes/mainRoute"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
