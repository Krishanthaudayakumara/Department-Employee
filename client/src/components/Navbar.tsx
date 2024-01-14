import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import MobileSidebar from "./MobileSidebar";
import { BrowserRouter } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center">
        <MobileSidebar />
      <div className="flex w-full justify-end"></div>
    </div>
  );
};

export default Navbar;
