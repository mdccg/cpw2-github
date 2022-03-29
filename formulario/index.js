const form = document.querySelector('form');

const modalContraOSistemaMetricoEstadunidense = document.getElementById('modal-contra-o-sistema-metrico-estadunidense');

const inputComprimento = document.getElementById('comprimento');
const inputLargura = document.getElementById('largura');
const inputUnidade = document.getElementById('unidade');
const inputQuantidade = document.getElementById('quantidade');

const facadaAtualParteInteira = document.getElementById('parte-inteira');
const facadaAtualParteFracionaria = document.getElementById('parte-fracionaria');
const areaAtual = document.getElementById('area-atual');

const carrinho = document.getElementById('carrinho');
const cabecalhoCarrinho = document.getElementById('cabecalho-carrinho');
const angleDownSolid = document.getElementById('angle-down-solid');
const corpoCarrinho = document.getElementById('corpo-carrinho');

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
  area = formatarNumero(arredondarNumero(area, 4));
  facada = VMasker.toMoney(arredondarNumero(facada), {
    separator: ',',
    delimiter: '.',
    unit: 'R$'
  });

  var htmlCompra = `<div class="compra">
    <div class="cabecalho-compra">
      <span>${quantidade} piso${quantidade > 1 ? 's' : ''} de ${tipo}</span>
      <div class="icone" onclick="removerCompra('${_id}')" title="Excluir compra">
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
        <b>Facada:</b> ${facada}
      </span>
    </div>
  </div>`;

  corpoCarrinho.insertAdjacentHTML('beforeend', htmlCompra);
}

function atualizarComprasHtml() {
  corpoCarrinho.innerHTML = '';

  let compras = buscarCompras();

  compras.forEach(compra => {
    printCompraHtml(compra);
  });
}

function adicionarCompra(compra) {
  let compras = buscarCompras();
  
  compras.push(compra);

  localStorage.setItem('compras', JSON.stringify(compras));

  printCompraHtml(compra);
}

function buscarCompras() {
  let compras = JSON.parse(localStorage.getItem('compras'));

  return compras || [];
}

function removerCompra(id) {
  let compras = buscarCompras();

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

function dispararErro(event, real = true) {
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

function atualizarPrevia() {
  console.log(comprimentoAtual);
  console.log(larguraAtual);
  console.log(unidadeAtual);
  console.log(quantidadeAtual);

  if (comprimentoAtual && larguraAtual) {
    let area = calcularArea(comprimentoAtual, larguraAtual, unidadeAtual);

    area = formatarNumero(arredondarNumero(area, 4));

    areaAtual.innerHTML = `${area} m<sup>2</sup>`;
    // TODO verificar se há um tipo selecionado
    if (quantidadeAtual && tipoAtual) {
      console.log('Agora lascou!');

    } else {
      facadaAtualParteInteira.innerText = '';
      facadaAtualParteFracionaria.innerText = '';

    }

  } else {
    areaAtual.innerHTML = '';

  }
}

function resetar() {
  form.reset();
  
  comprimentoAtual = null;
  larguraAtual = null;
  unidadeAtual = 'm';
  quantidadeAtual = null;
  tipoAtual = null;
  atualizarPrevia();
  
  setModalContraOSistemaMetricoEstadunidense(false);
}

var comprimentoAtual = null;
var larguraAtual = null;
var unidadeAtual = 'm';
var quantidadeAtual = null;
var tipoAtual = null;

inputComprimento.onblur = function(event) {
  dispararErro(event);
  
  let valor = +event.target.value;  
  if (valor) {
    comprimentoAtual = valor;
    atualizarPrevia();
  }
}

inputLargura.onblur = function(event) {
  dispararErro(event);

  let valor = +event.target.value;  
  if (valor) {
    larguraAtual = valor;
    atualizarPrevia();
  }
}

inputUnidade.onchange = function(event) {
  let valor = event.target.value;
  unidadeAtual = valor;
  atualizarPrevia();

  if (valor === 'm') {
    inputComprimento.setAttribute('step', '0.01');
    inputLargura.setAttribute('step', '0.01');
  
  } else {
    inputComprimento.setAttribute('step', '1');
    inputLargura.setAttribute('step', '1');
  
  }

  setModalContraOSistemaMetricoEstadunidense(valor === 'pc');
}

inputQuantidade.onblur = function(event) {
  dispararErro(event, false);

  let valor = +event.target.value;  
  if (valor) {
    quantidadeAtual = valor;
    atualizarPrevia();
  }
}

// TODO inputTipo.onblur

form.onsubmit = function(event) {
  event.preventDefault();
  
  let get = field => event.target[field].value;

  var _id = generateObjectId();
  var comprimento = +get('comprimento');
  var largura = +get('largura');
  var unidade = get('unidade');
  var quantidade = +get('quantidade');
  var tipo = get('tipo');

  var area = calcularArea(comprimento, largura, unidade);
  var facada = calcularFacada(quantidade, area, tipo);

  var compra = { _id, quantidade, tipo, comprimento, largura, unidade, area, facada };
  
  adicionarCompra(compra);

  resetar();
}

var carrinhoAberto = true;

cabecalhoCarrinho.onclick = function() {
  corpoCarrinho.style.display = carrinhoAberto ? 'none' : 'block';
  angleDownSolid.style.transform = `rotate(${carrinhoAberto ? 0 : 180}deg)`;
  carrinhoAberto = !carrinhoAberto;
}

inputComprimento.focus();

atualizarComprasHtml();