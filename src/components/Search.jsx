import React, { useState } from "react";
import "./../css/Eventos.css";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
  "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO"
];

const Search = ({ onBuscar }) => {
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar({ estadoSelecionado, categoria, cidade, searchQuery });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <section className="arrumar-tudo">
      <h1 className="Eventos-h1">Pesquise aqui</h1>
      <form onSubmit={handleSubmit} className="Eventos-form">
        <div className="Eventos-barra-pesquisa">
          <input
            type="text"
            placeholder="Digite sua pesquisa"
            className="Eventos-input-pesquisa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="Eventos-button-buscar">
            Buscar
          </button>
        </div>
        <button type="button" onClick={toggleFilters} className="Eventos-toggle-filtros">
          {showFilters ? "Ocultar Filtros ▲" : "Exibir Filtros ▼"}
        </button>
        {showFilters && (
          <div className="Eventos-filtros">
            <div className="Eventos-input-filtro">
              <input
                required
                type="text"
                name="categoria"
                autoComplete="off"
                className="Eventos-input"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
              <label className="Eventos-user-label">Categoria</label>
            </div>
            <div className="Eventos-input-filtro">
              <input
                required
                type="text"
                name="cidade"
                autoComplete="off"
                className="Eventos-input"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <label className="Eventos-user-label">Cidade</label>
            </div>
            <div className="Eventos-select">
              <select
                className="Eventos-estado-busca"
                value={estadoSelecionado}
                onChange={(e) => setEstadoSelecionado(e.target.value)}
              >
                <option value="">Estado</option>
                {estados.map((estado, index) => (
                  <option key={index} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default Search;
