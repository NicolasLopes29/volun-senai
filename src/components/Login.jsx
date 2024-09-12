import React, { useState } from "react";
import Modal from "react-modal";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../services/firebase-config"; 
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
  },
};

const Login = ({ fecharLogin, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [RecupAbrir, setRecupAbrir] = useState(false);
  const [CadastrarAbrir, setCadastrarAbrir] = useState(false);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Função para logar com email e senha
  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário logado:", user);
        onLoginSuccess(); // Chamamos a função de sucesso ao logar
        fecharLogin(); // Fechar modal após login
      })
      .catch((error) => {
        setError("Erro ao logar: " + error.message);
      });
  };

  // Função para logar com Google
  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Logado com Google:", user);
        onLoginSuccess(); // Chamamos a função de sucesso ao logar
        fecharLogin(); // Fechar modal após login
      })
      .catch((error) => {
        setError("Erro ao logar com Google: " + error.message);
      });
  };

  return (
    <>
      <div className="login-body-container">
        <div className="login-header-container">
          <button className="login-botao-fechar" onClick={fecharLogin}></button>
        </div>
        <div className="login-main-container">
          <main>
            <form className="login-main-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Digite o e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Digite a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button type="submit">Entrar</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="button" onClick={() => setRecupAbrir(true)}>Esqueci a senha</button>
              <div className="others-login">
                <div className="login-other" onClick={handleLoginWithGoogle}>
                  <img src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png" className="icon-log" />
                  <p>Entrar com Google</p>
                </div>
                {/* Placeholder para login com Facebook */}
                <div className="login-other">
                  <a href="#">
                    <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" className="icon-log" />
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
      >
        <Recuperacao fecharRecup={() => setRecupAbrir(false)} />
      </Modal>
      <Modal
        isOpen={CadastrarAbrir}
        onRequestClose={() => setCadastrarAbrir(false)}
        style={estiloModalSecundaria}
      >
        <Cadastrar fecharCadastrar={() => setCadastrarAbrir(false)} />
      </Modal>
    </>
  );
};

export default Login;

