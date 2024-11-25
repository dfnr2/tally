/**
 * Profile Manager Module
 * @version 2.3.0
 * @description Handles all profile-related functionality including rendering,
 * creation, editing, and deletion of profiles.
 *
 * @changelog
 * 2.3.0 - Updated to use event listeners instead of inline handlers
 * 2.2.0 - Added increment value feature
 * 2.1.0 - Added file dialog for export
 * 2.0.0 - Initial module version
 */

import { profiles } from './app.js';
import { renderItems } from './itemManager.js';
import { closeEditDialog } from './uiManager.js';

let localCurrentProfileIndex = 0;  // Initialize to 0 first

/**
 * Initializes the profile manager with the current index
 * @param {number} index - The initial profile index
 */
export function initProfileManager(index) {
    localCurrentProfileIndex = index;
}

/**
 * Renders the profile selector dropdown.
 * Populates the dropdown with profile titles and an "Add Profile" option.
 */
export function renderProfileSelector() {
    const selector = document.getElementById('profileSelector');
    selector.innerHTML = '';
    profiles.forEach((profile, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = profile.title;
        selector.appendChild(option);
    });
    const addOption = document.createElement('option');
    addOption.value = 'add';
    addOption.textContent = '+ Add Profile';
    selector.appendChild(addOption);
    selector.value = localCurrentProfileIndex;
}

/**
 * Updates the current profile index and triggers any necessary updates
 * @param {number} index - The new profile index
 */
export function setCurrentProfileIndex(index) {
    localCurrentProfileIndex = index;
    renderProfileSelector();
    renderItems();
}

/**
 * Handles changes in the profile selector.
 * If "Add Profile" is selected, calls addProfile().
 * Otherwise, updates the currentProfileIndex and renders items.
 */
export function handleProfileChange() {
    const selectedValue = document.getElementById('profileSelector').value;
    if (selectedValue === 'add') {
        addProfile();
    } else {
        const newIndex = parseInt(selectedValue);
        localCurrentProfileIndex = newIndex;
        // Update the global state
        window.dispatchEvent(new CustomEvent('profileChanged', {
            detail: { newIndex }
        }));
        renderItems();
    }
}

/**
 * Adds a new profile.
 * Prompts the user for a profile name, adds it to the profiles array,
 * updates the currentProfileIndex, and re-renders the UI.
 */
export function addProfile() {
    const title = prompt('Enter new profile name:');
    if (title) {
        profiles.push({ title, items: [] });
        // Set new index
        const newIndex = profiles.length - 1;
        localCurrentProfileIndex = newIndex;
        // Update global state
        window.dispatchEvent(new CustomEvent('profileChanged', {
            detail: { newIndex }
        }));
        // Update UI
        renderProfileSelector();
        renderItems();  // This should now show the empty list for the new profile
    } else {
        document.getElementById('profileSelector').value = localCurrentProfileIndex;
    }
}

/**
 * Opens the edit dialog for the current profile.
 * Creates and displays a dialog with options to edit the profile name or delete the profile.
 */
export function editProfile() {
    const currentProfile = profiles[localCurrentProfileIndex];
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'editProfileName';
    input.value = currentProfile.title;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', updateProfile);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteProfile);

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
 * Updates the current profile's title.
 * Retrieves the new name from the input field, updates the profile,
 * closes the dialog, and re-renders the UI.
 */
export function updateProfile() {
    const input = document.getElementById('editProfileName');
    const newName = input.value;
    if (newName) {
        profiles[localCurrentProfileIndex].title = newName;
        closeEditDialog();
        renderProfileSelector();
        renderItems();
    }
}

/**
 * Deletes the current profile.
 * Confirms with the user before deleting. Prevents deletion of the last profile.
 * Updates the currentProfileIndex and re-renders the UI after deletion.
 */
export function deleteProfile() {
    if (profiles.length > 1 && confirm('Are you sure you want to delete this profile?')) {
        profiles.splice(localCurrentProfileIndex, 1);
        setCurrentProfileIndex(0);
        closeEditDialog();
    } else if (profiles.length <= 1) {
        alert('Cannot delete the last profile.');
    }
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
