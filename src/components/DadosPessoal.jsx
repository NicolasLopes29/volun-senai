import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./../css/DadosPessoal.css";

const DadosPessoal = () => {
    const [dadosNome, setDadosNome] = useState("");
    const [dadosSobrenome, setDadosSobrenome] = useState("");
    const [dadosCPF, setDadosCPF] = useState("");
    const [dadosDataNasc, setDadosDataNasc] = useState("");
    const [dadosDDD, setDadosDDD] = useState("");
    const [dadosTelefone, setDadosTelefone] = useState("");

    const navigate = useNavigate();

    const EnviarDados = async (e) => {
        e.preventDefault();
        if (!dadosNome || !dadosSobrenome || !dadosCPF || !dadosDataNasc || !dadosDDD || !dadosTelefone) {
            try {
                const response = await axios.post("https:\\volun-api-eight.vercel.app/usuario", {
                    nome : dadosNome,
                    sobrenome : dadosSobrenome,
                    cpf : dadosCPF,
                    dataNasc : dadosDataNasc,
                    ddd : dadosDDD,
                    telefone : dadosTelefone
                });
                
                if (response.status === 201) {
                    setSucesso(true);
                    setErro(false);
                    // Optionally, reset the form or close the modal
                    navigate("/dados_endereco");
                }
            }
            catch (error){
                setSucesso(true);
                setErro(false);
            }
        }
        else {
            setErro(true);
            setSucesso(false);
        }
    }

    return(
        <>
            <div className="dados-container">
                <div className="dados-pessoal-container">
                    <h4>Insira os dados pessoais</h4>
                    <div>
                        <label htmlFor="dadosNome">Nome: </label>
                        <input className="dados-input" type="text" name="dadosNome" value={dadosNome} onChange={(e) => setDadosNome(e.target.value)} />
                        <label htmlFor="dadosSobrenome">Sobrenome: </label>
                        <input className="dados-input" type="text" name="dadosSobrenome" value={dadosSobrenome} onChange={(e) => setDadosSobrenome(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosCPF">CPF: </label>
                        <input className="dados-input-medio" type="text" name="dadosCPF" value={dadosCPF} onChange={(e) => setDadosCPF(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosDataNasc">Data de Nascimento: </label>
                        <input className="dados-input-medio" type="date" name="dadosDataNasc" value={dadosDataNasc} onChange={(e) => setDadosDataNasc(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosDDD">DDD: </label>
                        <input className="dados-input-pequeno" type="text" name="dadosDDD" value={dadosDDD} onChange={(e) => setDadosDDD(e.target.value)}/>
                        <label htmlFor="dadosTelefone">Telefone: </label>
                        <input className="dados-input" type="text" name="dadosTelefone" value={dadosTelefone} onChange={(e) => setDadosTelefone(e.target.value)}/>
                    </div>
                </div>
                <div>
                    <button type="submit" onClick={EnviarDados}>Cadastrar</button>    
                </div>
            </div>
        </>
    );    
}

export default DadosPessoal;