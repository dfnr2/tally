/**
 * Import/Export Module
 * @version 3
 * @description Handles importing and exporting of profile data.
 *
 * @changelog
 * 3 - Added cookie state storage support
 * 2 - YAML support
 * 1 - Initial module version
 */

import { profiles, currentProfileIndex } from './app.js';
import { renderProfileSelector } from './profileManager.js';
import { renderItems } from './itemManager.js';

/**
 * Exports all profiles to a YAML file using the File System Access API.
 * Falls back to older download method if the API is not supported.
 */
export async function exportProfiles() {
    const dataToExport = {
        version: "2.3.0",
        profiles: profiles,
        defaultProfileIndex: currentProfileIndex
    };
    const yamlStr = jsyaml.dump(dataToExport, {
        indent: 2,
        lineWidth: -1,  // Don't wrap long lines
        noRefs: true    // Don't use YAML references
    });
    const blob = new Blob([yamlStr], {type: "text/yaml"});

    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'tally-profiles.yaml',
                types: [{
                    description: 'YAML File',
                    accept: {
                        'text/yaml': ['.yaml', '.yml']
                    },
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
    a.download = "tally-profiles.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Handles the import of profiles from YAML data
 * @param {string} yamlData - The YAML string to import
 */
export function handleImport(yamlData) {
    try {
        const importedData = jsyaml.load(yamlData);
        if (!importedData || !importedData.profiles) {
            throw new Error('Invalid YAML format: missing profiles');
        }
        profiles.length = 0; // Clear existing profiles
        profiles.push(...importedData.profiles);
        currentProfileIndex = importedData.defaultProfileIndex || 0;
        renderProfileSelector();
        renderItems();
    } catch (error) {
        console.error('Error parsing YAML:', error);
        alert('Invalid YAML file');
    }
}

//--------+---------+---------+---------+---------+---------+---------+---------+
// end of file
