const express = require('express');
const db = require('../db/db');
const router = require('../router/user');
const task = require('../router/task')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/user',router)
app.use('/task',task)
console.log(process.env.JWT_SECRET,'hello world')
app.listen(PORT,()=> console.log('port connected',PORT))