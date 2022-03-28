const form = document.querySelector('form');
const face = document.getElementById('face');
const carrinho = document.getElementById('carrinho');
const cabecalhoCarrinho = document.getElementById('cabecalho-carrinho');

function setBkgdColor(color) {
  face.style.backgroundColor = color;
}

function setBkgdImg(img) {
  face.style.backgroundImage = `url('${img}')`;
}

/* https://stackoverflow.com/questions/27298934/3d-box-shadow-effect */
function getBoxShadow(color, depth = 16) {
  let boxShadow = [];
  
  for (let i = 1; i <= depth; ++i)
    boxShadow.push(`${i}px ${i}px 0px ${color}`);

  return boxShadow.join(',');
}

function setBoxShadow(color) {
  face.style.boxShadow = getBoxShadow(color);
}

function setBkgdSize(size) {
  face.style.backgroundSize = size;
}

function previsualizarCeramica() {
  setBkgdColor('var(--flat-flesh)');
  setBkgdImg('/assets/icons/rounded-plus-connected.svg');
  setBoxShadow('var(--squash-blossom)');
  setBkgdSize('25%');
}

function previsualizarPorcelanato() {
  setBkgdColor('var(--city-lights)');
  setBkgdImg('/assets/icons/topography.svg');
  setBoxShadow('var(--soothing-breeze)');
  setBkgdSize('300%');
}

function previsualizarMadeira() {
  setBkgdColor('var(--brown)');
  setBkgdImg('/assets/icons/topography.svg');
  setBoxShadow('var(--carafe)');
  setBkgdSize('150%');
}

function converterNumero(numero, unidade = 'm') {
  const expoentes = { 'm': 0, 'cm': -2, 'pc': 0 };
  const expoente = expoentes[unidade] || 0;
  return numero * 10 ** expoente;
}

function arredondarNumero(numero) {
  return +numero.toFixed(2);
}

function formatarNumero(numero) { 
  return `${arredondarNumero(numero)}`.replace('.', ',');
}

function printHtmlCompra(compra) {
  let { quantidade, tipo, comprimento, largura, unidade, area, facada } = compra;
  
  comprimento = formatarNumero(comprimento);
  largura = formatarNumero(largura);
  area = formatarNumero(area);
  facada = arredondarNumero(facada);

  console.log(facada);

  facada = VMasker.toMoney(facada, {
    separator: ',',
    delimiter: '.',
    unit: 'R$'
  });

  var htmlCompra = `<div class="compra">
    <div class="cabecalho-compra">
      <span>${quantidade} piso${quantidade > 1 ? 's' : ''} de ${tipo}</span>
      <div class="icone">
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

  carrinho.insertAdjacentHTML('beforeend', htmlCompra);
}

function adicionarCompra(compra) {

}

function removerCompra(indice) {

}

form.onsubmit = function(event) {
  event.preventDefault();
  
  let get = field => event.target[field].value;

  var comprimento = +get('comprimento');
  var largura = +get('largura');
  var unidade = get('unidade');
  var quantidade = +get('quantidade');
  var tipo = get('tipo');

  var comprimentoMetros = converterNumero(comprimento, unidade);
  var larguraMetros = converterNumero(largura, unidade);
  var area = comprimentoMetros * larguraMetros;

  const valoresUnitarios = { 'cerâmica': 34.99, 'porcelanato': 124.99, 'madeira': 329.99 };
  const valorUnitario = valoresUnitarios[tipo];

  var facada = quantidade * area * valorUnitario;

  var compra = { quantidade, tipo, comprimento, largura, unidade, area, facada };
  printHtmlCompra(compra);
}

var carrinhoAberto = true;

cabecalhoCarrinho.onclick = function() {
  // TODO colapsar
}