


const addButton = document.getElementById('addButton');

const textInput = document.getElementById('todoInput');

const todoList = document.getElementById('todoList');


addButton.addEventListener('click', ()=>{
    const description = textInput.value.trim();

    if(description !== ''){
        addTask(description);
    }
    textInput.value = '';
});

function addTask(description){

    const listItem = document.createElement('li');
    listItem.textContent = description;

    todoList.appendChild(listItem);
}