import chalk from "chalk";
import { AnimeModel } from "./model";

export const InsertAnime = async (data: object) => {
    try {
        console.log("Saving data to the database...");
        const anime = await new AnimeModel(data)
            .save();

        console.log("Saved to the database");
    
        return anime.toObject();
    }
    catch (error) {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to insert data to database"));
        throw error;
    }
}

export const GetAnimeById = async (id: number) => {
	// try catch
	// find one
	// return the data
}
