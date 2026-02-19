export function criarAgendamento(dados) {
  return {
    ...dados,
    id: crypto.randomUUID(),
    concluido: false
  };
}

export function removerAgendamento(lista, id) {
  return lista.filter(ag => ag.id !== id);
}

export function atualizarAgendamento(lista, id, dadosAtualizados) {
  return lista.map(ag =>
    ag.id === id ? { ...ag, ...dadosAtualizados } : ag
  );
}

export function toggleConcluido(lista, id) {
  return lista.map(ag =>
    ag.id === id ? { ...ag, concluido: !ag.concluido } : ag
  );
}