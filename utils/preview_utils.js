const face = document.getElementById('face');

function show() {
  face.style.display = 'block';
}

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
  show();
  setBkgdColor('var(--flat-flesh)');
  setBkgdImg('/assets/icons/rounded-plus-connected.svg');
  setBoxShadow('var(--squash-blossom)');
  setBkgdSize('25%');
}

function previsualizarPorcelanato() {
  show();
  setBkgdColor('var(--city-lights)');
  setBkgdImg('/assets/icons/topography.svg');
  setBoxShadow('var(--soothing-breeze)');
  setBkgdSize('300%');
}

function previsualizarMadeira() {
  show();
  setBkgdColor('var(--brown)');
  setBkgdImg('/assets/icons/topography.svg');
  setBoxShadow('var(--carafe)');
  setBkgdSize('150%');
}

function esconderPrevia() {
  face.style.display = 'none';
}