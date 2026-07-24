import { Loading } from "../components/splash/Loading";
import { Logo } from "../components/splash/Logo";
import { QuoteCard } from "../components/splash/QuoteCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Tumbleweeds } from "../components/common/Tumbleweeds";

export const SplashPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/main");
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <main className="relative flex h-screen w-screen flex-col items-center justify-center bg-bg-light overflow-hidden animate-in fade-in duration-300">
            <Tumbleweeds />
            <div className="z-10 flex flex-col items-center justify-center gap-10">
                <Logo />
                <QuoteCard />
                <Loading />
            </div>
        </main>
    );
};
