import { NavLink } from "react-router-dom";

import { Panel } from "./Panel";
import { neumophismVariants } from "../../types/neumophismVariants";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { Sun, User } from "lucide-react";
const NAV_ITEMS = [
  { to: "/", label: "홈" },
  { to: "/retrospect", label: "회고" },
  { to: "/stats", label: "통계" },
  { to: "/mypage", label: "마이페이지" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center py-5 bg-bg-light/80 backdrop-blur-md px-4">
      <div className="flex-1 flex justify-start">
        <img src="/OASIS25.png" alt="logo" />
      </div>
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
        <Button variant="neumorphism" className="rounded-full w-12 h-12 p-0">
          <Sun className="w-6 h-6 text-[#718096]" />
        </Button>
        <Button variant="neumorphism" className="rounded-full w-12 h-12 p-0">
          명언
        </Button>
        <Button
          variant="neumorphism"
          className="rounded-full w-12 h-12 p-0 overflow-hidden relative group">
          <User
            className="w-10 h-10 text-[#6c757d] fill-[#6c757d]"
            strokeWidth={0}
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
