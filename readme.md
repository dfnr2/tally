# Tally App

## Version 2.3.0

A multi-profile tally counter application built with vanilla JavaScript.

## Description

Tally App is a versatile, browser-based application that allows users to create and manage multiple tally profiles. Each profile can contain a list of items that can be individually counted. The app features a dark theme and a responsive design, making it suitable for various devices and environments.

## Features

- Multiple tally profiles
- Add, edit, delete, and reorder items within profiles
- Increment, decrement, and clear item counts
- ```inrement``` register for each row. Type in a number and the tally can be
  incremented or decremented by the amount in the register, which is then reset
  to the default value (1).
- Export and import functionality for all profiles
- Responsive design with a max-width of 800px
- Drag-and-drop functionality for reordering items
- Store profiles in cookie to avoid need for reloading when using same browser

- Spreadsheet row count calculator. Yes, it's the simplest formula in the world:
  ```1 + last - first``` but the calculator can avoid errors, and the number can
  be inserted directly into the increment value for an item for quick tallying.


## Installation

1. Clone the repository:

``` sh
git clone https://github.com/yourusername/tally-app.git
```

git clone https://github.com/yourusername/tally-app.git

2. Open `index.html` in your web browser.

No additional installation or setup is required as this is a client-side application.

## Usage

1. Profile Management:
- Select a profile from the dropdown menu in the top-right corner
- To add a new profile, select "+ Add Profile" from the dropdown
- Double-click the profile name (page title) to edit or delete the current profile

2. Item Management:
- Click "Add Item" to create a new item in the current profile
- Double-click an item name to edit or delete it
- Use the "+" button to increment an item's count
- Use the "-" button to decrement an item's count
- Use the "Clear" button to reset an item's count to zero
- Drag and drop items to reorder them within the profile

3. General Functions:
- Click "Clear All" to reset all item counts in the current profile to zero
- Click "Export Profiles" to save all profiles as a JSON file
- Click "Import Profiles" to load profiles from a previously exported JSON file

## Browser Compatibility

This application uses modern JavaScript features and APIs. It is compatible with the latest versions of major browsers (Chrome, Firefox, Safari, Edge). The file save dialog feature requires a modern browser that supports the File System Access API.

## Contributing

Contributions to the Tally App are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Changelog

- 2.1.0 - Updated export functionality to use file dialog
- 2.0.0 - Added multi-profile support
- 1.0.0 - Initial release with basic tally functionality

## Contact

If you have any questions, feel free to reach out to [Your Name] at [your.email@example.com].
