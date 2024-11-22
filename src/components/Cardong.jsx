import React, { useState } from "react";
import "./../css/Cardong.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logonua.svg";
import axios from 'axios';
import { getAuth } from "firebase/auth"; // Importando o Firebase Auth
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Importando Firebase Storage

const Cardong = () => {
  const [data, setData] = useState({
    nome: '',
    razao_social: '',
    descricao: '',
    cnpj: '',
    ddd: '',
    telefone: '',
    img_logo: '' // Para armazenar a URL da imagem
  });
  
  const [message, setMessage] = useState('');
  const [imgFile, setImgFile] = useState(null); // Estado para armazenar o arquivo de imagem
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar se o formulário está sendo enviado

  const navigate = useNavigate(); // Função para redirecionamento

  const valueInput = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Captura o arquivo de imagem
    if (file) {
      setImgFile(file);
    }
  };

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

  const uploadImage = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `logo_organizacao/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Você pode acompanhar o progresso do upload aqui, se necessário
        }, 
        (error) => reject(error), 
        () => {
          // Quando o upload for concluído com sucesso, obter a URL de download
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Retorna a URL da imagem
          });
        }
      );
    });
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
      setIsSubmitting(true); // Ativar a trava no botão

      // Obter o UID do usuário logado
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Você precisa estar logado para criar uma organização.");
        setIsSubmitting(false); // Desativar a trava se o usuário não estiver logado
        return;
      }

      const criador_id = user.uid; // UID do usuário logado

      // Adicionar o criador_id ao payload
      const payload = {
        ...data,
        criador_id
      };

      // Enviar a requisição para criar a organização
      const response = await axios.post('https://volun-api-eight.vercel.app/organizacao', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.mensagem);

      // Limpar os campos do formulário
      setData({
        nome: '',
        razao_social: '',
        descricao: '',
        cnpj: '',
        ddd: '',
        telefone: ''
      });

      alert("Organização cadastrada com sucesso! ;)");

      // Redirecionar para a tela inicial após o cadastro
      navigate("/");

    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.mensagem);
      } else {
        alert("O cadastro não ocorreu como o esperado, tente novamente mais tarde :/");
      }
    } finally {
      setIsSubmitting(false); // Desativar a trava no botão após a resposta da API
    }
  };

  return (
    <div className="cardong">
      <div className="cardong-left">
        <form className="cardong-form" onSubmit={addOng}>
          <img src={Logo} className="cardong-form-logo" alt="Logo" />
          <p>Crie já um perfil para a sua organização e anuncie seus projetos na Volun</p>
          <input type="text" name="nome" placeholder="Nome da ONG" onChange={valueInput} value={data.nome} />
          <input type="text" name="razao_social" placeholder="Razão social" onChange={valueInput} value={data.razao_social} />
          <textarea name="descricao" id="descricao" placeholder="Descreva a sua organização" rows="4" onChange={valueInput} value={data.descricao}></textarea>
          <input type="text" name="cnpj" placeholder="CNPJ" onChange={valueInput} value={data.cnpj} />
          <div className="telefone-container">
            <input type="text" id="ddd-ong" name="ddd" placeholder="DDD" onChange={valueInput} value={data.ddd} />
            <input type="text" id="telefone-ong" name="telefone" placeholder="Telefone" onChange={valueInput} value={data.telefone} />
          </div>
          
          {/* Input para o logo da organização */}
          <input type="file" onChange={handleImageChange} />

          <button type="submit">Cadastrar</button>
        </form>
        {message && <p className="message">{message}</p>} 
      </div>
      <div className="cardong-right">
      </div>
    </div>
  );
};

export default Cardong;
