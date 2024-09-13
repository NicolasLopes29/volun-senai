import React from "react";

const DadosEndereco = () => {
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
        if (cep.length >= 8){
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await response.json();

                if (! data.erro) {
                    setDadosCEP(data.cep);
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
    
    return (
        <>
        <div className="dados-endereco-container">
            <div>
                <label htmlFor="dadosCEP">CEP: </label>
                <input className="dados-input-medio" type="text" name="dadosCEP" value={dadosCEP} onChange={(e) => setDadosCEP(e.target.value)}/>
                <button type="submit" onClick={buscarCEP}>Buscar</button>
            </div>
            <div>
                <label htmlFor="dadosEndereco">Endereço: </label>
                <input className="dados-input-grande" type="text" name="dadosEndereco" value={dadosEndereco} onChange={(e) => setDadosEndereco(e.target.value)}/>
                <label htmlFor="dadosNumero">Numero: </label>
                <input className="dados-input-pequeno" type="text" name="dadosNumero" value={dadosNumero} onChange={(e) => setDadosNumero(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="dadosBairro">Bairro: </label>
                <input className="dados-input" type="text" name="dadosBairro" value={dadosBairro} onChange={(e) => setDadosBairro(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="dadosCidade">Cidade: </label>
                <input className="dados-input-grande" type="text" name="dadosCidade" value={dadosCidade} onChange={(e) => setDadosCidade(e.target.value)}/>
                <label htmlFor="dadosEstado">Estado: </label>
                <select className="dados-input-pequeno" name="dadosEstado" value={dadosEstado} onChange={(e) => setDadosEstado(e.target.value)}>
                    <option>-- selecione o estado --</option>
                    {Estado().map((estado, index) => (
                        <option key={index} value={estado}>
                            {estado}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        </>
    );
}

export default DadosEndereco;