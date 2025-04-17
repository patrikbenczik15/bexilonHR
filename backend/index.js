import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/UserRoutes.js';

const app = express()
const port = 3000

// Middleware to parse JSON bodies
app.use(bodyParser.json(), userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
