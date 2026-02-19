import Header from "./components/Header";
import FormAgendamento from "./components/FormAgendamento";
import ListaAgendamentos from "./components/ListaAgendamentos";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import "./styles/index.css";
import { ordenarAgendamentos } from "./utils/ordenacaoUtils";
import { filtrarAgendamentos } from "./utils/filtroUtils";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  criarAgendamento,
  removerAgendamento,
  atualizarAgendamento,
  toggleConcluido
} from "./services/agendamentoService";

function App() {
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("todos");
  const [agendamentos, setAgendamentos] = useLocalStorage("agendamentos", []);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  const agendamentosOrdenados = ordenarAgendamentos(agendamentos);

  const agendamentosFiltrados = filtrarAgendamentos(
    agendamentosOrdenados,
    filtroData,
    busca
  );
  
  function adicionarAgendamento(novoAgendamento) {
    const novo = criarAgendamento(novoAgendamento);
    setAgendamentos(prev => [...prev, novo]);
  }

  function handleRemover(id) {
    setAgendamentos(prev => removerAgendamento(prev, id));
  }

  function handleAtualizar(id, dados) {
    setAgendamentos(prev => atualizarAgendamento(prev, id, dados));
    setAgendamentoEditando(null);
  }

  function handleToggle(id) {
    setAgendamentos(prev => toggleConcluido(prev, id));
  }

  return (
    <div className={darkMode ? "app-container dark" : "app-container"}>
      <div className="toolbar">
        <button
          className="toggle-btn"
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
      </div>

      <Header />
      <FormAgendamento 
        onAdd={adicionarAgendamento}
        agendamentoEditando={agendamentoEditando}
        onUpdate={handleAtualizar}
        listaAgendamentos={agendamentos}
      />

      <div className="search-wrapper">
        <input 
          className="search-input"
          type="text"
          placeholder="🔍 Busca por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="filtros">
        <button
          className={`filter-btn ${filtroData === "hoje" ? "active" : ""}`}
          onClick={() => setFiltroData("hoje")}
          aria-pressed={filtroData === "hoje"}        
        >
          Hoje
        </button>

        <button 
          className={`filter-btn ${filtroData === "futuro" ? "active" : ""}`}
          onClick={() => setFiltroData("futuro")}
          aria-pressed={filtroData === "futuro"}
        >
          Futuro
        </button>

        <button
          className={`filter-btn ${filtroData === "atrasado" ? "active" : ""}`}
          onClick={() => setFiltroData("atrasado")}
          aria-pressed={filtroData === "atrasado"}
        >
          Atrasado
        </button>

        <button
          className={`filter-btn ${filtroData === "todos" ? "active" : ""}`}
          onClick={() => setFiltroData("todos")}
          aria-pressed={filtroData === "todos"}
        >
          Todos
        </button>
      </div>

      <ListaAgendamentos 
        agendamentos={agendamentosFiltrados}
        onRemove={handleRemover}
        onEdit={setAgendamentoEditando}
        onToggleConcluido={handleToggle}
        darkMode={darkMode}
      />
      <Footer />
    </div>
  );
}

export default App;