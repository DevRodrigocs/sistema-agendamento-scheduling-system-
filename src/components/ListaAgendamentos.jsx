export default function ListaAgendamentos({ agendamentos, onRemove, onEdit }) {

    function getStatus(data, horario) {
        const agora = new Date();
        const dataAgendamento = new Date(`${data}T${horario}`);

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataComparacao = new Date(dataAgendamento);
        dataComparacao.setHours(0, 0, 0, 0);

        if (dataComparacao.getTime() === hoje.getTime()) {
            return "hoje"
        }

        if (dataAgendamento < agora) {
            return "atrasado"
        }

        return "futuro"
    }

    return (
        <div>
            <h2>Agendamentos</h2>

            <ul className="agendamentos-list">
                {agendamentos.map(ag => {

                    const status = getStatus(ag.data, ag.horario)

                    return (

                        <li key={ag.id} className="card">
                            <span className={`status ${status}`}>{status.toUpperCase()}</span>

                            <p><strong>{ag.nome}</strong></p>
                            <p>📅 {ag.data}</p>
                            <p>⏰ {ag.horario}</p>
                            <p>💼 {ag.servico}</p>

                            <div className="card-actions">
                                <button
                                    className="btn btn-remove"
                                    onClick={() => {
                                        const confirmar = window.confirm("Tem certeza que deseja excluir este agendamento?")
                                        if (confirmar) {
                                            onRemove(ag.id)
                                        }
                                    }}>Remover</button>
                                <button
                                    className="btn btn-edit"
                                    onClick={() => onEdit(ag)}>Editar</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}