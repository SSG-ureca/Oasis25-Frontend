import { Panel } from "../common/Panel";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../mypage/RetrospectHeatmap.css";
import { Button } from "../common/Button";
import { useState } from "react";
import { getHeatmap } from "../../services/heatmapApi";

interface HeatmapValue {
    date: string;
    count: number;
}

export const RetrospectHeatmap = () => {
    const [year, setYear] = useState<number | null>(null);

    const [values, setValues] = useState<HeatmapValue[]>([]);

    //연도 전달 버튼
    const handleYearChange = async () => {
        try {
            const data = await getHeatmap(2026);

            setValues(
                data.map((item) => ({
                    date: item.date,
                    count: item.focusMinutes,
                })),
            );

            setYear(2026);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex gap-4">
            <Panel
                variant="neumorphism"
                inset
                className="flex-[9] p-2 min-h-0 justify-center items-center"
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

                        const minutes = value.count;

                        if (minutes < 30) {
                            return "color-level-1";
                        }

                        if (minutes < 60) {
                            return "color-level-2";
                        }

                        if (minutes < 120) {
                            return "color-level-3";
                        }

                        return "color-level-4";
                    }}
                />
            </Panel>

            <Button
                variant="clay"
                className="flex-[1] p-2 min-h-0"
                onClick={handleYearChange}
            >
                2026
            </Button>
        </div>
    );
};
