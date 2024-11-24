/**
 * Tally App - Main Application Module
 * @version 2.2.0
 * @description This is the main entry point for the Tally App.
 * It initializes the application and manages the global state.
 */

import { renderProfileSelector, handleProfileChange, editProfile } from './profileManager.js';
import { renderItems, addItem, clearAll } from './itemManager.js';
import { exportProfiles, handleImport } from './importExport.js';

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
 * Initializes the application
 * Sets up event listeners and renders the initial state
 */
function init() {
    // Initial render
    renderProfileSelector();
    renderItems();

    // Set up event listeners
    document.getElementById('profileSelector').addEventListener('change', handleProfileChange);
    document.getElementById('pageTitle').addEventListener('dblclick', editProfile);
    document.getElementById('addItemBtn').addEventListener('click', addItem);
    document.getElementById('exportBtn').addEventListener('click', exportProfiles);
    document.getElementById('importBtn').addEventListener('click', () =>
        document.getElementById('importFile').click()
    );
    document.getElementById('importFile').addEventListener('change', handleImport);
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);
}

// Initialize the application
init();
//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
