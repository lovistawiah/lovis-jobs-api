require('dotenv').config();
require('express-async-errors');
//extra security
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const limiter = require("express-rate-limit")

const express = require('express');
const app = express();

const authRoute = require("./routes/auth")
const jobsRoute = require("./routes/jobs")
const connect = require("./db/connect")
const authenticatedUser = require("./middleware/authentication")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.set("trust proxy", 1)
app.use(limiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json());
// extra packages
app.use(helmet())
app.use(cors())
// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs', authenticatedUser, jobsRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
