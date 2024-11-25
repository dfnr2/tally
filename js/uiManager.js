/**
 * UI Manager Module
 * @version 2.3.0
 * @description Handles generic UI functionality that doesn't fit into other
 * specific modules, such as dialog management.
 *
 * @changelog
 * 2.3.0 - Updated to use event listeners instead of inline handlers
 * 2.2.0 - Added increment value feature
 * 2.1.0 - Added file dialog for export
 * 2.0.0 - Initial module version
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
