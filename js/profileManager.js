/**
 * Profile Manager Module
 * @version 3
 * @description Handles all profile-related functionality including rendering,
 * creation, editing, and deletion of profiles.
 *
 * @changelog
 * 3 - Added cookie state storage support
 * 2 - Event listener architecture
 * 1 - Initial module version
 */

import { profiles } from './app.js';
import { renderItems } from './itemManager.js';
import { closeEditDialog } from './uiManager.js';
import { updateState } from './app.js';

let localCurrentProfileIndex = 0;

console.log('Loading profileManager.js');

export function initProfileManager(index) {
    localCurrentProfileIndex = index;
}

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

export function handleProfileChange() {
    const selectedValue = document.getElementById('profileSelector').value;
    if (selectedValue === 'add') {
        addProfile();
    } else {
        const newIndex = parseInt(selectedValue);
        localCurrentProfileIndex = newIndex;
        window.dispatchEvent(new CustomEvent('profileChanged', {
            detail: { newIndex }
        }));
        renderItems();
        updateState();  // Save state after profile change
    }
}

export function addProfile() {
    const title = prompt('Enter new profile name:');
    if (title) {
        profiles.push({ title, items: [] });
        const newIndex = profiles.length - 1;
        localCurrentProfileIndex = newIndex;
        window.dispatchEvent(new CustomEvent('profileChanged', {
            detail: { newIndex }
        }));
        renderProfileSelector();
        renderItems();
        updateState();  // Save state after adding profile
    } else {
        document.getElementById('profileSelector').value = localCurrentProfileIndex;
    }
}

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

export function updateProfile() {
    const input = document.getElementById('editProfileName');
    const newName = input.value;
    if (newName) {
        profiles[localCurrentProfileIndex].title = newName;
        closeEditDialog();
        renderProfileSelector();
        renderItems();
        updateState();  // Save state after profile update
    }
}

export function deleteProfile() {
    if (profiles.length > 1 && confirm('Are you sure you want to delete this profile?')) {
        profiles.splice(localCurrentProfileIndex, 1);
        localCurrentProfileIndex = 0;
        window.dispatchEvent(new CustomEvent('profileChanged', {
            detail: { newIndex: 0 }
        }));
        closeEditDialog();
        renderProfileSelector();
        renderItems();
        updateState();  // Save state after profile deletion
    } else if (profiles.length <= 1) {
        alert('Cannot delete the last profile.');
    }
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
