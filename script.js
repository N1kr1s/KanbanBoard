const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const allColumnsUl = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlogList');
const progressList = document.getElementById('progressList');
const completeList = document.getElementById('completeList');
const onHoldList = document.getElementById('onHoldList');

// Items
loadedFromLocalStorage = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;

// Starts dragging
const drag = (e) => {
  draggedItem = e.target;
};

// Allows item to be dropped
const allowDrop = (e) => {
  e.preventDefault();
};

//When you drag over ul column
const dragEnter = (column) => {
  allColumnsUl[column].classList.add('over');
};

//When you drag out of ul column
const dragLeave = (column) => {
  allColumnsUl[column].classList.remove('over');
};

const changeArrayHelper = (nameArray, list) => {
  if (nameArray.length !== list.children.length) {
    nameArray.length = 0;

    for (let item of list.children) {
      nameArray.push(item.innerText);
    }
  }
};

// Set localStorage Arrays
const updateSavedColumns = () => {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

  listArrays.forEach((array, idx) => {
    localStorage.setItem(`${arrayNames[idx]}Items`, JSON.stringify(array));
  });
};

//Arrays now reflect drag and drop changes
const changeArrays = () => {
  changeArrayHelper(backlogListArray, backlogList);
  changeArrayHelper(progressListArray, progressList);
  changeArrayHelper(completeListArray, completeList);
  changeArrayHelper(onHoldListArray, onHoldList);
  updateSavedColumns();
};

// Dropping item
const drop = (e, column) => {
  e.preventDefault();
  allColumnsUl[column].classList.remove('over');
  //Add item to column
  const parent = allColumnsUl[column];
  parent.appendChild(draggedItem);

  changeArrays();
};

// listeners for dragging functionality
const addDragNDropListeners = () => {
  allColumnsUl.forEach((ul, idx) => {
    ul.addEventListener('dragover', allowDrop);
    ul.addEventListener('dragenter', () => dragEnter(idx));
    ul.addEventListener('dragleave', () => dragLeave(idx));
    ul.addEventListener('drop', (e) => drop(e, idx));
  });
};

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = () => {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
};

// Create DOM Elements for each list item
const createItemEl = (ulToAppend, item) => {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.innerText = item;
  // Making draggable
  listEl.draggable = true;
  listEl.addEventListener('dragstart', drag);

  ulToAppend.appendChild(listEl);
};

// Update Columns in DOM
const updateDOM = () => {
  // Check localStorage once
  !loadedFromLocalStorage && getSavedColumns();
  updateSavedColumns();
  // Backlog Column
  backlogListArray.forEach((item) => {
    createItemEl(backlogList, item);
  });
  // Progress Column
  progressListArray.forEach((item) => {
    createItemEl(progressList, item);
  });
  // Complete Column
  completeListArray.forEach((item) => {
    createItemEl(completeList, item);
  });
  // On Hold Column
  onHoldListArray.forEach((item) => {
    createItemEl(onHoldList, item);
  });
  loadedFromLocalStorage = true;
};

updateDOM();
addDragNDropListeners();

//Listeners+Buttons functionality
const addText = (text, column) => {
  if (text.length) {
    createItemEl(allColumnsUl[column], text);
    changeArrays();
  }
  addItems[column].innerText = '';
};

const showInputBox = (column) => {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
};

const hideInputBox = (column) => {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addText(addItems[column].innerText, column);
};

//Add + Save button listeners
const addItemListeners = () => {
  addBtns.forEach((item, idx) => {
    item.addEventListener('click', () => showInputBox(idx));
  });
};

const addSaveListeners = () => {
  saveItemBtns.forEach((item, idx) => {
    item.addEventListener('click', () => hideInputBox(idx));
  });
};

addItemListeners();
addSaveListeners();
