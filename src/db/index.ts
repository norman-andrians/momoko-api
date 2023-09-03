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

export const GetAnimeIdByIds = async (ids: number[]) => {
    try {
        const anime = await AnimeModel.find({ mal_id: { $in: ids } }, { mal_id: 1 });
        return anime;
    }
    catch (error) {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to find data from the database"));
        throw error;
    }
}


export const GetAnimeByIds = async (ids: number[]) => {
    try {
        return await AnimeModel.find({ mal_id: { $in: ids } });
    }
    catch (error) {
        console.error(chalk.red(error));
        console.error(chalk.red("Failed to find data from the database"));
        throw error;
    }
}
