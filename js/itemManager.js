/**
* Item Manager Module
* @version 2.3.0
* @description Handles all item-related functionality including rendering,
* creation, editing, counting, and deletion of items.
*
* @changelog
* 2.3.0 - Updated to use event listeners instead of inline handlers
* 2.2.0 - Added increment value feature
* 2.1.0 - Added file dialog for export
* 2.0.0 - Initial module version
*/

import { profiles, currentProfileIndex } from './app.js';
import { closeEditDialog } from './uiManager.js';
import { dragStart, dragEnd, dragOver, drop } from './dragAndDrop.js';

/**
* Creates an item element with all its controls.
* @param {number} index - The index of the item
* @param {string} name - The name of the item
* @param {number} count - The current count of the item
* @returns {HTMLDivElement} The item element with all controls
*/
function createItemElement(index, name, count) {
   const itemDiv = document.createElement('div');
   itemDiv.className = 'item';
   itemDiv.draggable = true;

   const nameSpan = document.createElement('span');
   nameSpan.className = 'item-name';
   nameSpan.textContent = name;
   nameSpan.addEventListener('dblclick', () => editItem(index));

   const countSpan = document.createElement('span');
   countSpan.className = 'item-count';
   countSpan.textContent = count;

   const incrementBtn = document.createElement('button');
   incrementBtn.className = 'big-button';
   incrementBtn.textContent = '+';
   incrementBtn.addEventListener('click', () => incrementItem(index));

   const input = document.createElement('input');
   input.type = 'number';
   input.className = 'increment-value';
   input.value = '1';
   input.min = '1';
   input.addEventListener('change', (e) => validateIncrementValue(e.target));

   const decrementBtn = document.createElement('button');
   decrementBtn.className = 'small-button';
   decrementBtn.textContent = '-';
   decrementBtn.addEventListener('click', () => decrementItem(index));

   const clearBtn = document.createElement('button');
   clearBtn.className = 'small-button';
   clearBtn.textContent = 'Clear';
   clearBtn.addEventListener('click', () => clearItem(index));

   itemDiv.appendChild(nameSpan);
   itemDiv.appendChild(countSpan);
   itemDiv.appendChild(incrementBtn);
   itemDiv.appendChild(input);
   itemDiv.appendChild(decrementBtn);
   itemDiv.appendChild(clearBtn);

   return itemDiv;
}

/**
* Validates and corrects the increment value input.
* @param {HTMLInputElement} input - The input element to validate
*/
export function validateIncrementValue(input) {
   let value = parseInt(input.value);
   if (isNaN(value) || value < 1) {
       input.value = 1;
   } else {
       input.value = Math.floor(value);
   }
}

/**
* Renders the items of the current profile.
*/
export function renderItems() {
   const currentProfile = profiles[currentProfileIndex];
   document.getElementById('pageTitle').textContent = currentProfile.title;
   const itemList = document.getElementById('itemList');
   itemList.innerHTML = '';

   // Calculate max width for consistent item sizing
   let maxWidth = 0;
   currentProfile.items.forEach(item => {
       const tempSpan = document.createElement('span');
       tempSpan.style.visibility = 'hidden';
       tempSpan.style.fontSize = '24px';
       tempSpan.textContent = item.name;
       document.body.appendChild(tempSpan);
       maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
       document.body.removeChild(tempSpan);
   });

   // Create and append item elements
   currentProfile.items.forEach((item, index) => {
       const itemDiv = createItemElement(index, item.name, item.count);
       itemDiv.style.width = `${maxWidth + 250}px`;

       // Add drag and drop listeners
       itemDiv.addEventListener('dragstart', dragStart);
       itemDiv.addEventListener('dragend', dragEnd);
       itemDiv.addEventListener('dragover', dragOver);
       itemDiv.addEventListener('drop', drop);

       itemList.appendChild(itemDiv);
   });
}

/**
* Opens the edit dialog for an item.
* @param {number} index - The index of the item to edit
*/
export function editItem(index) {
   const item = profiles[currentProfileIndex].items[index];
   const dialog = document.createElement('div');
   dialog.className = 'edit-dialog';

   const input = document.createElement('input');
   input.type = 'text';
   input.id = 'editItemName';
   input.value = item.name;

   const saveBtn = document.createElement('button');
   saveBtn.textContent = 'Save';
   saveBtn.addEventListener('click', () => updateItem(index));

   const deleteBtn = document.createElement('button');
   deleteBtn.textContent = 'Delete';
   deleteBtn.addEventListener('click', () => deleteItem(index));

   const cancelBtn = document.createElement('button');
   cancelBtn.textContent = 'Cancel';
   cancelBtn.addEventListener('click', closeEditDialog);

   dialog.appendChild(input);
   dialog.appendChild(saveBtn);
   dialog.appendChild(deleteBtn);
   dialog.appendChild(cancelBtn);

   document.body.appendChild(dialog);
   input.focus();
}

/**
* Updates an item's name.
* @param {number} index - The index of the item to update
*/
export function updateItem(index) {
   const input = document.getElementById('editItemName');
   const newName = input.value;
   if (newName) {
       profiles[currentProfileIndex].items[index].name = newName;
       closeEditDialog();
       renderItems();
   }
}

/**
* Deletes an item from the current profile.
* @param {number} index - The index of the item to delete
*/
export function deleteItem(index) {
   if (confirm('Are you sure you want to delete this item?')) {
       profiles[currentProfileIndex].items.splice(index, 1);
       closeEditDialog();
       renderItems();
   }
}

/**
* Adds a new item to the current profile.
*/
export function addItem() {
   const name = prompt('Enter item name:');
   if (name) {
       profiles[currentProfileIndex].items.push({ name, count: 0 });
       renderItems();
   }
}

/**
* Increments the count of an item by the increment value.
* @param {number} index - The index of the item to increment
*/
export function incrementItem(index) {
   const incrementValue = parseInt(
       document.querySelector(`#itemList .item:nth-child(${index + 1}) .increment-value`).value
   );
   profiles[currentProfileIndex].items[index].count += incrementValue;
   document.querySelector(`#itemList .item:nth-child(${index + 1}) .increment-value`).value = 1;
   renderItems();
}

/**
* Decrements the count of an item by the increment value.
* @param {number} index - The index of the item to decrement
*/
export function decrementItem(index) {
   const incrementValue = parseInt(
       document.querySelector(`#itemList .item:nth-child(${index + 1}) .increment-value`).value
   );
   const currentCount = profiles[currentProfileIndex].items[index].count;
   profiles[currentProfileIndex].items[index].count = Math.max(0, currentCount - incrementValue);
   document.querySelector(`#itemList .item:nth-child(${index + 1}) .increment-value`).value = 1;
   renderItems();
}

/**
* Clears the count of an item.
* @param {number} index - The index of the item to clear
*/
export function clearItem(index) {
   profiles[currentProfileIndex].items[index].count = 0;
   renderItems();
}

/**
* Clears all item counts in the current profile.
*/
export function clearAll() {
   profiles[currentProfileIndex].items.forEach(item => item.count = 0);
   renderItems();
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
