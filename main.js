const $ = document.querySelector.bind(document);

const form = $('form');
const tasksList = $('#lista-de-tarefas');

function addHtmlTask(taskDescription, checked = false) {
  const li = `
    <li>
      <div>
        <input
          type="checkbox"
          onclick="saveCheckTask('${taskDescription}')"
          ${checked ? 'checked' : ''} />
        <span>${taskDescription}</span>
      </div>

      <span
        class="times"
        onclick="deleteTaskByDescription('${taskDescription}')">&times;</span>
    </li>
  `;

  tasksList.insertAdjacentHTML('beforeend', li);
}

function getHtmlList() {
  tasksList.innerHTML = '';
  console.log(tasks);
  tasks.forEach(({ taskDescription, checked }) => addHtmlTask(taskDescription, checked));
}

function setList(tasks) {
  localStorage.setItem('tasks-list', JSON.stringify(tasks));
}

function saveTask(taskDescription) {
  tasks.push({ taskDescription, checked: false });
  setList(tasks);
  
  addHtmlTask(taskDescription);
}

function saveCheckTask(_taskDescription) {
  var index = tasks.map(({ taskDescription }) => taskDescription).indexOf(_taskDescription);
  var task = tasks[index];

  task.checked = !task.checked;
  tasks[index] = task;

  setList(tasks);
}

function deleteTaskByDescription(_taskDescription) {
  tasks = tasks.filter(({ taskDescription }) => taskDescription !== _taskDescription);
  setList(tasks);

  getHtmlList();
}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  saveTask(event.target.taskDescription.value);
  form.reset();
});

var tasks = JSON.parse(localStorage.getItem('tasks-list')) || [];
getHtmlList();