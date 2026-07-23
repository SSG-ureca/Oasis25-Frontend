import { Loading } from "../components/splash/Loading";
import { Logo } from "../components/splash/Logo";
import { QuoteCard } from "../components/splash/QuoteCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SplashPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/main");
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-bg-light animate-in fade-in duration-300">
            <Logo />
            <QuoteCard />
            <Loading />
        </main>
    );
};
