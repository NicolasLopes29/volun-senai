import React, { useState } from "react";
import "./../css/Cardong.css";
import Logo from "../assets/images/logonua.svg";
import axios from 'axios';

const Cardong = () => {
  const [data, setData] = useState({
    nomeOrg: '',
    razaoSocial: '',
    endereco: '',
    cnpj: '',
    ddd: '',
    telefone: ''
  });
  
  const [message, setMessage] = useState('');

  const valueInput = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    return true;
  };

  const validateTelefone = (telefone) => {
    telefone = telefone.replace(/[^\d]+/g, '');
    return telefone.length >= 8 && telefone.length <= 9;
  };

  const validateDDD = (ddd) => {
    ddd = ddd.replace(/[^\d]+/g, '');
    return ddd.length === 2;
  };

  const addOng = async (e) => {
    e.preventDefault();

    if (!validateCNPJ(data.cnpj)) {
      alert("CNPJ inválido. Deve conter 14 dígitos.");
      return;
    }
    
    if (!validateDDD(data.ddd)) {
      alert("DDD inválido. Deve conter 2 dígitos.");
      return;
    }

    if (!validateTelefone(data.telefone)) {
      alert("Telefone inválido. Deve ter entre 8 e 9 dígitos.");
      return;
    }

    try {
      const response = await axios.post('https://volun-api-eight.vercel.app/organizacao', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.mensagem);

      
      setData({
        nomeOrg: '',
        razaoSocial: '',
        endereco: '',
        cnpj: '',
        ddd: '',
        telefone: ''
      });

      alert("Organização cadastrada com sucesso! ;)")
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.mensagem);
      } else {
        alert("O cadastro não ocorreu como o esperado, tente novamente mais tarde :/");
      }
    }
  }

  return (
    <>
      <div className="cardong">
        <div className="cardong-left">
          <form className="cardong-form" onSubmit={addOng}>
            <img src={Logo} className="cardong-form-logo" alt="Logo" />
            <p>Crie já um perfil para a sua organização e anuncie seus projetos na Volun</p>
            <input type="text" name="nomeOrg" placeholder="Nome da ONG" onChange={valueInput} value={data.nomeOrg} />
            <input type="text" name="razaoSocial" placeholder="Razão social" onChange={valueInput} value={data.razaoSocial} />
            <input type="text" name="endereco" placeholder="Endereço" onChange={valueInput} value={data.endereco} />
            <input type="text" name="cnpj" placeholder="CNPJ" onChange={valueInput} value={data.cnpj} />
            <div className="telefone-container">
              <input type="text" id="ddd-ong" name="ddd" placeholder="DDD" onChange={valueInput} value={data.ddd} />
              <input type="text" id="telefone-ong" name="telefone" placeholder="Telefone" onChange={valueInput} value={data.telefone} />
            </div>
            <button type="submit">Cadastrar</button>
          </form>
          {message && <p className="message">{message}</p>} 
        </div>
        <div className="cardong-right">
          
        </div>
      </div>
    </>
  );
}

export default Cardong;