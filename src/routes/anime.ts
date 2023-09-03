import { Router, Request, Response } from "express";
import { getAnime, getAnimeById, getAnimeFullById } from "../helpers/fetchAnime";
import { InsertAnime, GetAnimeIdByIds, GetAnimeByIds } from "../db";
import { BatConsole } from "../consoles";
import chalk from "chalk";

const router = Router();
const _RATE_DELAY: number = 800;

router.get('/anime', async (req: Request, res: Response) => {
    const mal_ids: any = req.query.mal_id;
    const req_id: number = Math.floor((Math.random() * 8000) + 1000);
    const batconsole = new BatConsole(req_id);

    if (mal_ids) {
        batconsole.log("GET anime ids:", mal_ids);
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
            // filter which is still not stored in the database
            const fetchthat = [...mal_ids].filter(mal_id => !findedId.includes(parseFloat(mal_id)));

            // remove duplicates, make this id a unique number
            const fetchunique = Array.from(new Set(fetchthat));

            if (fetchunique.length > 0) {
                batconsole.log(chalk.yellow(`There are ${fetchunique.length} anime need to add`));
                batconsole.log("Data required:", fetchunique);
                batconsole.log("GET anime data from api.jikan.moe...");

                for (let id of fetchunique) {
                    await new Promise(resolve => setTimeout(resolve, _RATE_DELAY));
    
                    batconsole.log('GET ' + chalk.cyan('https://api.jikan.moe/v4/anime/' + id) + '...');
    
                    const { data } = await getAnimeById(id);
                    await InsertAnime(data);
    
                    batconsole.log(chalk.yellow(`GET id: ${id}. Complete`));
                }

                batconsole.log(chalk.green(`GET anime data from jikan API complete`));
            }
            else {
                batconsole.log("GET anime from database...");
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

            batconsole.log("GET anime complete");
            
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
