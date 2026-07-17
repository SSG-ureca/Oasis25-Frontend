import { NavLink } from "react-router-dom";
import { Panel } from "./Panel";
import { neumophismVariants } from "../../types/neumophismVariants";
import { cn } from "../../utils/cn";
const NAV_ITEMS = [
  { to: "/", label: "홈(대시보드)" },
  { to: "/retrospect", label: "회고" },
  { to: "/stats", label: "통계" },
  { to: "/mypage", label: "마이페이지" },
];

const Header = () => {
  return (
    <header className="flex justify-between items-center  py-10">
      <img src="/logo.png" alt="logo" className="flex-1 flex justify-start" />
      <Panel
        variant="neumorphism"
        inset
        className="px-5 py-2.5 flex gap-5 rounded-4xl">
        {NAV_ITEMS.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "rounded-4xl neumorphism-size-sm  border border-transparent transition-all duration-300 select-none ",
                  !isActive && "neumorphism-hover",
                  isActive && neumophismVariants({ variant: "neumorphism" }),
                )
              }>
              {item.label}
            </NavLink>
          );
        })}
      </Panel>
      <div className="flex-1 flex justify-end gap-5">
        <button>라이트</button>
        <button>명언</button>
        <button>마이페이지</button>
      </div>
    </header>
  );
};

export default Header;
