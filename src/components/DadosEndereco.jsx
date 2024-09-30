import React, { useState } from "react";

const DadosEndereco = () => {
    const [dadosCEP, setDadosCEP] = useState(""); 
    const [dadosEndereco, setDadosEndereco] = useState("");
    const [dadosNumero, setDadosNumero] = useState("");
    const [dadosBairro, setDadosBairro] = useState("");
    const [dadosCidade, setDadosCidade] = useState("");
    const [dadosEstado, setDadosEstado] = useState("");    
    
    const Estado = () => {
        return [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
            "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
            "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];
    };

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

    return (
        <div className="dados-container">
            {/* Primeira linha: CEP com botão de busca */}
            <div className="form-group">
                <label htmlFor="dadosCEP">CEP: </label>
                <input className="input-medio" type="text" name="dadosCEP" value={dadosCEP} onChange={(e) => setDadosCEP(e.target.value)} />
                <button className="" type="submit" onClick={buscarCEP}>Buscar</button>
            </div>

            {/* Segunda linha: Endereço e Número */}
            <div className="form-group">
                <label htmlFor="dadosEndereco">Endereço: </label>
                <input className="input-grande" type="text" name="dadosEndereco" value={dadosEndereco} onChange={(e) => setDadosEndereco(e.target.value)} />
                <label htmlFor="dadosNumero">Número: </label>
                <input className="input-pequeno" type="text" name="dadosNumero" value={dadosNumero} onChange={(e) => setDadosNumero(e.target.value)} />
            </div>
            {/* Terceira linha: Bairro */}
            <div className="form-group">
                <label htmlFor="dadosBairro">Bairro: </label>
                <input className="input-grande" type="text" name="dadosBairro" value={dadosBairro} onChange={(e) => setDadosBairro(e.target.value)} />
            </div>
            {/* Quarta linha: Cidade e Estado */}
            <div className="form-group">
                <label htmlFor="dadosCidade">Cidade: </label>
                <input className="input-grande" type="text" name="dadosCidade" value={dadosCidade} onChange={(e) => setDadosCidade(e.target.value)} />
                <label htmlFor="dadosEstado">Estado: </label>
                <select className="input-pequeno" name="dadosEstado" value={dadosEstado} onChange={(e) => setDadosEstado(e.target.value)}>
                    <option>-- selecione o estado --</option>
                    {Estado().map((estado, index) => (
                        <option key={index} value={estado}>
                            {estado}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DadosEndereco;
