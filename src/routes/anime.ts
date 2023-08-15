import { Router, Request, Response } from "express";
import { getAnime, getAnimeById, getAnimeFullById } from "../helpers/fetchAnime";

const router = Router();
const _RATE_DELAY: number = 800;

router.get('/anime', async (req: Request, res: Response) => {
    const mal_ids: any = req.query.mal_id;

    if (mal_ids) {
        const datas: any[] = [];
        console.log("GET anime data from api.jikan.moe...");

        for (let id of mal_ids) {
            await new Promise(resolve => setTimeout(resolve, _RATE_DELAY));
            console.log(`GET anime id: ${id}`);

            try {
                const data = await getAnimeById(id);
                datas.push(data.data);
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status != 429)
                        return res.sendStatus(400);
                }
            }
        }

        if (datas.length < 1) {
            return res.status(404).json({
                error: res.statusMessage,
                status: res.statusCode,
                data: datas
            });
        }

        console.log("GET anime complete");
        if (datas.includes(null)) {
            console.log("But there's a null object");
        }
        
        return res.status(200).json(datas);
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