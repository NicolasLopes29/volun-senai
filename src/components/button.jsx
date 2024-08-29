import React from "react";

const Button = ({ className }) => {
  return (
    <button 
      className={`${className} text-white w-[180px] h-[45px] px-5 py-2 rounded-full transition-all ease-in duration-300	hover:scale-101`}
    >
      Entrar
    </button>
  );
};

export default Button;
