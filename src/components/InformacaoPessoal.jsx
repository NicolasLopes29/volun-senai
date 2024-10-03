import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import "./../css/InformacaoPessoal.css";

const Estados = () => {
    return [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
        "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
};

const InformacaoPessoal = () => {
    const [disable, setDisable] = useState(true);
    const [gerarBotao, setGerarBotao] = useState(false)
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        dataNasc: "", // Inicialização como string vazia
        ddd: "",
        telefone: "",
        email: "",
        enderecoid: "",
    });
    const [userLocalizacao, setUserLocalizacao] = useState({
        id: "",
        logradouro: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",

    });

    const [erro, setError] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleEditarUser = () => {
        setDisable(false);
        setGerarBotao(true);
    };

    const handleFormUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }
        
        const email = user.email || "";

        setLoading(true);

        try {
            const uid = user.uid
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData({ ...response.data, email: email, enderecoid: userData.enderecoid});

            await handleFormLocal(userData.enderecoid);

        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            setError("Erro ao buscar dados do usuário.");
        } finally {
            setLoading(false);
        }
    };

    const handleFormLocal = async ( enderecoid ) => {
        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/endereco/${enderecoid}`)
            setUserLocalizacao(response.data);
        } 
        catch (error) {
            console.error("Erro ao buscar dados de endereço:", error);
            setError("Erro ao buscar dados de endereço.");
        }   
    }

    const buscarCEP = async () => {
        if (!userLocalizacao.cep) {
            setError("CEP não pode estar vazio.");
            return;
        }

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${userLocalizacao.cep}/json/`);
            if (response.data.erro) {
                setError("CEP não encontrado.");
            } else {
                setUserLocalizacao({
                    ...userLocalizacao,
                    logradouro: response.data.logradouro,
                    bairro: response.data.bairro,
                    cidade: response.data.localidade,
                    estado: response.data.uf
                });
                setSucesso(true);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setError("Erro ao buscar CEP.");
        }
    };

    useEffect(() => {
        handleFormUser();
        handleFormLocal();
    }, []);

    return (
        <>
        <div className="info-pessoal-container">
            <h1>Informações Pessoais</h1>
            {loading && <p>Carregando...</p>}
            {erro && <p className="error">{erro}</p>}
            {sucesso && <p className="success">{sucesso}</p>}
            <div className="info-pessoal-form-container">
                <form className="formUsuario" onSubmit={(e) => e.preventDefault()}>
                    <h3>Dados Pessoais: </h3>
                    <div>
                        <input
                            placeholder="Nome"
                            className="input-pessoal-nome" 
                            type="text" 
                            value={userData.nome} 
                            onChange={(e) => setUserData({ ...userData, nome: e.target.value })} 
                            disabled={disable}
                        />
                        <input
                            placeholder="Sobrenome"
                            id="sobrenome"
                            className="input-pessoal-nome" 
                            type="text" 
                            value={userData.sobrenome} 
                            onChange={(e) => setUserData({ ...userData, sobrenome: e.target.value })} 
                            disabled={disable}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="CPF"
                            type="text" 
                            value={userData.cpf} 
                            onChange={(e) => setUserData({ ...userData, cpf: e.target.value })} 
                            disabled={disable}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Data de Nascimento"
                            type="date" 
                            value={userData.dataNasc} 
                            onChange={(e) => setUserData({ ...userData, dataNasc: e.target.valueAsDate })} 
                            disabled={disable}

                        />
                    </div>
                    <div>
                        <input
                            placeholder="DDD"
                            className="input-pessoal-ddd" 
                            type="text" 
                            value={userData.ddd} 
                            onChange={(e) => setUserData({ ...userData, ddd: e.target.value })} 
                            disabled={disable}
                        />
                        <input 
                            placeholder="Telefone"
                            type="text" 
                            value={userData.telefone} 
                            onChange={(e) => setUserData({ ...userData, telefone: e.target.value })} 
                            disabled={disable}
                        />
                    </div>
                    <div> 
                        <input 
                            placeholder="Email"
                            className="input-pessoal-email" 
                            type="email" 
                            value={userData.email} 
                            onChange={(e) => setUserData({ ...userData, email: e.target.value})} 
                            disabled={disable}
                        />
                    </div>
                </form>
                
                {/* Formulário de localização - Descomentar e corrigir conforme necessário */}
                <form className="formLocalizacao" onSubmit={handleFormLocal}>
                <h3>Dados de Endereço: </h3>
                    <div>
                        <label htmlFor="endereco">Endereço: </label>
                        <input 
                            className="info-local-endereco" 
                            type="text" 
                            value={userLocalizacao.logradouro} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, logradouro: e.target.value })} 
                            disabled={disable}
                        />
                        <label htmlFor="numero">Numero: </label>
                        <input 
                            className="info-local-numero" 
                            type="text" 
                            value={userLocalizacao.numero} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, numero: e.target.value })} 
                            disabled={disable}
                        />
                    </div>
                    <div>
                        <label htmlFor="cep">CEP: </label>
                        <input 
                            type="text" 
                            value={userLocalizacao.cep} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, cep: e.target.value })} 
                            disabled={disable}
                        />
                        <button className="buscar-cep-button" type="submit" onClick={buscarCEP} disabled={disable}>Buscar</button>
                    </div>
                    <div>
                        <label htmlFor="bairro">Bairro: </label>
                        <input 
                            type="text" 
                            value={userLocalizacao.bairro} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, bairro: e.target.value })} 
                            disabled={disable}
                        />
                    </div>
                    <div>
                        <label htmlFor="cidade">Cidade: </label>
                        <input 
                            type="text" 
                            value={userLocalizacao.cidade} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, cidade: e.target.value })} 
                            disabled={disable}
                        />
                        <label htmlFor="estado">Estado: </label>
                        <select 
                            name="estado" 
                            value={userLocalizacao.estado} 
                            onChange={(e) => setUserLocalizacao({ ...userLocalizacao, estado: e.target.value })} 
                            disabled={disable}
                        >
                            <option>-- selecione o estado --</option>
                            {Estados().map((estado, index) => (
                                <option key={index} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>
                    { gerarBotao &&(
                        <div>
                            <button>Cancelar</button>
                            <button>Salvar Alterações</button>
                        </div>
                    )}
                </form>
                </div>
                <div className="form-button-container">
                    <button onClick={handleEditarUser}>Editar Dados</button>
                </div>
            </div>
        </>
    );
};

export default InformacaoPessoal;
