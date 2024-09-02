import React, { useState } from "react";
import Modal from "react-modal";
import Recuperacao from "./Recuperacao";
import Cadastrar from "./Cadastrar";

import "./../css/Login.css";

const estiloModal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      inset: 'auto',
      position: 'relative',
      top: 0,
      borderRadius: 32,
      textAlign: 'center',
      backgroundColor: '#FBFBFE',
      width: 600,
    }
};

const Login = ({ fecharLogin }) => {
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
                style={estiloModal}
            >
                <Recuperacao fecharRecup={() => setRecupAbrir(false)} />
            </Modal>
            <Modal
                isOpen={CadastrarAbrir}
                onRequestClose={() => setCadastrarAbrir(false)}
                style={estiloModal}
            >
                <Cadastrar fecharCadastrar={() => setCadastrarAbrir(false)}/>
            </Modal>
        </>        
    );
}

export default Login;