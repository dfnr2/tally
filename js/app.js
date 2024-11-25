/**
* Tally App - Main Application Module
* @version 2.3.0
* @description Entry point for the Tally App. Initializes the application,
* manages global state, and sets up event handlers.
*
* @changelog
* 2.3.0 - Updated to use event listeners instead of inline handlers
* 2.2.0 - Added increment value feature
* 2.1.0 - Added file dialog for export
* 2.0.0 - Initial module version
*/

import { renderProfileSelector, handleProfileChange, editProfile, initProfileManager }
   from './profileManager.js';
import { renderItems, addItem, clearAll } from './itemManager.js';
import { exportProfiles } from './importExport.js';

// Global state
export let profiles = [
   {
       title: "Radiology Procedures",
       items: [
           {name: "MRI", count: 0},
           {name: "CT", count: 0},
           {name: "X-Ray", count: 0},
           {name: "DEXA", count: 0},
           {name: "Ultrasound", count: 0},
           {name: "GI Fluoro", count: 0},
           {name: "Arthrogram", count: 0},
           {name: "Myelogram", count: 0},
           {name: "FNA", count: 0},
           {name: "Med Injection", count: 0}
       ]
   }
];
export let currentProfileIndex = 0;

/**
 * Sets up event listeners for the main UI elements
 */
function setupEventListeners() {
    const importFileInput = document.getElementById('importFile');

    document.getElementById('pageTitle').addEventListener('dblclick', editProfile);
    document.getElementById('profileSelector').addEventListener('change', handleProfileChange);
    document.getElementById('addItemBtn').addEventListener('click', addItem);
    document.getElementById('exportBtn').addEventListener('click', exportProfiles);
    document.getElementById('importBtn').addEventListener('click', () => importFileInput.click());
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    // Add listener for profile changes
    window.addEventListener('profileChanged', (e) => {
        currentProfileIndex = e.detail.newIndex;
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => handleImport(e.target.result);
            reader.readAsText(file);
        }
    });
}

/**
* Handles the import of profiles from JSON data
* @param {string} jsonData - The JSON string to import
*/
function handleImport(jsonData) {
   try {
       const importedData = JSON.parse(jsonData);
       profiles = importedData.profiles || [];
       currentProfileIndex = importedData.defaultProfileIndex || 0;
       initProfileManager(currentProfileIndex);
       renderProfileSelector();
       renderItems();
   } catch (error) {
       console.error('Error parsing JSON:', error);
       alert('Invalid JSON file');
   }
}

/**
* Initializes the application
*/
function init() {
   // Initialize modules
   initProfileManager(currentProfileIndex);

   // Set up event listeners
   setupEventListeners();

   // Initial render
   renderProfileSelector();
   renderItems();
}

// Initialize the application
init();

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
