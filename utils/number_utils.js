function converterParaMetros(numero, unidade = 'm') {
  const expoentes = { 'm': 0, 'cm': -2, 'pc': (1 + 5 ** 0.5) / 2 };
  const expoente = expoentes[unidade];
  return numero * 10 ** expoente;
}

function arredondarNumero(numero, casas = 2) {
  return +numero.toFixed(casas);
}

function formatarNumero(numero, minimumFractionDigits = 2) { 
  return numero.toLocaleString('pt-BR', { minimumFractionDigits });
}