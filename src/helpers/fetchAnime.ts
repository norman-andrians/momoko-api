import axios from "axios";
import chalk from "chalk";

export const getAnime = async (): Promise<any> => {
    try {
        const data = await axios.get("https://api.jikan.moe/v4/anime");
        return data.data;
    }
    catch (error) {
        console.error(error);
    }
}

export const getAnimeById = async (id: number): Promise<any> => {
    try {
        const data = await axios.get("https://api.jikan.moe/v4/anime/" + id);
        return data.data;
    }
    catch (error) {
        if (error.response) {
            if (error.response.status == 429) {
                console.log(chalk.red("GET anime error: too many request"));
            }
            console.log(chalk.red("GET anime error status: " + error.response.status));
        }
        throw error;
    }
}

export const getAnimeFullById = async (id: number): Promise<any> => {
    try {
        const data = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
        return data.data;
    }
    catch (error) {
        console.error(error);
    }
}