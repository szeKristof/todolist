const activeGroup = document.querySelector('.activeTask');
const doneGroup = document.querySelector('.doneTask');

const modal = document.getElementById('card-modal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = modal.querySelector('.modal-close');
const modalTitle = modal.querySelector('.modal-title');
const modalDesc = modal.querySelector('.modal-description');

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
    quickSave(true);
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

    if (!form.checkValidity()) {
        const invalidFields = form.querySelectorAll(':invalid');
        let message = "Hibás formátum. Ellenőrizd hogy mindent helyesen formátumban adtál-e meg!";

        invalidFields.forEach(field => {
            message += "\n";
            message += `${field.name}: ${field.validationMessage}`;
        });
        // Ha bármelyik required mező üres vagy érvénytelen
        alert(message);
        return;
    }

    let data = Object.fromEntries(new FormData(e.target).entries());
    data = extendMissingObjectParts(data);
    const card = createAndPlaceTaskCard(data, false);
    e.target.reset();
    closePanel();
    card.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    card.classList.add('scroll-highlight');
    setTimeout(() => {
    card.classList.remove('scroll-highlight');
    }, 2000); // vagy amilyen hosszú az animáció
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

    // Formázott dátum: 2013. február 12.
    let formattedDate = '';
    if (date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // hónap 0-indexelt
        const day = String(d.getDate()).padStart(2, '0');
        formattedDate = `${year}.${month}.${day}.`;
    }
    // Formázott idő: 13:00 vagy 13-00
    let formattedTime = '';
    if (time) {
        formattedTime = time;
    }

    // Formázott óraszám: ha 0, üres; egyébként: "várható időtartam: 2 óra"
    let formattedHours = '';
    const parsedHours = parseInt(hours, 10);
    if (hours && parsedHours > 0) {
        formattedHours = `Dur:${parsedHours}`;
    }


    const card = document.createElement('div');
    card.innerHTML = `
        <div class=card-header>
            <h2 class="card-title" title="${title}">${title}</h2>

            <label class="switch">
                <input checked="" type="checkbox" class="done-toggle">
                <div class="slider">
                    <div class="circle">
                        <svg class="cross" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                            </g>
                        </svg>
                        <svg class="checkmark" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path class="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                            </g>
                        </svg>
                    </div>
                </div>
            </label>

        </div>
        <span><strong> ${type} </strong></span>

        <label for="taskprogress" id="cardPriorityLabel">fontosság</label>
        <progress id="taskProgress" value="${priority}" max="4"></progress>

        <div class="row">
            <span>${formattedDate}</span>
            <span>${formattedTime}</span>
            <span>${formattedHours}</span>
        </div>
        <button class="delete-button">🗑️ Törlés</button>
    `;

    const toggleCheckbox = card.querySelector('.done-toggle');

    toggleCheckbox.addEventListener('change', (event) => {
        event.stopPropagation();
        setTimeout(() => {
            if (event.target.checked) {
                doneGroup.prepend(card);
                card.dataset.status = 'true';
            } else {
                activeGroup.prepend(card);
                card.dataset.status = 'false';
            }
            quickSave();
        }, 400);
    });
    const toggleArea = card.querySelector('.switch');
    toggleArea.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    


    card.className = 'task-card';
    card.style.borderWidth = '2px';
    card.style.border = `10px solid ${color}`;
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
        card.style.border = `4px solid ${color}`;
    }
    const bgColor = lightenColor(color);
    card.style.backgroundColor = `${bgColor}`;

    const cardTitle = card.querySelector('.card-title');
    cardTitle.style.color = `${color}`;
    
    
    const deleteBtn = card.querySelector('.delete-button');
        deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Hozzáadjuk az animációs osztályt
        card.classList.add('card-remove-animation');

        // Várjuk, hogy az animáció véget érjen, majd töröljük
        card.addEventListener('animationend', () => {
            card.remove();
            quickSave();
        }, { once: true }); // csak egyszer fusson le
    });




    card.addEventListener('click', () => {
    const modal_title = title || 'No title available';
    const modal_description = description || 'No description for this task available';
    
    modalTitle.textContent = modal_title;
    modalDesc.textContent = modal_description;
    modal.classList.remove('hidden');
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
        toggleCheckbox.checked = true;
    }else{
        toggleCheckbox.checked = false;
    }
    

    if(status){
        isRetrieve ? doneGroup.appendChild(card) : doneGroup.prepend(card);
    }else{
        isRetrieve ? activeGroup.appendChild(card) : activeGroup.prepend(card);
    }
    quickSave();
    return card;
}

function lightenColor(hex, percent = 65) {
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

let originalTitle = document.title;


function signalUnsavedChanges() {
    document.title = '★ ' + originalTitle;
    saveButton.classList.add('highlight');
}


function removeUnsavedChanges() {
    document.title = originalTitle;
    saveButton.classList.remove('highlight');

}



//saves the content of the page in localstorage
function quickSave(forced = false){
    if(autoSave.checked || forced){
        localStorage.setItem('pageContent', saveAllTasksToJsonString());
        console.log('saved');
        removeUnsavedChanges()
    }
    else{
        signalUnsavedChanges();
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

modal.addEventListener('click', (event) => {
    modal.classList.add('hidden');
});

modalClose.addEventListener('click', (event) => {
    modal.classList.add('hidden');
});

modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

//save and load event handlers
window.addEventListener('DOMContentLoaded', () => {
  quickLoad();
  closePanel();
});


