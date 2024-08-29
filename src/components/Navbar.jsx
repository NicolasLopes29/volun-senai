import { useState } from "react";
import Logo from "../assets/images/logo.svg";
import { links } from "../data";
import Button from "./button";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <nav className="flex w-full items-center md:justify-around justify-between p-3 bg-blue-900 text-white">
        <img src={Logo} className="" />
        <ul className="md:flex hidden gap-10 md:flex-row">
          {links.map((link) => (
            <li
              key={link.id}
              className="cursor-pointer hover:text-orange-500 transition ease-in duration-300"
            >
              {link.title}
            </li>
          ))}
        </ul>
        <Button className="md:block hidden" />
        <button className="block md:hidden text-[28px]" onClick={toggleMenu}>
          {menuOpen ? <IoCloseSharp /> : <IoMdMenu />}
        </button>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 flex justify-center h-screen w-screen backdrop-blur-sm mt-[48px]">
          <div className="bg-white h-[250px] w-[340px] max-w-md flex items-center justify-center rounded-r-lg shadow-md mt-[48px]">
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="cursor-pointer hover:text-orange-500 transition ease-in duration-50"
                >
                  {link.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;