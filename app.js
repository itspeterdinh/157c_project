const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const businessRouter = require('./routes/businessRoutes');

const app = express();
app.enable('trust proxy');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/businesses', businessRouter);

module.exports = app;
