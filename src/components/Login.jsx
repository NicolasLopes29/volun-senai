import React, { useState } from "react";

import "./../css/Login.css";

const Login = ({fecharLogin}) => {

    const SubmitForm = (e) => {
        e.preventDefault();
        
        console.log("Form submitted");
    }

    return (
        <>
            <div className="login-body-container">
                <div className="login-header-container">
                    <button className="login-botao-fechar" onClick = {fecharLogin}>X</button>
                </div>
                <div className="login-main-container">
                    <main>
                        <form className="login-main-form" action="./index.js" onSubmit={SubmitForm}>
                            <input id="login-email" type="email" placeholder="Digite o e-mail" />
                            <input id="login-senha" type="password" placeholder="Digite a senha" />
                            <button type="submit">Entrar</button>
                            <a href="./Recuperar.jsx">Esqueci a senha</a>
                            <div className="others-login">
                                <div className="login-other">
                                    <a href="#">
                                        <img src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png"
                                            className="icon-log"/>
                                        <p>Entrar com Google</p>
                                    </a>
                                </div>
                                <div className="login-other">
                                    <a href="#">
                                        <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" className="icon-log"/>
                                        <p>Entrar com Facebook</p>
                                    </a>
                                </div>
                                <div className="login-paragraph">
                                    <p>Ainda não possui uma conta? <a href={"Cadastrar"}>Crie uma conta</a></p>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>        
    );
}

export default Login;