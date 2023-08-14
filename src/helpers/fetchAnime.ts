import axios from "axios";

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
        console.error(error);
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