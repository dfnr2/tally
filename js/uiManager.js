/**
 * UI Manager Module
 * @version 3
 * @description Handles generic UI functionality.
 *
 * @changelog
 * 3 - Added cookie state storage support
 * 2 - Event listener architecture
 * 1 - Initial module version
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

// Add functions to window object for HTML event handlers
window.closeEditDialog = closeEditDialog;
//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
