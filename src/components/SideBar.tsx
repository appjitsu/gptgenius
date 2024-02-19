import SideBarHeader from "./SideBarHeader";
import NavLinks from "./NavLinks";
import MemberProfile from "./MemberProfile";

const SideBar = () => {
  return (
    <div className="px-6 w-80 min-h-full bg-base-300 py-12 grid grid-rows-[auto,1fr,auto]">
      <SideBarHeader />
      <NavLinks />
      <MemberProfile />
    </div>
  );
};

export default SideBar;
