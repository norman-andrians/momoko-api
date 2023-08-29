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

const MONGO_URI = "mongodb://localhost:27017/momoko";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .on('error', (error: Error) => {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to connect the MongoDB"));
    })
    .once('open', () => {
        console.log("MongoDB Connected");
        console.log("Listening to the database on the server");
    });

const testJikan = async () => {
    console.log("Connecting Jikan API...");
    try {
        const { data } = await axios.get("https://api.jikan.moe/");
        console.log("jikan api heartbeat is " + (data.myanimelist_heartbeat.status === 'HEALTHY' ? chalk.green("HEALTHY") : chalk.yellow("data.myanimelist_heartbeat.status") ));
    }
    catch (error) {
        console.error(chalk.red(error));
        console.error(chalk.red("Something went wrong while fetching data from the API"));
    }
}

app.listen(port, () => {
    console.log(`Server is running at port ${port} 🗣️🗣️🗣️`);
    testJikan();
})