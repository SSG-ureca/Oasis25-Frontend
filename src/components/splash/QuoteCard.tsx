import { useEffect, useState } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { getRandomQuote } from "../../services/quoteApi";
import type { Quote } from "../../types/quote";
import { Panel } from "../common/Panel";

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

        const interval = setInterval(
            () => {
                fetchQuote();
            },
            30 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <Panel
            variant="clayFlat"
            className="w-full rounded-2xl flex flex-col items-center justify-center py-4 px-6 relative overflow-hidden"
        >
            <QuoteIcon className="absolute top-2 left-4 w-6 h-6 text-primary/10 -scale-x-100" />
            <div className="relative z-10 flex flex-col items-center gap-1.5 w-full mt-2">
                <p className="text-[13px] md:text-sm font-medium leading-relaxed text-center text-text italic">
                    {quote ? `"${quote.message}"` : "Loading..."}
                </p>
                {quote && quote.author && (
                    <span className="text-xs text-text-muted font-normal tracking-wide">
                        - {quote.author} -
                    </span>
                )}
            </div>
            <QuoteIcon className="absolute bottom-2 right-4 w-6 h-6 text-primary/10" />
        </Panel>
    );
};
