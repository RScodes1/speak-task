const express = require('express');
const { connection } = require('./config/db');
const { taskRouter } = require('./routes/task.routes');
require('dotenv').config();

const port = process.env.PORT;
 const app = express();

app.use(express.json({limit : '10mb'}));

 app.get('/', async(req, res) => {
     res.send("hello");
 })
app.use(taskRouter);


app.listen(port, async() => {
      try {
        await connection
        console.log("hi this is mongodb");
        console.log(`The server is running on port http://localhost:${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
})