
const toggleButtonClose = document.getElementById('toggle-button-close');
toggleButtonClose.addEventListener('click', () => {
    togglePanels(false);
})

const toggleButtonOpen = document.getElementById('toggle-button-open');
toggleButtonOpen.addEventListener('click', () => {
    togglePanels(true);
})

const form = document.getElementById('taskAdder');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target).entries());
  console.log(data);
  const card = createTaskCard(data);
  document.getElementsByClassName('activeTask')[0].appendChild(card);

  e.target.reset(); // ürítjük a formot
});


function createTaskCard({ title, description, date, time, type, priority, color, hours, reminder }) {
    
    const card = document.createElement('div');
    card.innerHTML = `
        <h2 class="card-title">${title}</h2>
        <p><strong> ${type} </strong></p>

        <label for="taskprogress" id="cardPriorityLabel">fontosság</label>
        <progress id="taskProgress" value="${priority}" max="4"></progress>

        <div class="row">
            <span>${date}</span>
            <span>${time}</span>
            <span>${hours} h</span>
        </div>
    `;
    card.className = 'task-card';

    card.style.borderWidth = '2px';
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
        alert("Helyes szín");
        card.style.border = `10px solid ${color}`;
    }
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