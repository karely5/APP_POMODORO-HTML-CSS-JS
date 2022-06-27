const tasks = []; /* arreglo de tareas */
let time = 0; /* me va a llevar la cuenta regresiva */
let timer = null;/* esta variable va a tener asignado  */ /* una función que ejecuta una fracción de código cada cierto tiempo */
let timerBreak = null; /* para los 5 minutos de descanso */
let current = null; /* esta variable me dirá la tarea que estoy ejecutando actualmente */
 
const bAdd = document.querySelector('#bAdd'); /* estas constantes hacen referencia a mis elementos html */
const itTask = document.querySelector('#itTask'); /* que si notas tienen el mismo nombre en el index */
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');
renderTime();
renderTasks();

form.addEventListener('submit', e => {
    e.preventDefault();/* cuando envie el formulario realmente no se envie */ /* estoy anulando el funcionamiento nativo de la funcion */
    if(itTask.value !== ''){
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    }
});

function createTask(value){
    const newTask = { /* mi arreglo de "tasks" será un arreglo de objetos */
        id:(Math.random()*100).toString(36).slice(3), /* aqui estoy creando un id dinamico o sea que lo genero con un random */
        title: value,
        completed: false,
    };
    tasks.unshift(newTask);
}
/* con el .map a mi arreglo podré iterrar sobre cada uno de los elementos de mi arreglo */
function renderTasks(){/*  esta función me ha permitir tomar cada una de las tareas */
    const html = tasks.map(task =>{ /* y generar un html que inyectare en un contenedor */
        return ` 
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Done</span>` :`<button class="start-button" data-id="${task.id}"> Start</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join('');

    const starButtons = document.querySelectorAll('.task .start-button');

    starButtons.forEach(button =>{
        button.addEventListener('click', e =>{
            if(!timer){
                const id = button.getAttribute('data-id');
                starButtonHandler(id);
                button.textContent = 'In progress...';
            }
        });
    });
}

function starButtonHandler(id){
    time = 5;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();
    /* esta función se ejecuta indefinidamente, hasta que yo la detenga */
    timer = setInterval(()=>{
        timeHanlder(id);
    }, 1000);
}

function timeHanlder(id){
    time --;
    renderTime();

    if(time === 0){
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function startBreak(){
    time = 3;
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(()=>{
        timerBreakHanlder();
    }, 1000);
}

function timerBreakHanlder(){
    time --;
    renderTime();

    if(time === 0){
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent  = '';
      /*   markCompleted(id); */
        renderTasks();
    }
}

function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10?"0":""}${minutes}:${seconds <10?"0":""}${seconds}`;
}

function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;  
}