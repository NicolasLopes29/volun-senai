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

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rev1 = 11 - (soma % 11);
        if (rev1 === 10 || rev1 === 11) rev1 = 0;
        if (rev1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let rev2 = 11 - (soma % 11);
        if (rev2 === 10 || rev2 === 11) rev2 = 0;
        return rev2 === parseInt(cpf.charAt(10));
    };

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o primeiro ponto
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o segundo ponto
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o hífen
        return cpf;
    };

    const formatarTelefone = (telefone) => {
        telefone = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
        telefone = telefone.replace(/(\d{5})(\d{4})/, "$1-$2"); // Coloca o hífen no número
        return telefone;
    };

    const EnviarDados = async (e) => {
        e.preventDefault();
        setErro(false);
        setSucesso(false);

        if (!dadosNome || !dadosSobrenome || !dadosCPF || !dadosdata_nascimento || !dadosDDD || !dadosTelefone) {
            setErro(true);
            return;
        }

        if (!validarCPF(dadosCPF)) {
            alert("CPF inválido");
            return;
        }

        try {
            // Tenta enviar os dados para a API
            const response = await axios.post(`https://volun-api-eight.vercel.app/usuarios/${uid}/info`, {
                nome: dadosNome,
                sobrenome: dadosSobrenome,
                cpf: dadosCPF,
                data_nascimento: dadosdata_nascimento,
                ddd: dadosDDD,
                telefone: dadosTelefone
            });

            if (response.status === 201) {
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
                <form onSubmit={EnviarDados}>
                    <div>
                        <label htmlFor="dadosNome">Nome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="dadosNome"
                            value={dadosNome}
                            placeholder="Digite seu nome"
                            onChange={(e) => setDadosNome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="dadosSobrenome">Sobrenome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="dadosSobrenome"
                            value={dadosSobrenome}
                            placeholder="Digite seu sobrenome"
                            onChange={(e) => setDadosSobrenome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="dadosCPF">CPF: </label>
                        <input
                            className="dados-input-medio"
                            type="text"
                            name="dadosCPF"
                            value={dadosCPF}
                            placeholder="000.000.000-00"
                            onChange={(e) => setDadosCPF(formatarCPF(e.target.value))}
                        />
                    </div>

                    <div>
                        <label htmlFor="dadosdata_nascimento">Data de Nascimento: </label>
                        <input
                            className="dados-input-medio"
                            type="date"
                            name="dadosdata_nascimento"
                            value={dadosdata_nascimento}
                            onChange={(e) => setDadosdata_nascimento(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="dadosDDD">DDD: </label>
                        <input
                            className="dados-input-pequeno"
                            type="text"
                            name="dadosDDD"
                            value={dadosDDD}
                            placeholder="Ex: 11"
                            onChange={(e) => setDadosDDD(e.target.value)}
                        />

                        <label htmlFor="dadosTelefone">Telefone: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="dadosTelefone"
                            value={dadosTelefone}
                            placeholder="12345-6789"
                            onChange={(e) => setDadosTelefone(formatarTelefone(e.target.value))}
                        />
                    </div>

                    <div>
                        <button type="submit">Finalizar Cadastro</button>
                    </div>

                    {erro && <p className="erro-mensagem">Preencha todos os campos corretamente.</p>}
                    {sucesso && <p className="sucesso-mensagem">Usuário cadastrado com sucesso!</p>}
                </form>
            </div>
        </div>
    );
};

export default DadosPessoal;
