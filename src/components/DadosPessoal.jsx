import React, { useState } from "react";
import axios from "axios";

const DadosPessoal = () => {
    const [dadosNome, setDadosNome] = useState("");
    const [dadosSobrenome, setDadosSobrenome] = useState("");
    const [dadosCPF, setDadosCPF] = useState("");
    const [dadosDataNasc, setDadosDataNasc] = useState("");
    const [dadosDDD, setDadosDDD] = useState("");
    const [dadosTelefone, setDadosTelefone] = useState("");
    const [dadosCEP, setDadosCEP] = useState("");
    const [dadosEndereco, setDadosEndereco] = useState("");
    const [dadosNumero, setDadosNumero] = useState("");
    const [dadosBairro, setDadosBairro] = useState("");
    const [dadosCidade, setDadosCidade] = useState("");
    const [dadosEstado, setDadosEstado] = useState("");
    
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState(false);

    const Estado = () => {
        return [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
            "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
            "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];
    };

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = dadosBairro

        if (cep.length === 8){
            try {
                const response = await fetch(`viacep.com.br/ws/${cep}/json/`)
                const data = await response.json();

                if (! data.erro) {
                    setDadosEndereco(data.logradouro);
                    setDadosBairro(data.bairro);
                    setDadosCidade(data.localidade);
                    setDadosEstado(data.uf);
                }
                else {
                    alert("CEP não encontrado.");
                }
            } 
            catch (error) {
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        } 
        else {
            alert("CEP inválido.");
        }
    }

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
                        <input type="text" name="dadosNome" value={dadosNome} onChange={(e) => setDadosNome(e.target.value)} />
                        <label htmlFor="dadosSobrenome">Sobrenome: </label>
                        <input type="text" name="dadosSobrenome" value={dadosSobrenome} onChange={(e) => setDadosSobrenome(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosCPF">CPF: </label>
                        <input type="text" name="dadosCPF" value={dadosCPF} onChange={(e) => setDadosCPF(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosDataNasc">Data de Nascimento: </label>
                        <input type="date" name="dadosDataNasc" value={dadosDataNasc} onChange={(e) => setDadosDataNasc(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosDDD">DDD: </label>
                        <input type="text" name="dadosDDD" value={dadosDDD} onChange={(e) => setDadosDDD(e.target.value)}/>
                        <label htmlFor="dadosTelefone">Telefone: </label>
                        <input type="text" name="dadosTelefone" value={dadosTelefone} onChange={(e) => setDadosTelefone(e.target.value)}/>
                    </div>
                </div>
                <div className="dados-endereco-container">
                    <div>
                        <label htmlFor="dadosCEP">CEP: </label>
                        <input type="text" name="dadosCEP" value={dadosCEP} onChange={(e) => setDadosCEP(e.target.value)}/>
                        <button type="submit" onClick={buscarCEP}>Buscar</button>
                    </div>
                    <div>
                        <label htmlFor="dadosEndereco">Endereço: </label>
                        <input type="text" name="dadosEndereco" value={dadosEndereco} onChange={(e) => setDadosEndereco(e.target.value)}/>
                        <label htmlFor="dadosNumero">Numero: </label>
                        <label type="text" name="dadosNumero" value={dadosNumero} onChange={(e) => setDadosNumero(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosBairro">Bairro: </label>
                        <input type="text" name="dadosBairro" value={dadosBairro} onChange={(e) => setDadosBairro(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="dadosCidade">Cidade: </label>
                        <input type="text" name="dadosCidade" value={dadosCidade} onChange={(e) => setDadosCidade(e.target.value)}/>
                        <label htmlFor="dadosEstado">Estado: </label>
                        <select name="dadosEstado" value={dadosEstado} onChange={(e) => setDadosEstado}>
                            <option>-- selecione o estado --</option>
                            {Estado().map((estado, index) => (
                                <option key={index} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button type="submit" onClick={EnviarDados}>Cadastrar</button>
                    </div>
                </div>
            </div>
        </>
    );    
}

export default DadosPessoal;