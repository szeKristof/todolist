

const toggleButtonClose = document.getElementById('toggle-button-close');
toggleButtonClose.addEventListener('click', () => {
    closePanel();
})

function closePanel(){
    togglePanels(false);
    toggleButtonClose.classList.add('hidden');
    toggleButtonOpen.classList.remove('hidden');
}


const toggleButtonOpen = document.getElementById('toggle-button-open');
toggleButtonOpen.addEventListener('click', () => {
    openPanel();
})

function openPanel(){
    togglePanels(true);
    toggleButtonClose.classList.remove('hidden');
    toggleButtonOpen.classList.add('hidden');
}


const form = document.getElementById('taskAdder');
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target).entries());

  placeCardOnPage(data);
  
  e.target.reset();
});


function placeCardOnPage(data){
        const card = createTaskCard(data);

        const activeGroup = document.getElementsByClassName('activeTask')[0];
        const doneGroup = document.getElementsByClassName('doneTask')[0];

        if(data.isDone){
            doneGroup.appendChild(card);
        }else{
            activeGroup.appendChild(card);
        }
}


function createTaskCard({ title, description, date, time, type, priority, color, hours, reminder, isDone }) {

    const isChecked = isDone ? 'checked' : '';

    const card = document.createElement('div');
    card.innerHTML = `
        <label>
            <input type="checkbox" class="done-toggle" ${isChecked}> Kész
        </label>

        <h2 class="card-title">${title}</h2>
        <p><strong> ${type} </strong></p>

        <label for="taskprogress" id="cardPriorityLabel">fontosság</label>
        <progress id="taskProgress" value="${priority}" max="4"></progress>

        <div class="row">
            <span>${date}</span>
            <span>${time}</span>
            <span>${hours} h</span>
        </div>
        <button class="delete-button">🗑️ Törlés</button>
    `;

    const toggle = card.querySelector('.done-toggle');
    toggle.addEventListener('change', (e) => {
        const doneContainer = document.querySelector('.doneTask');
        const activeContainer = document.querySelector('.activeTask');
        if (e.target.checked) {
            doneContainer.appendChild(card);
        } else {
            activeContainer.appendChild(card);
        }
});

    card.className = 'task-card';

    card.style.borderWidth = '2px';
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
        card.style.border = `10px solid ${color}`;
    }
    const deleteBtn = card.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => {
        card.remove();
    });

    alert("Túlment");

    
    card.dataset.title = title || '';
    card.dataset.description = description || '';
    card.dataset.date = date || '';
    card.dataset.time = time || '';
    card.dataset.type = type || '';
    card.dataset.priority = priority || '';
    card.dataset.color = color || '';
    card.dataset.hours = hours || '';
    card.dataset.reminder = reminder ? 'true' : 'false';


    return card;
}


function togglePanels(openAction) {
  const form = document.getElementsByClassName('formField')[0];
  const tasks = document.getElementsByClassName('taskField')[0];

  // Toggle hidden osztály panelA-n
  if(openAction){
    form.classList.remove('hidden');
    tasks.classList.add('form-opened');
  }else{
    form.classList.add('hidden');
    tasks.classList.remove('form-opened');
  }
}

function saveAllTasksToJsonString() {
    const taskElements = document.querySelectorAll('.task-card');

    const tasks = Array.from(taskElements).map(card => ({
        title: card.dataset.title,
        description: card.dataset.description,
        date: card.dataset.date,
        time: card.dataset.time,
        type: card.dataset.type,
        priority: card.dataset.priority,
        color: card.dataset.color,
        hours: card.dataset.hours,
        reminder: card.dataset.reminder,
        status: card.parentElement.classList.contains('doneTask') ? 'done' : 'active'
    }));
    const taskString = JSON.stringify(tasks);
    return taskString;
}

function loadTasksFromJsonString(jsonString) {
    console.log('loadtask entered');
    // Először töröljük az aktuális taskokat a felületről
    document.querySelector('.activeTask').innerHTML = 'active <br>active';
    document.querySelector('.doneTask').innerHTML = 'DONE <br>DONE ';

    console.log('Tasks emtied');
    // Átalakítjuk a JSON-stringet tömbbé
    const tasks = JSON.parse(jsonString);

    tasks.forEach(task => {
        const card = createTaskCard(task);
        
        if (task.status === 'done') {
            document.querySelector('.doneTask').appendChild(card);
        } else {
            document.querySelector('.activeTask').appendChild(card);
        }
        console.log('Tasks appended');
    });
}

function quickSaveContent(){
    localStorage.setItem('pageContent', saveAllTasksToJsonString());
    console.log('saved');
}

function quickLoadContent(){
    const content = localStorage.getItem('pageContent');
    console.log('pagecontent?');
    if(content){
        loadTasksFromJsonString(content);
        console.log('pagecontent !');
    }else{
        console.log('pagecontent X');
    }
    console.log('loaded');
}

window.addEventListener('DOMContentLoaded', () => {
  quickLoadContent();
  togglePanels(false);
  console.log('Loaded');
});

window.addEventListener('beforeunload', () => {
  quickSaveContent();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    quickSaveContent();
  }
});

window.addEventListener('blur', () => {
  quickSaveContent();
});

setInterval(() => {
  quickSaveContent();
}, 10000); // 10 másodpercenként ment











//itt kezdődjenek az oldal betöltésekor történő események!!











