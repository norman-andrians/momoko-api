import { Router, Request, Response } from "express";
import { getAnime, getAnimeById, getAnimeFullById } from "../helpers/fetchAnime";
import { InsertAnime, GetAnimeIdByIds, GetAnimeByIds } from "../db";
import chalk from "chalk";

const router = Router();
const _RATE_DELAY: number = 800;

router.get('/anime', async (req: Request, res: Response) => {
    const mal_ids: any = req.query.mal_id;

    if (mal_ids) {
        /*
         * Here's the algorithm
         * first retrieve the data from the database based on the request
         * since the individual values in the data from the database are objects,
           just take the core value, then make it the first variable
         * filter the requested ids to eliminate data that is already available in
           the database, making the array the ids needed to retrieve the data to the API
         * the goal is to reduce repetitive requests and prevent duplication of data
           and entities.
        */
        try {
            // find anime data by id
            // inside the database
            const finded = await GetAnimeIdByIds(mal_ids);

            // then just get the mal id instead mongo id object
            const findedId = [...finded].map(item => item.mal_id);

            // now find if there are missing anime items
            // prevent duplication of entities
            const fetchthat = [...mal_ids].filter(mal_id => !findedId.includes(parseFloat(mal_id)));

            if (fetchthat.length > 0) {
                console.log(chalk.yellow(`There are ${fetchthat.length} anime need to add`));
                console.log("Data requested:", mal_ids);
                console.log("Data required:", findedId);
                console.log("GET anime data from api.jikan.moe...");

                for (let id of fetchthat) {
                    await new Promise(resolve => setTimeout(resolve, _RATE_DELAY));
    
                    console.log(`GET anime id: ` + chalk.yellow(id));
                    console.log('GET ' + chalk.cyan('https://api.jikan.moe/v4/anime/' + id));
    
                    const { data } = await getAnimeById(id);
                    await InsertAnime(data);
    
                    console.log(chalk.yellow(`GET id: ${id}. Complete`));
                }
            }

            const data = await GetAnimeByIds(mal_ids);

            if (data.length < 1) {
                return res.status(404).json({
                    error: res.statusMessage,
                    status: res.statusCode,
                    data: []
                });
            }

            if (data.includes(null)) {
                console.log("But there's a null object");
            }

            console.log(chalk.green(`GET anime data from jikan API complete`));
            console.log("Waiting for next request");
            
            return res.status(200).json(data);
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != 429)
                    return res.sendStatus(429);
            }
            console.error(chalk.red(error));
            return res.sendStatus(400);
        }
    }

    try {
        const anime = await getAnime();

        res.status(200).json({
            status: "OK",
            data: anime.data
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.get("/anime/:id", async (req: Request, res: Response) => {
    try {
        const id = parseFloat(req.params.id);

        if (!id) {
            return res.status(400).json({
                error: res.statusMessage,
                status: res.statusCode
            });
        }

        const data = await getAnimeFullById(id);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
})

export default router;
