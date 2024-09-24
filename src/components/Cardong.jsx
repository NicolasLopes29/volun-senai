import React, { useState } from "react";
import "./../css/Cardong.css";
import Logo from "../assets/images/logonua.svg";
import Fundo from "../assets/images/fundobonito.png";
import axios from 'axios';

const [data, setData] = useState({
  nomeOrg: '',
  razaoSocial: '',
  endereco: '',
  cnpj: '',
  telefone: '',
  ddd: ''
});

const valueInput = (e) => setData({...data, [e.target.name]: e.target.value});

const addOng = async (e) => {

  e.preventDefault();

  const headers = {
    'headers': {
      'Content-Type': 'application/json'
    }
  };

  await axios.post()

}

const Cardong = () => {
    return (
      <>
        <div className="cardong">
          <div className="cardong-left">
                  <form className="cardong-form" onSubmit={addOng}>
                      <img src={Logo} className="cardong-form-logo"/>
                      <p>Crie já um perfil para a sua organização e anuncie seus projetos na Volun</p>
                      <input type="text" name="nomeOrg" placeholder="Nome da ONG" onChange={valueInput}/>
                      <input type="text" name="razaoSocial" placeholder="Razão social" onChange={valueInput}/>
                      <input type="text" name="endereco" placeholder="Endereço" onChange={valueInput}/>
                      <input type="text" name="cnpj" placeholder="CNPJ" onChange={valueInput}/>
                      <input type="text" name="telefone" placeholder="Telefone" onChange={valueInput}/>
                      <input type="text" name="ddd" placeholder="DDD" onChange={valueInput}/>
                      <button type="submit">Cadastrar</button>
                  </form>
              </div>
              <div className="cardong-right">
                
              </div>
            </div>
      </>
    );
  }

export default Cardong;