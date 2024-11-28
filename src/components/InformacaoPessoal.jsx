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

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        const uid = user.uid;

        // Atualizar os dados pessoais no estado
        const updatedUserData = {
            nome: formatarNome(userData.nome),
            sobrenome: formatarNome(userData.sobrenome),
            cpf: userData.cpf,
            data_nascimento : formatDate(userData.data_nascimento),
            ddd: formatarDDD(userData.ddd),
            telefone: formatarTelefone(userData.telefone),
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

            // Recarregar a página após salvar as alterações
            window.location.reload();
        } catch (error) {
            setError("Erro ao salvar alterações.");
            console.error("Erro ao salvar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = enderecoData.cep.replace(/\D/g,"");
        if (cep.length >= 8){
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro){
                   setEnderecoData({
                        ...enderecoData,
                        logradouro : data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                   }); 
                }
                else {
                    alert("CEP não encontrado.");
                }
            }
            catch (error){
                alert(`Erro ao buscar CEP. Tente novamente., ${error}`);
            }
        } else {
            alert("CEP inválido.");
        }
    };
    const formatarNome = (nome) =>{
        nome = nome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return nome;
    }

    const formatarSobrenome = (sobrenome) => {
        sobrenome = sobrenome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return sobrenome;
    }

    const formatarDDD = (ddd) => {
        // Remove caracteres não numéricos
        ddd = ddd.replace(/\D/g, '');
        
        // Garantir que o DDD tenha exatamente 2 dígitos
        if (ddd.length === 2) {
            return ddd; // Retorna o DDD formatado corretamente
        } else {
            setError(true); // Retorna uma string vazia se o DDD não for válido
        }
    };

    const formatarTelefone = (telefone) => {
        telefone = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
        telefone = telefone.replace(/(\d{5})(\d{4})/, "$1-$2"); // Coloca o hífen no número

        if (telefone.length != 10) {
            setError(true)
        }
        else {
            return telefone;
        } 
          
    }

    // Função para converter "dd/mm/yyyy" para "yyyy-mm-dd"
    const formatDate = (date) => {
        // Verifica se a data está no formato correto
        const [dia, mes, ano] = date.split('/').map(Number);
        // Verifica se a data é válida
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
            throw new Error("Data inválida. A data deve estar no formato dd/mm/yyyy.");
        }
        // Cria um objeto Date com ano, mês (0-indexado), e dia
        const dataConvertida = new Date(ano, mes - 1, dia);
        // Verifica se a data foi criada corretamente
        if (dataConvertida.getDate() !== dia || dataConvertida.getMonth() + 1 !== mes || dataConvertida.getFullYear() !== ano) {
            throw new Error("Data inválida.");
        }
        // Formata a data para o formato "yyyy-mm-dd"
        const dataFormatada = dataConvertida.toISOString().split('T')[0];
        return dataFormatada;
    }
    // Função para converter "yyyy-mm-dd" para "dd/mm/yyyy"
    const formatDateISO = (date) => {
        const dateObj = new Date(date);
        // Verifica se a data é válida
        if (isNaN(dateObj.getTime())) {
            throw new Error("Data inválida.");
        }
        const day = dateObj.getUTCDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        // Adiciona zero à esquerda para dia e mês, se necessário
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        return `${formattedDay}/${formattedMonth}/${year}`;
    }

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
            const formattedDate = formatDateISO(response.data.data_nascimento)
            setUserData({ ...response.data, data_nascimento: formattedDate, email: user.email });

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
                                className="input-medio-grande"
                                type="text"
                                value={userData.nome}
                                onChange={(e) => setUserData({ ...userData, nome: formatarNome(e.target.value) })}
                                disabled={disable}
                            />
                            <input
                                placeholder="Sobrenome"
                                className="input-medio-grande"
                                type="text"
                                value={userData.sobrenome}
                                onChange={(e) => setUserData({ ...userData, sobrenome: formatarSobrenome(e.target.value) })}
                                disabled={disable}
                            />
                        </div>
                        <div>
                            <input
                                className="input-medio-pequeno"
                                placeholder="CPF"
                                type="text"
                                value={userData.cpf}
                                onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
                                disabled={true}
                            />
                        </div>
                        <div>
                            <input
                                className="input-medio-pequeno"
                                placeholder="Data de Nascimento"
                                type="text"
                                value={userData.data_nascimento}
                                onChange={(e) => setUserData({ ...userData, data_nascimento: e.target.value })}
                                disabled={true} // Desabilitado para edição
                            />
                        </div>
                        <div>
                            <input
                                placeholder="DDD"
                                className="input-pequeno"
                                type="text"
                                value={userData.ddd}
                                onChange={(e) => setUserData({ ...userData, ddd: formatarDDD(e.target.value) })}
                                disabled={disable}
                            />
                            <input
                                className="input-medio-pequeno"
                                placeholder="Telefone"
                                type="text"
                                value={userData.telefone}
                                onChange={(e) => setUserData({ ...userData, telefone: formatarTelefone(e.target.value) })}
                                disabled={disable}
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Email"
                                className="input-grande"
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
                                className="input-medio-pequeno"
                                placeholder="CEP"
                                type="text"
                                value={enderecoData.cep}
                                onChange={(e) => setEnderecoData({ ...enderecoData, cep: e.target.value })}
                                disabled={disable}
                            />
                            <button type="button" onClick={buscarCEP} disabled={disable}>Buscar</button>
                        </div>
                        <div>
                            <input
                                placeholder="Endereço"
                                className="input-grande"
                                type="text"
                                value={enderecoData.logradouro}
                                onChange={(e) => setEnderecoData({ ...enderecoData, logradouro: e.target.value })}
                                disabled={true}
                            />
                            <input
                                placeholder="Número"
                                className="input-pequeno"
                                type="text"
                                value={enderecoData.numero}
                                onChange={(e) => setEnderecoData({ ...enderecoData, numero: e.target.value })}
                                disabled={disable}
                            />
                        </div>
                        <div>
                            <input
                                className="input-medio-grande"
                                placeholder="Bairro"
                                type="text"
                                value={enderecoData.bairro}
                                onChange={(e) => setEnderecoData({ ...enderecoData, bairro: e.target.value })}
                                disabled={true}
                            />

                        </div>
                        <div>
                            <input
                                className="input-medio-grande"
                                placeholder="Cidade"
                                type="text"
                                value={enderecoData.cidade}
                                onChange={(e) => setEnderecoData({ ...enderecoData, cidade: e.target.value })}
                                disabled={true}
                            />
                            <select
                                className="input-select"
                                value={enderecoData.estado}
                                onChange={(e) => setEnderecoData({ ...enderecoData, estado: e.target.value })}
                                disabled={true}
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