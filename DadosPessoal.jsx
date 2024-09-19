import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase-config"; // Import Firebase auth
import "./../css/DadosPessoal.css";

const DadosPessoal = () => {
    const [dadosNome, setDadosNome] = useState("");
    const [dadosSobrenome, setDadosSobrenome] = useState("");
    const [dadosCPF, setDadosCPF] = useState("");
    const [dadosdata_nascimento, setDadosdata_nascimento] = useState("");
    const [dadosDDD, setDadosDDD] = useState("");
    const [dadosTelefone, setDadosTelefone] = useState("");
    const [uid, setUid] = useState(null);
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Obtém o UID do usuário autenticado
        const user = auth.currentUser;
        if (user) {
            setUid(user.uid);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const ValidarCPF = () => {
        try {
            const cpf = dadosCPF.replace(/\D/g, ''); // Remove non-numeric characters
        
            if (cpf.length !== 11) {
                alert("CPF inválido, o CPF válido contém 11 dígitos.");
            } else {
                if (verificarCPF(cpf)) {
                    alert("CPF válido");
                } else {
                    alert("CPF inválido");
                }
            }
        } catch (error) {
            alert(error);
        }
    }
    
    const verificarCPF = (cpf) => {
        let soma = 0;
        let rev1, rev2;
    
        // Remove non-numeric characters
        cpf = cpf.replace(/[^\d]+/g, '');	
        if (cpf === '') return false;
        
        // Invalid CPF sequences
        if (
            cpf.length !== 11 ||
            /^(.)\1+$/.test(cpf) // checks if all characters are the same
        ) {
            alert("CPF inválido");
        }
    
        // First validation digit
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
    
        rev1 = 11 - (soma % 11);
        if (rev1 === 10 || rev1 === 11) rev1 = 0;
    
        if (rev1 !== parseInt(cpf.charAt(9))) {
            return false;
        }
    
        // Reset sum for the second validation digit
        soma = 0;
    
        // Second validation digit
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
    
        rev2 = 11 - (soma % 11);
        if (rev2 === 10 || rev2 === 11) rev2 = 0;
    
        if (rev2 !== parseInt(cpf.charAt(10))) {
            return false;
        }
    
        return true;
    }

    const EnviarDados = async (e) => {
        e.preventDefault();
        
        if (!dadosNome || !dadosSobrenome || !dadosCPF || !dadosdata_nascimento || !dadosDDD || !dadosTelefone) {
            setErro(true);
            return;
        }
        
        setErro(false);

        try {
            // Envia os dados do usuário para a API e cria o documento com o UID do usuário no Firestore
            const response = await axios.post(`https://volun-api-eight.vercel.app/usuarios/${uid}/info`, {
                nome: dadosNome,
                sobrenome: dadosSobrenome,
                cpf: dadosCPF,
                data_nascimento: dadosdata_nascimento,
                ddd: dadosDDD,
                telefone: dadosTelefone
            });
n
            if (response.status === 201) {
                ValidarCPF(cpf);
                setSucesso(true);
                navigate("/"); // Redireciona para a página inicial
            }
        } catch (error) {
            console.error("Erro ao enviar dados: ", error);
            setErro(true);
        }
    };

    return (
        <div className="dados-container">
            <div className="dados-pessoal-container">
                <h4>Insira os dados pessoais</h4>
                <div>
                    <label htmlFor="dadosNome">Nome: </label>
                    <input className="dados-input" type="text" name="dadosNome" value={dadosNome} onChange={(e) => setDadosNome(e.target.value)} />
                    
                    <label htmlFor="dadosSobrenome">Sobrenome: </label>
                    <input className="dados-input" type="text" name="dadosSobrenome" value={dadosSobrenome} onChange={(e) => setDadosSobrenome(e.target.value)} />
                </div>
                
                <div>
                    <label htmlFor="dadosCPF">CPF: </label>
                    <input className="dados-input-medio" type="text" name="dadosCPF" value={dadosCPF} onChange={(e) => setDadosCPF(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="dadosdata_nascimento">Data de Nascimento: </label>
                    <input className="dados-input-medio" type="date" name="dadosdata_nascimento" value={dadosdata_nascimento} onChange={(e) => setDadosdata_nascimento(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="dadosDDD">DDD: </label>
                    <input className="dados-input-pequeno" type="text" name="dadosDDD" value={dadosDDD} onChange={(e) => setDadosDDD(e.target.value)} />
                    
                    <label htmlFor="dadosTelefone">Telefone: </label>
                    <input className="dados-input" type="text" name="dadosTelefone" value={dadosTelefone} onChange={(e) => setDadosTelefone(e.target.value)} />
                </div>

                <div>
                    <button type="submit" onClick={EnviarDados}>Finalizar Cadastro</button>
                </div>

                {erro && <p className="erro-mensagem">Preencha todos os campos corretamente.</p>}
                {sucesso && <p className="sucesso-mensagem">Usuário cadastrado com sucesso!</p>}
            </div>
        </div>
    );
};

export default DadosPessoal;
