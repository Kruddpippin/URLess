const express = require('express');
const bodyParser = require('body-parser');
const CONFIG = require('./config/config');

//routes
const URLRouter = require('./routes/URL');

const connectToDb = require('./db/mongodb');

const app = express();

// Connect to MongoDB database
connectToDb();

// Add middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/URL', URLRouter);
app.use('/api/v1/URL/:id', URLRouter);

app.get('/', (req, res) => {
    res.send('Hello URLess');
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    res.status(errorStatus).send(err.message);

    next();
});

app.listen(CONFIG.PORT, () => {
    console.log('Server is running on http://localhost:' + CONFIG.PORT);
});
