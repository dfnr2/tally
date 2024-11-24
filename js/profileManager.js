/**
* Profile Manager Module
* @version 2.2.0
* @description Handles all profile-related functionality including rendering,
* creation, editing, and deletion of profiles.
*/

import { profiles, currentProfileIndex } from './app.js';
import { renderItems } from './itemManager.js';
import { closeEditDialog } from './uiManager.js';

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
   selector.value = currentProfileIndex;
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
       currentProfileIndex = parseInt(selectedValue);
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
       currentProfileIndex = profiles.length - 1;
       renderProfileSelector();
       renderItems();
   } else {
       document.getElementById('profileSelector').value = currentProfileIndex;
   }
}

/**
* Opens the edit dialog for the current profile.
* Creates and displays a dialog with options to edit the profile name or delete the profile.
*/
export function editProfile() {
   const currentProfile = profiles[currentProfileIndex];
   const dialogHtml = `
       <div class="edit-dialog">
           <input type="text" id="editProfileName" value="${currentProfile.title}">
           <button onclick="updateProfile()">Save</button>
           <button onclick="deleteProfile()">Delete</button>
           <button onclick="closeEditDialog()">Cancel</button>
       </div>
   `;
   document.body.insertAdjacentHTML('beforeend', dialogHtml);
   document.getElementById('editProfileName').focus();
}

/**
* Updates the current profile's title.
* Retrieves the new name from the input field, updates the profile,
* closes the dialog, and re-renders the UI.
*/
export function updateProfile() {
   const newName = document.getElementById('editProfileName').value;
   if (newName) {
       profiles[currentProfileIndex].title = newName;
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
       profiles.splice(currentProfileIndex, 1);
       currentProfileIndex = 0;
       closeEditDialog();
       renderProfileSelector();
       renderItems();
   } else if (profiles.length <= 1) {
       alert('Cannot delete the last profile.');
   }
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
//
