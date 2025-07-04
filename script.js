const activeGroup = document.querySelector('.activeTask');
const doneGroup = document.querySelector('.doneTask');

const forms = document.querySelector('.formField');
const tasks = document.querySelector('.taskField');

const autoSave = document.getElementById('auto-save');
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    quickSave(true);
});

autoSave.addEventListener('change', (e) => {
    if(e.target.checked){
        localStorage.setItem('autosave', 'true');
        saveButton.disabled = true;
    }else{
        localStorage.setItem('autosave', 'false');
        saveButton.disabled = false;
    }
});


const toggleButtonClose = document.getElementById('toggle-button-close');
toggleButtonClose.addEventListener('click', () => {
    closePanel();
})
function closePanel(){
    forms.classList.add('hidden');
    tasks.classList.remove('form-opened');

    toggleButtonClose.classList.add('hidden');
    toggleButtonOpen.classList.remove('hidden');
}

const toggleButtonOpen = document.getElementById('toggle-button-open');
toggleButtonOpen.addEventListener('click', () => {
    openPanel();
})
function openPanel(){
    forms.classList.remove('hidden');
    tasks.classList.add('form-opened');

    toggleButtonClose.classList.remove('hidden');
    toggleButtonOpen.classList.add('hidden');
}

const form = document.getElementById('taskAdder');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target).entries());
    data = extendMissingObjectParts(data);
    const card = createAndPlaceTaskCard(data, false);
    e.target.reset();
    closePanel();
    card.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    card.classList.add('scroll-highlight');
});

//gets data from the form transformed to object and returns its extended version to match every property of the card
function extendMissingObjectParts(submitObject) {
    const validObject = {
        title: submitObject.title || '',
        description: submitObject.description || '',
        date: submitObject.date || '',
        time: submitObject.time || '',
        type: submitObject.type || '',
        priority: parseInt(submitObject.priority || '0', 10),
        color: submitObject.color || '#000000',
        hours: parseInt(submitObject.hours || '0', 10), // egész számként kezelve
        reminder: submitObject.reminder === 'on',        // checkbox → boolean
        status: submitObject.isDone === 'on'             // checkbox → boolean
    };
    return validObject;
}

//gets a js cardValid object in parameter and returns a complete html element
function createAndPlaceTaskCard({ title, description, date, time, type, priority, color, hours, reminder, status }, isRetrieve = true) {

    const card = document.createElement('div');
    card.innerHTML = `
        <div class=card-header>
            <h2 class="card-title" title="${title}">${title}</h2>
            <label class="card-done-checkbox">
                <input type="checkbox" class="done-toggle" > Kész
            </label>
        </div>
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
        if (e.target.checked) {
            doneGroup.prepend(card);
            card.dataset.status = 'true';
        } else {
            activeGroup.prepend(card);
            card.dataset.status = 'false';
        }
        quickSave();
    });
    if(status){
        toggle.checked = true;
    }else{
        toggle.checked = false;
    }
    toggle.dispatchEvent(new Event('change', { bubbles: true }));

    card.className = 'task-card';
    card.style.borderWidth = '2px';
    card.style.border = `10px solid ${color}`;
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
        card.style.border = `4px solid ${color}`;
    }
    const bgColor = lightenColor(color, 65);
    card.style.backgroundColor = `${bgColor}`;

    const cardTitle = card.querySelector('.card-title');
    cardTitle.style.color = `${color}`;
    
    
    const deleteBtn = card.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => {
        card.remove();
        quickSave();
    });
    
    card.dataset.title = title;
    card.dataset.description = description;
    card.dataset.date = date;
    card.dataset.time = time;
    card.dataset.type = type;
    card.dataset.priority = priority.toString();
    card.dataset.color = color;
    card.dataset.hours = hours.toString();
    card.dataset.reminder = reminder.toString(); // 'true' vagy 'false'
    card.dataset.status = status.toString();     // 'true' vagy 'false'

    if(status){
        isRetrieve ? doneGroup.appendChild(card) : doneGroup.prepend(card);
    }else{
        isRetrieve ? activeGroup.appendChild(card) : activeGroup.prepend(card);
    }
    quickSave();
    return card;
}

function lightenColor(hex, percent = 70) {
  // Töröljük a # jelet
  hex = hex.replace(/^#/, '');

  // Konvertálás RGB értékekre
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);

  // Lighten formula
  const lighten = (channel) => Math.min(255, Math.floor(channel + (255 - channel) * (percent / 100)));

  const newR = lighten(r);
  const newG = lighten(g);
  const newB = lighten(b);

  return `rgb(${newR}, ${newG}, ${newB})`;
}



//returns a json valid formatted string from the given object
function stringFromObject(object){
    const string = JSON.stringify(object);
    return string;
}

//Collects all tasks from page and returns in a string
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
        status: card.dataset.status,
    }));
    return stringFromObject(tasks);
}

//returns an object from the given json valid formatted string
function objectFromString(string){
    const object = JSON.parse(string);
    return object;
}

//get a string with all the content in it and builds up the pagecontent
function loadTasksFromJsonString(jsonString) {
    // Először töröljük az aktuális taskokat a felületről
    document.querySelector('.activeTask').innerHTML = '';
    document.querySelector('.doneTask').innerHTML = '';

    // Átalakítjuk a JSON-stringet tömbbé
    const tasks = objectFromString(jsonString);
    tasks.forEach(task => {
        task.status = (task.status === 'true');
        task.reminder = (task.reminder === 'true');
        task.priority = parseInt(task.priority, 10) || 0;
        task.hours = parseInt(task.hours, 10) || 0;
        createAndPlaceTaskCard(task);
    });
}

//saves the content of the page in localstorage
function quickSave(forced = false){
    if(autoSave.checked || forced){
        localStorage.setItem('pageContent', saveAllTasksToJsonString());
        console.log('saved');
    }
}

//loads the content of the page from localstorage
function quickLoad(){
    const content = localStorage.getItem('pageContent');
    if(content){
        loadTasksFromJsonString(content);
    }

    const autosave = localStorage.getItem('autosave');
    if(autosave === 'true'){
        autoSave.checked = true;
    }
    autoSave.dispatchEvent(new Event('change', { bubbles: true }));

    console.log('loaded');
}


//save and load event handlers
window.addEventListener('DOMContentLoaded', () => {
  quickLoad();
  closePanel();
});

window.addEventListener('beforeunload', () => {
  quickSave();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    quickSave();
  }
});

window.addEventListener('blur', () => {
  quickSave();
});


