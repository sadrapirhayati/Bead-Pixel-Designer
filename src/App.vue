<script setup lang="ts">
import Toolbar from './components/Toolbar.vue';
import CanvasRenderer from './components/CanvasRenderer.vue';
import ColorPalette from './components/ColorPalette.vue';
import LayerManager from './components/LayerManager.vue';
import { useEditorStore } from './stores/editorStore';

const store = useEditorStore();
</script>

<template>
  <div class="app">
    <h1>Bead Pixel Designer</h1>
    
    <Toolbar />
    <br>
    <div class="editor-container">
      <div class="sidebar">
        <LayerManager />
        <br>
        <ColorPalette />
      </div>

      <div class="canvas-wrapper">
        <CanvasRenderer :width="store.grid.width * store.cellSize.width * (store.gridType === 'hex' ? 1 : 1)" 
                        :height="store.grid.height * store.cellSize.height * (store.gridType === 'hex' ? 1 : 1)" />
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background: #fafafa;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
}

.canvas-wrapper {
  flex: 1;
  overflow: auto;
}

h1, h2, h3 {
  color: #333;
}
</style>