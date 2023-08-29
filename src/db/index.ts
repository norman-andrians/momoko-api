import chalk from "chalk";
import { AnimeModel } from "./model";

export const InsertAnime = async (data: object) => {
    try {
        const anime = await new AnimeModel(data)
            .save();
    
        return anime.toObject();
    }
    catch (error) {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to insert data"));
        throw error;
    }
}

export const GetAnimeById = async (id: number) => {
	// try catch
	// find one
	// return the data
}
