function redirecionar() {
  window.location.pathname = '/formulario/';
}

const form = document.getElementById('form-orcamento');

form.onsubmit = function(event) {
  event.preventDefault();
  
  localStorage.setItem('orcamento', +event.target.orcamento.value);

  redirecionar();
}

if (localStorage.getItem('orcamento') !== null)
  redirecionar();