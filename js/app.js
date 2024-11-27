/**
 * Tally App - Main Application Module
 * @version 2.4.0
 * @description Entry point for the Tally App. Initializes the application,
 * manages global state, and sets up event handlers.
 *
 * @changelog
 * 2.4.0 - Added cookie-based storage for profiles
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

const COOKIE_NAME = 'tallyAppProfiles';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Saves the current state to a cookie
 */
function saveStateToCookie() {
    const data = {
        version: "2.4.0",
        profiles: profiles,
        defaultProfileIndex: currentProfileIndex
    };
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Loads the state from cookie if available
 * @returns {boolean} true if state was loaded successfully
 */
function loadStateFromCookie() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(COOKIE_NAME));

    if (cookieValue) {
        try {
            const data = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
            profiles.length = 0;
            profiles.push(...data.profiles);
            currentProfileIndex = data.defaultProfileIndex || 0;
            return true;
        } catch (error) {
            console.error('Error loading state from cookie:', error);
            return false;
        }
    }
    return false;
}

/**
 * Updates the stored state and triggers a cookie save
 */
export function updateState() {
    saveStateToCookie();
}

// Add this to the existing setupEventListeners function
function setupEventListeners() {
    const importFileInput = document.getElementById('importFile');

    document.getElementById('pageTitle').addEventListener('dblclick', editProfile);
    document.getElementById('profileSelector').addEventListener('change', handleProfileChange);
    document.getElementById('addItemBtn').addEventListener('click', addItem);
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    // Add listener for profile changes
    window.addEventListener('profileChanged', (e) => {
        currentProfileIndex = e.detail.newIndex;
        updateState();  // Save state when profile changes
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = jsyaml.load(e.target.result);
                    profiles.length = 0;
                    profiles.push(...importedData.profiles);
                    currentProfileIndex = importedData.defaultProfileIndex || 0;
                    initProfileManager(currentProfileIndex);
                    renderProfileSelector();
                    renderItems();
                    updateState();  // Save state after import
                } catch (error) {
                    console.error('Error parsing YAML:', error);
                    alert('Invalid YAML file');
                }
            };
            reader.readAsText(file);
        }
    });
}

/**
 * Initializes the application
 */
function init() {
    // Try to load state from cookie first
    if (!loadStateFromCookie()) {
        // If no cookie exists, use default state
        console.log('No saved state found, using defaults');
    }

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
