/**
* Item Manager Module
* @version 2.2.0
* @description Handles all item-related functionality including rendering,
* creation, editing, counting, and deletion of items.
*/

import { profiles, currentProfileIndex } from './app.js';
import { closeEditDialog } from './uiManager.js';
import { dragStart, dragEnd, dragOver, drop } from './dragAndDrop.js';

/**
* Renders an item's control buttons, including the increment value input.
* @param {number} index - The index of the item
* @param {string} name - The name of the item
* @param {number} count - The current count of the item
* @returns {string} HTML string for the item's controls
*/
function renderItemControls(index, name, count) {
   return `
       <span class="item-name" ondblclick="editItem(${index})">${name}</span>
       <span class="item-count">${count}</span>
       <button onclick="incrementItem(${index})" class="big-button">+</button>
       <input type="number"
              class="increment-value"
              value="1"
              min="1"
              onchange="validateIncrementValue(this)"
              style="width: 50px; text-align: center; margin: 0 5px; font-size: 16px;">
       <button onclick="decrementItem(${index})" class="small-button">-</button>
       <button onclick="clearItem(${index})" class="small-button">Clear</button>
   `;
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
       const itemDiv = document.createElement('div');
       itemDiv.className = 'item';
       itemDiv.draggable = true;
       itemDiv.style.width = `${maxWidth + 250}px`;
       itemDiv.innerHTML = renderItemControls(index, item.name, item.count);
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
   const dialogHtml = `
       <div class="edit-dialog">
           <input type="text" id="editItemName" value="${item.name}">
           <button onclick="updateItem(${index})">Save</button>
           <button onclick="deleteItem(${index})">Delete</button>
           <button onclick="closeEditDialog()">Cancel</button>
       </div>
   `;
   document.body.insertAdjacentHTML('beforeend', dialogHtml);
   document.getElementById('editItemName').focus();
}

/**
* Updates an item's name.
* @param {number} index - The index of the item to update
*/
export function updateItem(index) {
   const newName = document.getElementById('editItemName').value;
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
