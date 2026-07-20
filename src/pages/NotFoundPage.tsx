import { useNavigate } from "react-router-dom";

import { Button } from "../components/common/Button";
import { Panel } from "../components/common/Panel";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="flex h-full items-center justify-center">
            <Panel
                variant="neumorphism"
                className="
          flex
          w-full
          max-w-lg
          flex-col
          items-center
          gap-4
          p-8
          text-center
        "
            >
                <div className="text-5xl">🚫</div>

                <h1 className="text-4xl font-bold tracking-wide">404</h1>

                <h2 className="text-xl font-semibold">
                    페이지를 찾을 수 없습니다.
                </h2>

                <p className="text-sm text-gray-500">
                    요청하신 페이지가 존재하지 않거나
                    <br />
                    삭제되었을 수 있습니다.
                </p>

                <Button onClick={handleGoHome} className="mt-2 w-full">
                    홈으로 이동
                </Button>
            </Panel>
        </div>
    );
}
