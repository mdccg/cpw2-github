const $ = document.querySelector.bind(document);

const addTask = event => {
  event.preventDefault();

  const taskDescription = $('#task-description').value;

  const newTaskItem = `
    <li>${taskDescription}</li>
  `;

  $('#task-list').insertAdjacentHTML('beforeend',  newTaskItem);
  $('#task-form').reset();
}