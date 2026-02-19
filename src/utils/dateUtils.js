export function getStatus(data, horario) {
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