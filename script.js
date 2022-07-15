const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Columns
const allColumnsUl = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlogList');
const progressList = document.getElementById('progressList');
const completeList = document.getElementById('completeList');
const onHoldList = document.getElementById('onHoldList');

// State of project
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
  // Updating array if you click and updated text(contentEditable)
  for (let i = 0; i < nameArray.length; i++) {
    if (nameArray[i] !== list.children[i].innerText) {
      nameArray.splice(i, 1, list.children[i].innerText);
    }
  }
};

// Set localStorage Arrays
const arraysSendToLocalStorage = () => {
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
const updateStateArrays = () => {
  changeArrayHelper(backlogListArray, backlogList);
  changeArrayHelper(progressListArray, progressList);
  changeArrayHelper(completeListArray, completeList);
  changeArrayHelper(onHoldListArray, onHoldList);
  arraysSendToLocalStorage();
};

// Dropping item
const drop = (e, column) => {
  e.preventDefault();
  allColumnsUl[column].classList.remove('over');
  //Add item to column
  const parent = allColumnsUl[column];
  parent.appendChild(draggedItem);

  updateStateArrays();
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
  }
};

// Create DOM Elements for each list item
const createItemEl = (ulToAppend, item) => {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.innerText = item;

  //Making text editable (if edited synch with arrays of data)
  listEl.contentEditable = true;
  listEl.addEventListener('focusout', (e) => {
    if (e.target.innerText.length === 0 || e.target.innerText === '\n') {
      e.target.remove();
    }

    updateStateArrays();
  });

  // Making draggable
  listEl.draggable = true;
  listEl.addEventListener('dragstart', drag);

  ulToAppend.appendChild(listEl);
};

// Creating columns based on arrays in localstorage
const updateDOM = () => {
  // Check localStorage once
  getSavedColumns();

  backlogListArray.forEach((text) => {
    createItemEl(backlogList, text);
  });
  progressListArray.forEach((text) => {
    createItemEl(progressList, text);
  });
  completeListArray.forEach((text) => {
    createItemEl(completeList, text);
  });
  onHoldListArray.forEach((text) => {
    createItemEl(onHoldList, text);
  });
};

updateDOM();
addDragNDropListeners();

//Listeners+Buttons functionality
const addText = (text, column) => {
  if (text.length) {
    createItemEl(allColumnsUl[column], text);
    updateStateArrays();
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
