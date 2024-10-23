import React from "react";
import "./../css/Loader.css";

const Loader = () => {
    return (
        <>
            <div className="loader-container">
                <p>Carregando</p>
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
};

export default Loader;
