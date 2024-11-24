/**
* Drag and Drop Module
* @version 2.2.0
* @description Handles all drag and drop functionality for reordering items
* within a profile.
*/

import { profiles, currentProfileIndex } from './app.js';
import { renderItems } from './itemManager.js';

/**
* Initiates the drag operation.
* @param {DragEvent} e - The drag start event
*/
export function dragStart(e) {
   e.target.classList.add('dragging');
}

/**
* Ends the drag operation.
* @param {DragEvent} e - The drag end event
*/
export function dragEnd(e) {
   e.target.classList.remove('dragging');
}

/**
* Handles the drag over event to determine drop position.
* @param {DragEvent} e - The drag over event
*/
export function dragOver(e) {
   e.preventDefault();
   const afterElement = getDragAfterElement(e.clientY);
   const draggable = document.querySelector('.dragging');
   if (draggable !== e.target) {
       if (afterElement == null) {
           e.target.parentNode.appendChild(draggable);
       } else {
           e.target.parentNode.insertBefore(draggable, afterElement);
       }
   }
}

/**
* Handles the drop event to finalize item reordering.
* @param {DragEvent} e - The drop event
*/
export function drop(e) {
   e.preventDefault();
   const draggableElements = [...document.querySelectorAll('.item')];
   profiles[currentProfileIndex].items = draggableElements.map(itemElement => {
       const nameElement = itemElement.querySelector('.item-name');
       const countElement = itemElement.querySelector('.item-count');
       return {
           name: nameElement.textContent,
           count: parseInt(countElement.textContent)
       };
   });
   renderItems();
}

/**
* Determines the element after which a dragged item should be placed.
* @param {number} y - The current vertical position of the mouse
* @returns {Element|null} The element after which to place the dragged item
*/
function getDragAfterElement(y) {
   const draggableElements = [...document.querySelectorAll('.item:not(.dragging)')];
   return draggableElements.reduce((closest, child) => {
       const box = child.getBoundingClientRect();
       const offset = y - box.top - box.height / 2;
       if (offset < 0 && offset > closest.offset) {
           return { offset: offset, element: child };
       } else {
           return closest;
       }
   }, { offset: Number.NEGATIVE_INFINITY }).element;
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
