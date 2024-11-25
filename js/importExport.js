/**
 * Import/Export Module
 * @version 2.3.0
 * @description Handles importing and exporting of profile data, including
 * file system interactions and data validation.
 *
 * @changelog
 * 2.3.0 - Updated to use event listeners instead of inline handlers
 * 2.2.0 - Added increment value feature
 * 2.1.0 - Added file dialog for export
 * 2.0.0 - Initial module version
 */

import { profiles, currentProfileIndex } from './app.js';
import { renderProfileSelector } from './profileManager.js';
import { renderItems } from './itemManager.js';

/**
 * Exports all profiles to a JSON file using the File System Access API.
 * Falls back to older download method if the API is not supported.
 */
export async function exportProfiles() {
    const dataToExport = {
        version: "2.3.0",
        profiles: profiles,
        defaultProfileIndex: currentProfileIndex
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});

    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'tally-profiles.json',
                types: [{
                    description: 'JSON File',
                    accept: {'application/json': ['.json']},
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to save file:', err);
                fallbackExport(blob);
            }
        }
    } else {
        fallbackExport(blob);
    }
}

/**
 * Fallback export method for browsers that don't support the File System Access API.
 * @param {Blob} blob - The data blob to export
 */
function fallbackExport(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tally-profiles.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
