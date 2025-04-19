# 📝 Page Pencil – Chrome Extension

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-MV3-4285F4?style=flat&logo=google-chrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-5F6368?style=flat&logo=google-chrome&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black)
![IndexedDB](https://img.shields.io/badge/IndexedDB-4479A1?style=flat&logo=database&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Build](https://img.shields.io/badge/Build-NPM%20Run%20Build-blue?style=flat&logo=npm&logoColor=white)

**Page Pencil** is a versatile note-taking tool with multimedia support, designed to help users take notes, highlight text, and organize information directly within their browser.

---

## Features

- **Note-Taking**: Add notes to any webpage.
- **Text Highlighting**: Highlight important text on webpages.
- **Multimedia Support**: Attach images, links, and tags to notes.
- **Search Functionality**: Easily search through your notes.
- **Popup Interface**: Access your notes and settings via a user-friendly popup.
- **Background Sync**: Notes are saved and synced in the background.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Vishwa-Vijith/PagePencil.git
   cd PagePencil
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```
   This will generate the `dist` folder containing the built extension.

4. **Load the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable Developer Mode (toggle in the top-right corner).
   - Click **Load unpacked** and select the `dist` folder.

---

## Usage

### Open the Popup
- Click the Extensions icon (puzzle piece) in the Chrome toolbar.
- Find **Page Pencil** and click the pin icon to keep it visible in the toolbar.
- Click the **Page Pencil** icon to open the popup.

### Take Notes
- Use the **Add Note** button to create a new note.
- Highlight text on any webpage and click the **Highlight** button to save it as a note.

### Search Notes
Use the search bar in the popup to find specific notes.

### Manage Notes
- View, edit, or delete notes from the popup interface.

---

## Project Structure
```
pagepencil/
├── src/
│   ├── content-script/      # Content scripts for interacting with webpages
│   ├── popup/               # Popup UI and scripts
│   ├── service-worker/      # Background scripts for syncing and storage
│   └── shared-scripts/      # Shared scripts and styles
├── public/                  # Static assets (manifest.json, icons, etc.)
├── dist/                    # Built extension files (generated after build)
├── .gitignore               # Specifies files to ignore in Git
├── README.md                # This file
├── LICENSE                  # License file
├── package.json             # Lists dependencies and scripts
├── webpack.config.js        # Webpack configuration file
└── .babelrc                 # Babel configuration file (if using Babel)
```

---

## Development

### Running the Project Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This will watch for changes and rebuild the project automatically.

3. **Load the Extension in Chrome**:
   Follow the same steps as in the Installation section to load the extension.

---

## Building the Project

To build the project for production:
```bash
npm run build
```

---

## Contributing
We welcome contributions! Here’s how you can help:

### Fork the Repository
Click the **Fork** button on the GitHub page.

### Clone Your Fork
```bash
git clone https://github.com/Vishwa-Vijith/PagePencil.git
cd PagePencil
```

### Create a New Branch
```bash
git checkout -b feature/your-feature-name
```

### Make Changes
Make your changes and test them locally.

### Commit and Push
```bash
git add .
git commit -m "Hover parent element to get Highlights"
git push origin feature/get-highlights
```

### Create a Pull Request
Go to the original repository and click **New Pull Request**.

---

## License
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat)

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments
- Thanks to **Webpack** for the build tool.
- Thanks to **Chrome Extensions Documentation** for guidance.

---

## Contact  
For questions or feedback, feel free to reach out:  

**Vishwa Vijith**: VishwaVijith@outlook.com  
**GitHub**: [VishwaVijith](https://github.com/VishwaVijith)  


