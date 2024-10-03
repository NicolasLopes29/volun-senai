import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase-config"; // Import Firebase auth
import "./../css/DadosPessoal.css";

const DadosPessoal = () => {
    const [userDados, setUserDados] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        dataNasc: "",
        ddd: "",
        telefone: "",
    });
    const [uid, setUid] = useState(null);
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUid(user.uid);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rev1 = 11 - (soma % 11);
        rev1 = (rev1 === 10 || rev1 === 11) ? 0 : rev1;
        if (rev1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let rev2 = 11 - (soma % 11);
        rev2 = (rev2 === 10 || rev2 === 11) ? 0 : rev2;
        return rev2 === parseInt(cpf.charAt(10));
    };

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return cpf;
    };

    const formatarTelefone = (telefone) => {
        telefone = telefone.replace(/\D/g, "").replace(/(\d{5})(\d{4})/, "$1-$2");
        return telefone;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(false);
        setSucesso(false);

        const { nome, sobrenome, cpf, dataNasc, ddd, telefone } = userDados;

        if (!nome || !sobrenome || !cpf || !dataNasc || !ddd || !telefone) {
            setErro(true);
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido");
            return;
        }

        try {
            const response = await axios.post(`https://volun-api-eight.vercel.app/usuarios/${uid}/info`, {
                nome,
                sobrenome,
                cpf,
                data_nascimento: dataNasc,
                ddd,
                telefone
            });

            if (response.status === 201) {
                setSucesso(true);
                navigate("/dados_endereco"); // Redireciona para a página inicial
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
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="nome"
                            value={userDados.nome}
                            placeholder="Digite seu nome"
                            onChange={(e) => setUserDados({ ...userDados, nome: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="sobrenome">Sobrenome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="sobrenome"
                            value={userDados.sobrenome}
                            placeholder="Digite seu sobrenome"
                            onChange={(e) => setUserDados({ ...userDados, sobrenome: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf">CPF: </label>
                        <input
                            className="dados-input-medio"
                            type="text"
                            name="cpf"
                            value={userDados.cpf}
                            placeholder="000.000.000-00"
                            onChange={(e) => setUserDados({ ...userDados, cpf: formatarCPF(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="dataNasc">Data de Nascimento: </label>
                        <input
                            className="dados-input-medio"
                            type="date"
                            name="dataNasc"
                            value={userDados.dataNasc}
                            onChange={(e) => setUserDados({ ...userDados, dataNasc: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="ddd">DDD: </label>
                        <input
                            className="dados-input-pequeno"
                            type="text"
                            name="ddd"
                            value={userDados.ddd}
                            placeholder="Ex: 11"
                            onChange={(e) => setUserDados({ ...userDados, ddd: e.target.value })}
                        />
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="telefone"
                            value={userDados.telefone}
                            placeholder="(11) 12345-6789"
                            onChange={(e) => setUserDados({ ...userDados, telefone: formatarTelefone(e.target.value) })}
                        />
                    </div>
                    <div>
                        <button type="submit">Próximo</button>
                    </div>
                    {erro && <p className="erro-mensagem">Preencha todos os campos corretamente.</p>}
                    {sucesso && <p className="sucesso-mensagem">Usuário cadastrado com sucesso!</p>}
                </form>
            </div>
        </div>
    );
};

export default DadosPessoal;
