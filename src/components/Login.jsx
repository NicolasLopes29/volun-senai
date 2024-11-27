import React, { useState } from "react";
import Modal from "react-modal";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { app } from "../services/firebase-config";
import Recuperacao from "./Recuperacao";
import { useNavigate } from "react-router";

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

const Login = ({ fecharLogin }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [RecupAbrir, setRecupAbrir] = useState(false);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Verifica se existe o usuário no MongoDB
      const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`);
      const userData = await response.json();

      if (!response.ok || !userData) {
        throw new Error("Usuário não encontrado no MongoDB");
      }

      // Se o campo photoUrl estiver ausente ou nulo, atualiza com a foto do Firebase
      if (!userData.photoUrl) {
        await fetch(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoUrl: user.photoURL }),
        });
      }

      // Redirecionamento conforme o estado do usuário
      if (!userData._id) {
        navigate("/dados_pessoal");
      } else {
        fecharLogin();
        navigate("/");
      }
    } catch (error) {
      setError("Erro ao logar: " + error.message);
    }
  };

  // Função para logar com Google
  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await updateProfile(user, { photoURL: user.photoURL });
      const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`);
      const userData = await response.json();

      if (!response.ok || !userData) {
        throw new Error("Usuário não encontrado no MongoDB");
      }

      // Se o campo photoUrl estiver ausente ou nulo, atualiza com a foto do Firebase
      if (!userData.photoUrl) {
        await fetch(`https://volun-api-eight.vercel.app/usuarios/${user.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoUrl: user.photoURL }),
        });
      }

      if (!userData._id) {
        navigate("/dados_pessoal");
      } else {
        fecharLogin();
        navigate("/");
      }
    } catch (error) {
      setError("Erro ao logar com Google: " + error.message);
      navigate("/dados_pessoal");
    }
  };


  const CadastrarRedir = () => {
    navigate("/cadastrar")
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
                <div className="login-paragraph">
                  <p>Ainda não possui uma conta?</p>
                  <button type="button" onClick={CadastrarRedir}>Crie uma conta</button>
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
    </>
  );
};

export default Login;
