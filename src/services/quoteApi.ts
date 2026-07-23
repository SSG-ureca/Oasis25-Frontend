import axios from "axios";
import type { Quote } from "../types/quote";

const QUOTE_API = "https://korean-advice-open-api.vercel.app/api/advice";

interface QuoteResponse {
    author: string;
    authorProfile: string;
    message: string;
}

export const getRandomQuote = async (): Promise<Quote> => {
    const { data } = await axios.get<QuoteResponse>(QUOTE_API);

    return {
        author: data.author,
        message: data.message,
    };
};
