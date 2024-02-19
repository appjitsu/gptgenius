import { SiOpenaigym } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";

const SideBarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-4">
      <SiOpenaigym className="w-10 h-10 text-primary" />
      <h1 className="text-xl font-extrabold text-primary">GPTGenius</h1>
      <ThemeToggle />
    </div>
  );
};

export default SideBarHeader;
