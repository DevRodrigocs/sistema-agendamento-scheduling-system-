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

            <ul style={{ listStyle: "none", padding: 0 }}>
                {agendamentos.map(ag => {

                    const status = getStatus(ag.data, ag.horario)

                    return (

                        <li key={ag.id} style={{
                            background: "#ffffff",
                            padding: "16px",
                            marginBottom: "16px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                        }}>
                            <span style={{
                                alignSelf: "flex-start",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                background:
                                    status === "hoje" ? "#22c55e" :
                                        status === "atrasado" ? "#ef4444" :
                                            "#3b82f6",
                                color: "white"
                            }}>{status.toUpperCase()}</span>

                            <p><strong>{ag.nome}</strong></p>
                            <p>📅 {ag.data}</p>
                            <p>⏰ {ag.horario}</p>
                            <p>💼 {ag.servico}</p>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button
                                    style={{
                                        background: "#dc2626",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        const confirmar = window.confirm("Tem certeza que deseja excluir este agendamento?")
                                        if (confirmar) {
                                            onRemove(ag.id)
                                        }
                                    }}>Remover</button>
                                <button
                                    style={{
                                        background: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => onEdit(ag)}>Editar</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}