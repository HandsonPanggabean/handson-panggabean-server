require("dotenv").config();

const express = require("express");
const cors = require("cors");

const whitelist = [
  "http://localhost:3000",
  "https://handson-panggabean-projects.firebaseapp.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
    } else {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

const routers = require("./routers");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routers);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
