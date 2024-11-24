/**
* UI Manager Module
* @version 2.2.0
* @description Handles generic UI functionality that doesn't fit into other
* specific modules, such as dialog management.
*/

/**
* Closes any open edit dialog.
* Finds and removes any dialog element currently in the DOM.
*/
export function closeEditDialog() {
   const dialog = document.querySelector('.edit-dialog');
   if (dialog) {
       dialog.remove();
   }
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
