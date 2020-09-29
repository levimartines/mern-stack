const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const departmentController = require('./controllers/departmentController');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/app',
    {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/departments', departmentController);
//app.use('/products', departmentController);

app.listen(3000);

