import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import anime from "./routes/anime";

const app = express();
const port = 6969;

app.use(cors());
app.use(bodyParser.json());

app.use('/', anime);

app.listen(port, () => {
    console.log(`Server is running at port ${port} 🗣️🗣️🗣️`);
})