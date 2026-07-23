import { useEffect, useState } from "react";
import { getRandomQuote } from "../../services/quoteApi";
import type { Quote } from "../../types/quote";

export const QuoteCard = () => {
    const [quote, setQuote] = useState<Quote | null>(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const data = await getRandomQuote();
                setQuote(data);
            } catch (error) {
                console.error(error);

                setQuote({
                    author: "",
                    message: "",
                });
            }
        };

        fetchQuote();
    }, []);

    return (
        <div
            className="
                w-full
                max-w-md
                rounded-2xl
                bg-bg-light
                shadow-glass-neumorphism
                px-8
                py-6
            "
        >
            <p className="text-gray-10 text-lg leading-relaxed text-center italic">
                {quote ? `"${quote.message}"` : "Loading..."}
            </p>
            <p className="text-gray-10 text-lg leading-relaxed text-center italic">
                {quote ? `"${quote.author}"` : "Loading..."}
            </p>
        </div>
    );
};
