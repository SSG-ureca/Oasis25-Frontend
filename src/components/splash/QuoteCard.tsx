import { useEffect, useState } from "react";
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

        // 최초 1회 실행
        fetchQuote();

        // 5초마다 실행
        const interval = setInterval(
            () => {
                fetchQuote();
            },
            30 * 60 * 1000,
        );

        // 컴포넌트가 사라질 때 interval 정리
        return () => clearInterval(interval);
    }, []);

    return (
        <Panel
            variant="clayFlat"
            className="
                w-full
                rounded-2xl flex flex-col
            "
        >
            <p className=" text-lg leading-relaxed text-center italic">
                {quote ? (
                    <>
                        &ldquo;{quote.message}&rdquo;
                        <br />- {quote.author} -
                    </>
                ) : (
                    "Loading..."
                )}
            </p>
        </Panel>
    );
};
