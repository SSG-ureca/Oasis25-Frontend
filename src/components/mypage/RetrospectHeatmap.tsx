// 잔디 심기(오아시스 만들기)
import { Panel } from "../common/Panel";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../mypage/RetrospectHeatmap.css";

export const Grass = () => {
    const values = [
        {
            date: "2026-07-21",
            count: 1,
        },
        {
            date: "2026-07-20",
            count: 1,
        },
        {
            date: "2026-07-18",
            count: 1,
        },
    ];

    return (
        <div
            className="
                flex
                gap-4
                
                "
        >
            <Panel
                variant="neumorphism"
                inset
                className="
                    flex
                    flex-[9]
                    p-2
                    min-h-0
                    justify-center
                    items-center
                    
                "
            >
                <CalendarHeatmap
                    startDate={new Date("2026-01-01")}
                    endDate={new Date("2026-12-31")}
                    values={values}
                    showMonthLabels={false}
                />
            </Panel>

            <Panel
                variant="glassNeumorphism"
                className="
                    flex-[1]
                    p-2
                    min-h-0
                "
            ></Panel>
        </div>
    );
};
