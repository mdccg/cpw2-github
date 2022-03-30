const $ = document.querySelector.bind(document);

const form = $('form');

const modalContraOSistemaMetricoEstadunidense = $('#modal-contra-o-sistema-metrico-estadunidense');

const inputComprimento = $('#comprimento');
const inputLargura = $('#largura');
const inputUnidade = $('#unidade');
const inputQuantidade = $('#quantidade');
const inputTipoCeramica = $('#ceramica');
const inputTipoPorcelanato = $('#porcelanato');
const inputTipoMadeira = $('#madeira');

const facadaAtualReal = $('#real');
const facadaAtualParteInteira = $('#parte-inteira');
const facadaAtualParteFracionaria = $('#parte-fracionaria');
const areaAtual = $('#area-atual');

const carrinho = $('#carrinho');
const cabecalhoCarrinho = $('#cabecalho-carrinho');
const angleDownSolid = $('#angle-down-solid');
const corpoCarrinho = $('#corpo-carrinho');

const faceSmileSolid = $('#face-smile-solid');
const faceFrownSolid = $('#face-frown-solid');
const cabecalhoStatusTitulo = $('#cabecalho-status > span');
const inputOrcamento = $('#orcamento');
const areaTotal = $('#area-total');
const facadaTotal = $('#facada-total');
const restante = $('#restante');

function setModalContraOSistemaMetricoEstadunidense(aberto) {
  modalContraOSistemaMetricoEstadunidense.style.display = aberto ? 'flex' : 'none';
}

/* https://stackoverflow.com/questions/10593337/is-there-any-way-to-create-mongodb-like-id-strings-without-mongodb */
function generateObjectId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
  return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
}

function printCompraHtml(compra) {
  let { _id, quantidade, tipo, comprimento, largura, unidade, area, facada } = compra;
  
  comprimento = formatarNumero(arredondarNumero(comprimento));
  largura = formatarNumero(arredondarNumero(largura));
  facada = formatarNumero(arredondarNumero(facada));

  area = arredondarNumero(area, 4);
  area = formatarNumero(area, unidade === 'cm' ? 4 : 2);

  var htmlCompra = `<div class="compra">
    <div class="cabecalho-compra">
      <span>${quantidade} piso${quantidade > 1 ? 's' : ''} de ${tipo}</span>
      <div class="icone" onclick="deletarCompra('${_id}')" title="Excluir compra">
        <svg class="trash-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z" />
        </svg>
      </div>
    </div>

    <div class="conteudo-compra">
      <span>
        <b>Dimensões:</b> ${comprimento} x ${largura} ${unidade}
      </span>
      <span>
        <b>Área total:</b> ${area} m<sup>2</sup>
      </span>
      <span>
        <b>Facada:</b> R$ ${facada}
      </span>
    </div>
  </div>`;

  corpoCarrinho.insertAdjacentHTML('beforeend', htmlCompra);

  atualizarStatusHtml();
}

function atualizarComprasHtml() {
  corpoCarrinho.innerHTML = '';

  let compras = getCompras();

  compras.forEach(compra => {
    printCompraHtml(compra);
  });

  atualizarStatusHtml();  
}

function atualizarStatusHtml() {
  calcularFacadaTotal();
  calcularAreaTotal();
  calcularRestante();
}

function addCompra(compra) {
  let compras = getCompras();
  
  compras.push(compra);

  localStorage.setItem('compras', JSON.stringify(compras));

  printCompraHtml(compra);
}

function getCompras() {
  let compras = JSON.parse(localStorage.getItem('compras'));

  return compras || [];
}

function deletarCompra(id) {
  let compras = getCompras();

  compras = compras.filter(({ _id }) => _id !== id);

  localStorage.setItem('compras', JSON.stringify(compras));

  atualizarComprasHtml();
}

function calcularArea(comprimento, largura, unidade) {
  let comprimentoMetros = converterParaMetros(comprimento, unidade);
  let larguraMetros = converterParaMetros(largura, unidade);
  
  let area = comprimentoMetros * larguraMetros;

  return area;
}

function calcularFacada(quantidade, area, tipo) {
  const valoresUnitarios = { 'cerâmica': 34.99, 'porcelanato': 124.99, 'madeira': 329.99 };
  const valorUnitario = valoresUnitarios[tipo];

  let facada = quantidade * area * valorUnitario;

  return facada;
}

function calcularFacadaTotal(retornarValor = false) {
  let compras = getCompras();
  let facadas = compras.map(({ facada }) => facada);
  let chuvaDeFacas = facadas.length ? facadas.reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
  
  if (retornarValor) {
    return chuvaDeFacas;
  }

  chuvaDeFacas = formatarNumero(chuvaDeFacas);

  facadaTotal.innerText = chuvaDeFacas;
}

function calcularAreaTotal() {
  let compras = getCompras();
  let areas = compras.map(({ area }) => area);
  let chuvaDeAreas = areas.length ? areas.reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
  
  chuvaDeAreas = formatarNumero(chuvaDeAreas);
  
  areaTotal.innerText = chuvaDeAreas;
}

function calcularRestante() {
  let chuvaDeMerreca = orcamento - calcularFacadaTotal(true);

  chuvaDeMerreca = arredondarNumero(chuvaDeMerreca);

  if (chuvaDeMerreca < 0) {
    faceSmileSolid.style.display = 'none';
    faceFrownSolid.style.display = 'block';

    cabecalhoStatusTitulo.innerText = 'O orçamento estourou!';
    cabecalhoStatusTitulo.style.color = 'var(--alizarin)';
  } else {
    faceSmileSolid.style.display = 'block';
    faceFrownSolid.style.display = 'none';

    cabecalhoStatusTitulo.innerText = 'Tudo sob controle!';
    cabecalhoStatusTitulo.style.color = 'var(--nephritis)';

  }

  chuvaDeMerreca = formatarNumero(chuvaDeMerreca);

  restante.innerText = chuvaDeMerreca;
}

function dispararErroCampoNumerico(event, real = true) {
  let input = event.target;
  let valor = +input.value;
  let valorValido = valor > 0;
  let erro = false;

  if (valorValido) {
    if (!real) {
      var valorTruncado = valor | 0;
      if (valor !== valorTruncado) {
        erro = true;
      }
    } else {
      erro = false;
    }
  } else {
    erro = true;
  }

  if (erro) {
    input.classList.add('displaying-error');
  } else {
    input.classList.remove('displaying-error');
  }
}

function atualizarValoresPrevia(event, atributo) {
  let valor = event.target.value;

  if (!['unidade', 'tipo'].includes(atributo))
    valor = +valor;

  if (valor) {
    valoresPrevia[atributo] = valor;
    atualizarPrevia();
  }
}

function atualizarPrevia() {
  let { comprimento, largura, unidade, quantidade, tipo } = valoresPrevia;

  if (!quantidade) {
    quantidade = 1;
  }

  if (comprimento && largura && quantidade) {
    let area = calcularArea(comprimento, largura, unidade);

    let areaFormatada = arredondarNumero(area * quantidade, 4);
    areaFormatada = formatarNumero(areaFormatada, unidade === 'cm' ? 4 : 2);

    areaAtual.innerHTML = `${areaFormatada} m<sup>2</sup>`;
    
    if (quantidade && tipo) {
      let facada = calcularFacada(quantidade, area, tipo);

      let parteInteira = facada | 0;
      let parteFracionaria = facada - parteInteira;
      parteFracionaria *= 100;
      parteFracionaria = parteFracionaria | 0;
      parteFracionaria = ('0' + parteFracionaria).slice(-2); // zero à esquerda

      facadaAtualReal.innerText = 'R$';
      facadaAtualParteInteira.innerText = formatarNumero(parteInteira, 0);
      facadaAtualParteFracionaria.innerText = parteFracionaria;
    }

  } else {
    areaAtual.innerHTML = '';
    facadaAtualReal.innerText = '';
    facadaAtualParteInteira.innerText = '';
    facadaAtualParteFracionaria.innerText = '';

  }
}

function resetar() {
  valoresPrevia.comprimento = null;
  valoresPrevia.largura = null;
  valoresPrevia.unidade = 'm';
  valoresPrevia.quantidade = null;
  valoresPrevia.tipo = null;
  
  setModalContraOSistemaMetricoEstadunidense(false);
  atualizarPrevia();
  esconderPrevia();
  form.reset();
}

var valoresPrevia = {
  comprimento: null,
  largura: null,
  unidade: 'm',
  quantidade: null,
  tipo: null
};

var orcamento = localStorage.getItem('orcamento') || 0;
var valorTotalAdquirido = null;
var areaTotalAdquirida = null;
var valorRestante = null;

inputComprimento.onblur = event => dispararErroCampoNumerico(event);
inputLargura.onblur = event => dispararErroCampoNumerico(event);
inputQuantidade.onblur = event => dispararErroCampoNumerico(event, false);
inputOrcamento.onblur = event => dispararErroCampoNumerico(event);

inputComprimento.oninvalid = event => dispararErroCampoNumerico(event);
inputLargura.oninvalid = event => dispararErroCampoNumerico(event);
inputQuantidade.oninvalid = event => dispararErroCampoNumerico(event, false);

inputComprimento.onkeyup = event => atualizarValoresPrevia(event, 'comprimento');
inputLargura.onkeyup = event => atualizarValoresPrevia(event, 'largura');
inputQuantidade.onkeyup = event => atualizarValoresPrevia(event, 'quantidade');

inputUnidade.onchange = function(event) {
  atualizarValoresPrevia(event, 'unidade');

  let { value } = event.target;

  if (value === 'm') {
    inputComprimento.setAttribute('step', '0.01');
    inputComprimento.setAttribute('min', '0.01');
    inputLargura.setAttribute('step', '0.01');
    inputLargura.setAttribute('min', '0.01');
    
    inputComprimento.onblur = event => dispararErroCampoNumerico(event);
    inputLargura.onblur = event => dispararErroCampoNumerico(event);
    inputComprimento.oninvalid = event => dispararErroCampoNumerico(event);
    inputLargura.oninvalid = event => dispararErroCampoNumerico(event);

  } else {
    inputComprimento.setAttribute('step', '1');
    inputComprimento.setAttribute('min', '1');
    inputLargura.setAttribute('step', '1');
    inputLargura.setAttribute('min', '1');

    inputComprimento.onblur = event => dispararErroCampoNumerico(event, false);
    inputLargura.onblur = event => dispararErroCampoNumerico(event, false);
    inputComprimento.oninvalid = event => dispararErroCampoNumerico(event, false);
    inputLargura.oninvalid = event => dispararErroCampoNumerico(event, false);

  }

  setModalContraOSistemaMetricoEstadunidense(value === 'pc');
}

inputTipoCeramica.onclick = function(event) {
  atualizarValoresPrevia(event, 'tipo');
  previsualizarCeramica();
}

inputTipoPorcelanato.onclick = function(event) {
  atualizarValoresPrevia(event, 'tipo');
  previsualizarPorcelanato();
}

inputTipoMadeira.onclick = function(event) {
  atualizarValoresPrevia(event, 'tipo');
  previsualizarMadeira();
}

inputOrcamento.onkeyup = function(event) {
  let { value } = event.target;
  
  if (+value) {
    localStorage.setItem('orcamento', value);
    orcamento = value;
    atualizarStatusHtml();
  }
}

form.onsubmit = function(event) {
  event.preventDefault();
  
  let get = atributo => event.target[atributo].value;

  var _id = generateObjectId();
  var comprimento = +get('comprimento');
  var largura = +get('largura');
  var unidade = get('unidade');
  var quantidade = +get('quantidade');
  var tipo = get('tipo');

  var area = calcularArea(comprimento, largura, unidade);
  var facada = calcularFacada(quantidade, area, tipo);

  var compra = { _id, quantidade, tipo, comprimento, largura, unidade, area, facada };
  
  addCompra(compra);

  resetar();
}

var carrinhoAberto = true;

cabecalhoCarrinho.onclick = function() {
  corpoCarrinho.style.display = carrinhoAberto ? 'none' : 'block';
  angleDownSolid.style.transform = `rotate(${carrinhoAberto ? 0 : 180}deg)`;
  carrinhoAberto = !carrinhoAberto;
}

inputOrcamento.value = orcamento;

atualizarComprasHtml();