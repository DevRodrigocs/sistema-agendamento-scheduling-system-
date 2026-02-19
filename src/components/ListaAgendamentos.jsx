import { getStatus } from "../utils/dateUtils"

export default function ListaAgendamentos({ agendamentos, onRemove, onEdit, onToggleConcluido }) {

    return (
        <div>
            <h2>Agendamentos</h2>

            <ul className="agendamentos-list">
                {agendamentos.map(ag => {

                    const status = getStatus(ag.data, ag.horario)

                    return (

                        <li key={ag.id} className={`card ${ag.concluido === true ? "concluido" : ""}`}>
                            <span className={`status ${status.toLowerCase()}`}>{status}</span>

                            <p><strong>{ag.nome}</strong></p>
                            <p>📅 {ag.data}</p>
                            <p>⏰ {ag.horario} - {ag.horarioFim}</p>
                            <p>💼 {ag.servico}</p>

                            <div className="card-actions">
                                <button
                                    className="btn btn-remove"
                                    onClick={() => {
                                        const confirmar = window.confirm("Tem certeza que deseja excluir este agendamento?")
                                        if (confirmar) {
                                            onRemove(ag.id)
                                        }
                                    }}
                                >
                                    Remover
                                </button>
                                <button
                                    className="btn btn-edit"
                                    onClick={() => onEdit(ag)}
                                >
                                    Editar
                                </button>

                                <button 
                                    className={ag.concluido === true ? "btn-desmarcar" : "btn-concluir"}
                                    onClick={() => onToggleConcluido(ag.id)}
                                >
                                    {ag.concluido === true ? "Desmarcar" : "Concluir"}
                                </button>
                            </div>

                            
                                
                            
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}