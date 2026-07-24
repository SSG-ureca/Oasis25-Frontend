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

    fetchQuote();
  }, []);

  return (
    <Panel
      variant="clayFlat"
      className="
                w-full
                rounded-2xl flex flex-col
            ">
      <p className="text-gray-10 text-lg leading-relaxed text-center italic">
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
