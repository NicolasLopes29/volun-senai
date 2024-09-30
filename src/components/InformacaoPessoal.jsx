import React, { useState } from "react";

import "./../css/InformacaoPessoal.css"

const Estado = () => {
    return [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
        "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
};

const InformacaoPessoal = () => {
    const [disable, setDisable] = useState(true);
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        dataNasc: "",
        ddd: "",
        telefone: "",
        email: "",
    });
    const [userLocalizacao, setUserLocalizacao] = useState({
        endereco: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
    });

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = dadosCEP.replace(/\D/g, '');
        if (cep.length >= 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setDadosCEP(data.cep);
                    setDadosEndereco(data.logradouro);
                    setDadosBairro(data.bairro);
                    setDadosCidade(data.localidade);
                    setDadosEstado(data.uf);
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        } else {
            alert("CEP inválido.");
        }
    };

    const handleUpdateUser = () => {
        setDisable(false)
    }

    return (
        <>
            <div className="info-pessoal-container">
                <h1>Informações Pessoais</h1>
                <div className="info-pessoal-form-container">
                    <form className="formUsuario" onSubmit={setUserData} >
                        <h3>Dados Pessoais: </h3>
                        <div>
                            <label htmlFor="nome">Nome: </label>    
                            <input className="input-pessoal-nome" type="text" value={userData.nome} onChange={setUserData} disabled={disable}/>    
                            <label htmlFor="sobrenome">Sobrenome: </label>
                            <input className="input-pessoal-nome" type="text" value={userData.sobrenome} onChange={setUserData} disabled={disable}/>   
                        </div>
                        <div>
                            <label htmlFor="cpf">CPF: </label>
                            <input type="text" value={userData.cpf} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="dataNasc">Data de Nascimento: </label>
                            <input type="date" value={userData.dataNasc} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div >
                            <label htmlFor="ddd">DDD: </label>
                            <input className="input-pessoal-ddd" type="text" value={userData.ddd} onChange={setUserData} disabled={disable}/>
                            <label htmlFor="telefone">Telefone: </label>
                            <input type="text" value={userData.telefone} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div> 
                            <label htmlFor="email">Email: </label>
                            <input className="input-pessoal-email" type="email" value={userData.email} onChange={setUserData} disabled={disable}/>
                        </div>
                    </form>
                    <form className="formLocalizacao" onSubmit={setUserLocalizacao}>
                        <h3>Dados de Endereço: </h3>
                        <div>
                            <label htmlFor="endereco">Endereço: </label>
                            <input className="info-local-endereco" type="text" value={userLocalizacao.endereco} onChange={setUserLocalizacao} disabled={disable}/>
                            <label htmlFor="numero">Numero: </label>
                            <input className="info-local-numero" type="text" value={userLocalizacao.numero} onChange={setUserLocalizacao} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="cep">CEP: </label>
                            <input type="text" value={userLocalizacao.cep} onChange={setUserLocalizacao} disabled={disable}/>
                            <button className="buscar-cep-button" type="submit" onClick={buscarCEP} disabled={disable}>Buscar</button>
                        </div>
                        <div>
                            <label htmlFor="bairro">Bairro: </label>
                            <input type="text" value={userLocalizacao.bairro} onChange={setUserLocalizacao} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="cidade">Cidade: </label>
                            <input type="text" value={userLocalizacao.cidade} onChange={setUserLocalizacao} disabled={disable}/>
                            <label htmlFor="estado">Estado: </label>
                            <select name="estado" value={userLocalizacao.estado} onChange={setUserLocalizacao} disabled={disable}>
                                <option>-- selecione o estado --</option>
                                {Estado().map((estado, index) => (
                                    <option key={index} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {}
                    </form>    
                </div>
                <div className="form-button-container">
                    <button onClick={handleUpdateUser}>Editar Dados</button>
                </div>
            </div>
        </>
    );
}

export default InformacaoPessoal