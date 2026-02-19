export function filtrarAgendamentos(lista, filtroData, busca) {
  const hoje = new Date().toISOString().split("T")[0];

  const filtradosPorData = lista.filter((ag) => {
    if (filtroData === "hoje") return ag.data === hoje;
    if (filtroData === "futuro") return ag.data > hoje;
    if (filtroData === "atrasado") return ag.data < hoje;
    return true;
  });

  return filtradosPorData.filter((ag) =>
    ag.nome.toLowerCase().includes(busca.toLowerCase())
  );
}