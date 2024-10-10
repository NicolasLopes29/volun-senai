import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import "./../css/InformacaoPessoal.css";

const InformacaoPessoal = () => {
    const [disable, setDisable] = useState(true);
    const [gerarBotao, setGerarBotao] = useState(false);
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        data_nascimento: "",
        ddd: "",
        telefone: "",
        email: "",
    });

    const [enderecoData, setEnderecoData] = useState({
        id: "",
        logradouro: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero: "",
    });

    const [erro, setError] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleEditarUser = () => {
        setDisable(false);
        setGerarBotao(true);
    };

    const handleCancelarEdicao = () => {
        setDisable(true);
        setGerarBotao(false);
    };

    const handleSalvarAlteracoes = async () => {
        setLoading(true);
        setError(false);
        setSucesso(false);
        
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        const uid = user.uid;

        // Atualizar os dados pessoais no estado
        const updatedUserData = {
            nome: userData.nome,
            sobrenome: userData.sobrenome,
            cpf: userData.cpf,
            ddd: userData.ddd,
            telefone: userData.telefone,
        };

        // Atualizar os dados de endereço no estado
        const updatedEnderecoData = {
            logradouro: enderecoData.logradouro,
            cep: enderecoData.cep,
            bairro: enderecoData.bairro,
            cidade: enderecoData.cidade,
            estado: enderecoData.estado,
            numero: enderecoData.numero,
        };

        try {
            // Atualizar os dados pessoais do usuário
            await axios.put(`https://volun-api-eight.vercel.app/usuarios/${uid}`, updatedUserData);

            // Atualizar os dados de endereço se um ID existir
            if (enderecoData.id) {
                await axios.put(`https://volun-api-eight.vercel.app/endereco/${enderecoData.id}`, updatedEnderecoData);
            }

            setSucesso("Dados atualizados com sucesso.");
            setDisable(true);
            setGerarBotao(false);
        } catch (error) {
            setError("Erro ao salvar alterações.");
            console.error("Erro ao salvar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            console.error("Nenhum usuário está logado.");
            return;
        }

        const uid = user.uid;
        setLoading(true);

        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData({ ...response.data, email: user.email });

            const enderecoResponse = await axios.get(`https://volun-api-eight.vercel.app/endereco/usuario/${uid}`);
            if (enderecoResponse.data && enderecoResponse.data.length > 0) {
                const endereco = enderecoResponse.data[0];
                setEnderecoData({
                    id: endereco._id,
                    logradouro: endereco.logradouro || "",
                    cep: endereco.cep || "",
                    bairro: endereco.bairro || "",
                    cidade: endereco.cidade || "",
                    estado: endereco.estado || "",
                    numero: endereco.numero || "",
                });
            } else {
                setEnderecoData({ id: "", logradouro: "", cep: "", bairro: "", cidade: "", estado: "", numero: "" });
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            setError("Erro ao buscar dados do usuário.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFormUser();
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
                                value={userData.data_nascimento}
                                onChange={(e) => setUserData({ ...userData, data_nascimento: e.target.value })}
                                disabled={true} // Desabilitado para edição
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
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                disabled={true} // Desabilitado para edição
                            />
                        </div>
                    </form>

                    <form className="formLocalizacao" onSubmit={(e) => e.preventDefault()}>
                        <h3>Dados de Endereço: </h3>
                        <div>
                            <input
                                placeholder="Endereço"
                                className="info-local-endereco"
                                type="text"
                                value={enderecoData.logradouro}
                                onChange={(e) => setEnderecoData({ ...enderecoData, logradouro: e.target.value })}
                                disabled={disable}
                            />
                            <input
                                placeholder="Número"
                                className="info-local-numero"
                                type="text"
                                value={enderecoData.numero}
                                onChange={(e) => setEnderecoData({ ...enderecoData, numero: e.target.value })}
                                disabled={disable}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="CEP"
                                type="text"
                                value={enderecoData.cep}
                                onChange={(e) => setEnderecoData({ ...enderecoData, cep: e.target.value })}
                                disabled={disable}
                            />
                            <input
                                placeholder="Bairro"
                                type="text"
                                value={enderecoData.bairro}
                                onChange={(e) => setEnderecoData({ ...enderecoData, bairro: e.target.value })}
                                disabled={disable}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Cidade"
                                type="text"
                                value={enderecoData.cidade}
                                onChange={(e) => setEnderecoData({ ...enderecoData, cidade: e.target.value })}
                                disabled={disable}
                            />
                            <select
                                value={enderecoData.estado}
                                onChange={(e) => setEnderecoData({ ...enderecoData, estado: e.target.value })}
                                disabled={disable}
                            >
                                <option value="">Selecione o Estado</option>
                                {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
                <div className="form-button-container">
                    {gerarBotao ? (
                        <div>
                            <button className="botao-salvar" onClick={handleSalvarAlteracoes}>
                                Salvar Alterações
                            </button>
                            <button className="botao-cancelar" onClick={handleCancelarEdicao}>
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button className="botao-editar" onClick={handleEditarUser}>
                            Editar Dados
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default InformacaoPessoal;
