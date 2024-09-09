import React, { useState } from "react";
import Modal from "react-modal";
import Recuperacao from "./Recuperacao";
import Cadastrar from "./Cadastrar";

import "./../css/Login.css";

const estiloModalSecundaria = {
    overlay: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: -50,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        margin: 'auto',
    },
    content: {
        top: 20,
        right: 40,
        bottom: 20,
        left: 40,
        borderRadius: 32,
        position: 'relative',
        textAlign: 'center',
        backgroundColor: '#FBFBFE',
        width: 500,
    }
};

const Login = ({ fecharLogin, setLoginAbrir }) => {
    const [RecupAbrir, setRecupAbrir] = useState(false);
    const [CadastrarAbrir, setCadastrarAbrir] = useState(false);

    const SubmitForm = (e) => {
        e.preventDefault();
        
        console.log("Form submitted");
    }

    return (
        <>
            <div className="login-body-container">
                <div className="login-header-container">
                    <button className="login-botao-fechar" onClick={fecharLogin}>X</button>
                </div>
                <div className="login-main-container">
                    <main>
                        <form className="login-main-form" action="./index.js" onSubmit={SubmitForm}>
                            <input id="login-email" type="email" placeholder="Digite o e-mail" />
                            <input id="login-senha" type="password" placeholder="Digite a senha" />
                            <button type="submit">Entrar</button>
                            <button type="button" onClick={() => setRecupAbrir(true)}>Esqueci a senha</button>
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
                                    <p>Ainda não possui uma conta?</p>
                                    <button type="button" onClick={() => setCadastrarAbrir(true)}>Crie uma conta</button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
            <Modal
                isOpen={RecupAbrir}
                onRequestClose={() => setRecupAbrir(false)}
                style={estiloModalSecundaria}
                onAfterOpen={() => setLoginAbrir(false)}
            >
                <Recuperacao fecharRecup={() => setRecupAbrir(false)} />
            </Modal>
            <Modal
                isOpen={CadastrarAbrir}
                onRequestClose={() => setCadastrarAbrir(false)}
                style={estiloModalSecundaria}
            >
                <Cadastrar fecharCadastrar={() => setCadastrarAbrir(false)}/>
            </Modal>
        </>        
    );
}

export default Login;