import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';

import anime from "./routes/anime";
import chalk from 'chalk';

const app = express();
const port = 6969;

app.use(cors());
app.use(bodyParser.json());

app.use('/', anime);

const MONGO_URI = "mongodb://localhost:27017";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .on('error', (error: Error) => {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to connect the MongoDB"));
    })
    .once('open', () => {
        console.log("MongoDB Connected");
    });

app.listen(port, () => {
    console.log(`Server is running at port ${port} 🗣️🗣️🗣️`);

    axios.get("https://api.jikan.moe/").then(data => {
        console.log("jikan api heartbeat is " + (data.data.myanimelist_heartbeat.status === 'HEALTHY' && chalk.green("HEALTHY")) );
    })
})