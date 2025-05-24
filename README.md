# Bead Pixel Desginer

A simple ethod responsive web application for creating and editing grid-based artwork with support for both square and hexagon grids, multiple layers, and advanced customization options.

// look at screenshot folder
![Screenshot of Bead Pixel Designer](screenshot\bead-pixel-designer-1.png)
![Screenshot of Bead Pixel Designer](screenshot\bead-pixel-designer-2.png)

## Features

- **Grid Types**: Toggle between square and hexagon grids
- **Layers**: Create and manage multiple layers with individual visibility control
- **Color Palette**: Customizable color palette with hex/RGB color picker
- **Advanced Tools**:
  - Undo/Redo functionality
  - Layer-wide coloring
  - Grid customization (spacing, borders, background)
- **Import/Export**: Save and load projects as JSON files
- **Responsive Design**: Works on desktop and mobile devices
- **Image Backgrounds**: Support for adding background images to your grid

## Technologies Used

- **Frontend**:
  - Vue.js 3 (Composition API)
  - TypeScript
  - D3.js (for grid rendering)
  - Pinia (state management)
- **Build Tools**:
  - Vite
  - npm

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
Project Structure
src/
├── assets/          # Static assets
├── components/      # Vue components
│   ├── CanvasRenderer.vue
│   ├── ColorPalette.vue
│   ├── LayerManager.vue
│   ├── Toolbar.vue
│   └── GridSettings.vue
├── stores/          # Pinia stores
│   └── editorStore.ts
├── types/           # TypeScript types
│   └── editorTypes.ts
├── utils/           # Utility functions
├── App.vue          # Main application component
└── main.ts          # Application entry point

# Usage Guide
Basic Controls
Grid Selection: Choose between square or hexagon grid types

Drawing: Click on cells to color them with the selected color

Layers:

Click the "+" button to add new layers

Toggle visibility with the eye icon

Click "Color Layer" to apply current color to all cells in the layer

# Advanced Features
Customization: Adjust grid spacing, border colors, and cell padding

History: Use Undo/Redo buttons to navigate through changes

Import/Export: Save your projects or load existing ones
