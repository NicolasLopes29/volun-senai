import React, { useState } from "react";

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

    return (
        <>
            <div>
                <h1>Informações Pessoais</h1>
                <div >
                    <form onSubmit={setUserData} >
                        <div>
                            <label htmlFor="nome">Nome: </label>    
                            <input type="text" value={userData.nome} onChange={setUserData} disabled={disable}/>    
                            <label htmlFor="sobrenome">Sobrenome: </label>
                            <input type="text" value={userData.sobrenome} onChange={setUserData} disabled={disable}/>   
                        </div>
                        <div>
                            <label htmlFor="cpf">CPF: </label>
                            <input type="text" value={userData.cpf} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="dataNasc">Data de Nascimento: </label>
                            <input type="date" value={userData.dataNasc} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="ddd">DDD: </label>
                            <input type="text" value={userData.ddd} onChange={setUserData} disabled={disable}/>
                            <label htmlFor="telefone">Telefone: </label>
                            <input type="text" value={userData.telefone} onChange={setUserData} disabled={disable}/>
                        </div>
                        <div> 
                            <label htmlFor="email">Email: </label>
                            <input type="email" value={userData.email} onChange={setUserData} disabled={disable}/>
                        </div>
                    </form>
                    <form onSubmit={setUserLocalizacao}> 
                        <div>
                            <label htmlFor="endereco">Endereço: </label>
                            <input type="text" value={userLocalizacao.endereco} onChange={setUserLocalizacao} disabled={disable}/>
                            <label htmlFor="numero">Numero: </label>
                            <input type="text" value={userLocalizacao.numero} onChange={setUserLocalizacao} disabled={disable}/>
                        </div>
                        <div>
                            <label htmlFor="cep">CEP: </label>
                            <input type="text" value={userLocalizacao.cep} onChange={setUserLocalizacao} disabled={disable}/>
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
                    </form>
                </div>
            </div>
        </>
    );
}

export default InformacaoPessoal