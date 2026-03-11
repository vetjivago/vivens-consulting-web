import { Outlet } from "react-router-dom";

export const AvaLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      <Outlet />
    </div>
  );
};
