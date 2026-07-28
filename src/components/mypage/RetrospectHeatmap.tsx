import { Panel } from "../common/Panel";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../mypage/RetrospectHeatmap.css";
import { Button } from "../common/Button";
import { useEffect, useRef, useState } from "react";
import { getHeatmap } from "../../services/heatmapApi";
import { getProfile } from "../../services/profileApi";

interface HeatmapValue {
    date: string;
    count: number;
}

export const RetrospectHeatmap = () => {
    const [year, setYear] = useState<number | null>(null);
    const [years, setYears] = useState<number[]>([]);
    const [dataByYear, setDataByYear] = useState<
        Record<number, HeatmapValue[]>
    >({});
    const [values, setValues] = useState<HeatmapValue[]>([]);
    const [loading, setLoading] = useState(true);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const heatmapRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);

    // 히트맵 크기 자동 조절
    useEffect(() => {
        const resize = () => {
            if (!wrapperRef.current || !heatmapRef.current) return;

            const wrapperWidth = wrapperRef.current.offsetWidth;

            // 실제 히트맵의 원본 너비
            const heatmapWidth = heatmapRef.current.scrollWidth;

            const nextScale = Math.min(1, wrapperWidth / heatmapWidth);

            setScale(nextScale);
        };

        resize();

        const observer = new ResizeObserver(resize);

        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }

        window.addEventListener("resize", resize);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
        };
    }, []);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const profile = await getProfile();
                const data = await getHeatmap(profile.email);

                const transformed: Record<number, HeatmapValue[]> = {};
                const yearList: number[] = [];

                Object.entries(data).forEach(([key, items]) => {
                    const y = Number(key);

                    yearList.push(y);

                    transformed[y] = items.map((item) => ({
                        date: item.date,
                        count: item.focusMinutes,
                    }));
                });

                yearList.sort((a, b) => a - b);

                const latestYear = yearList[yearList.length - 1];

                setYears(yearList);
                setDataByYear(transformed);

                if (latestYear) {
                    setYear(latestYear);
                    setValues(transformed[latestYear]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchHeatmap();
    }, []);

    const handleYearClick = (selectedYear: number) => {
        setYear(selectedYear);
        setValues(dataByYear[selectedYear]);
    };

    return (
        <div
            className="
                flex
                flex-col
                880:flex-row
                gap-3
                h-full
                min-h-0
            "
        >
            <Panel
                variant="clay"
                inset
                className="
                    flex-1
                    min-h-[180px]
                    880:min-h-0

                    p-2

                    flex
                    items-center
                    justify-center
                "
            >
                {loading ? (
                    <div className="text-center text-text-muted text-sm">
                        데이터를 불러오는 중입니다...
                    </div>
                ) : year ? (
                    <div
                        ref={wrapperRef}
                        className="
                            w-full
                            h-full

                            overflow-hidden

                            flex
                            items-center
                            justify-center
                        "
                    >
                        <div
                            ref={heatmapRef}
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: "center center",
                                transition: "transform .2s ease",
                            }}
                        >
                            <CalendarHeatmap
                                startDate={new Date(`${year}-01-01`)}
                                endDate={new Date(`${year}-12-31`)}
                                values={values}
                                showMonthLabels={false}
                                classForValue={(value) => {
                                    if (!value || !value.count) {
                                        return "color-empty";
                                    }

                                    if (value.count < 30) {
                                        return "color-level-1";
                                    }

                                    if (value.count < 60) {
                                        return "color-level-2";
                                    }

                                    if (value.count < 120) {
                                        return "color-level-3";
                                    }

                                    return "color-level-4";
                                }}
                                titleForValue={(value) => {
                                    if (!value) return "기록 없음";

                                    return `${value.date}\n집중 시간: ${value.count}분`;
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-text-muted text-sm">
                        기록된 데이터가 없습니다.
                    </div>
                )}
            </Panel>

            <div
                className="
                    flex
                    flex-row
                    880:flex-col

                    gap-2

                    overflow-x-auto
                    scrollbar-hide

                    shrink-0

                    pb-1
                "
            >
                {years.map((y) => (
                    <Button
                        key={y}
                        variant="clay"
                        className={`
                            px-3
                            py-1.5
                            text-sm

                            880:px-4
                            880:py-2
                            880:text-base

                            whitespace-nowrap
                            880:w-full

                            ${
                                year === y
                                    ? "bg-emerald-200 text-emerald-800 font-bold"
                                    : ""
                            }
                        `}
                        onClick={() => handleYearClick(y)}
                    >
                        {y}
                    </Button>
                ))}
            </div>
        </div>
    );
};
