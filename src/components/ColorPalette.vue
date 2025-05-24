<script setup lang="ts">
import { ref } from 'vue';
import { useEditorStore } from '@/stores/editorStore';

const store = useEditorStore();
const showColorPicker = ref(false);
const newColorInput = ref('');
const draggedIndex = ref<number | null>(null);
const showHexCodes = ref(false);

const addNewColor = () => {
  showColorPicker.value = true;
  newColorInput.value = store.selectedColor || '#ffffff';
};

const confirmAddColor = () => {
  const color = newColorInput.value.trim();
  if (color && !store.colorPalette.includes(color)) {
    store.colorPalette.push(color);
  }
  newColorInput.value = '';
  showColorPicker.value = false;
};

const removeColor = (color: string, index: number, event: MouseEvent) => {
  event.preventDefault();
  if (store.colorPalette.length > 1) {
    store.colorPalette.splice(index, 1);
    if (store.selectedColor === color) {
      store.selectedColor = store.colorPalette[0];
    }
  }
};

const onDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
    event.dataTransfer.setDragImage(event.target as HTMLElement, 20, 20);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const movedColor = store.colorPalette[draggedIndex.value];
    store.colorPalette.splice(draggedIndex.value, 1);
    store.colorPalette.splice(targetIndex, 0, movedColor);
    draggedIndex.value = null;
  }
};

const copyToClipboard = (color: string) => {
  navigator.clipboard.writeText(color);
};
</script>

<template>
  <div class="color-palette-container">
    <div class="color-palette">
      <div class="header">
        <h3>Color Palette</h3>
        <div class="controls">
          <button 
            class="toggle-hex-btn" 
            @click="showHexCodes = !showHexCodes"
            :title="showHexCodes ? 'Hide color codes' : 'Show color codes'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
          </button>
          <button class="add-btn" @click="addNewColor" title="Add new color">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="color-grid">
        <div 
          v-for="(color, index) in store.colorPalette" 
          :key="index"
          class="color-swatch-container"
          @click="store.selectedColor = color"
          @contextmenu.prevent="removeColor(color, index, $event)"
          draggable="true"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver"
          @drop="onDrop($event, index)"
          :class="{ 
            active: color === store.selectedColor,
            dragging: draggedIndex === index
          }"
        >
          <div 
            class="color-swatch"
            :style="{ backgroundColor: color }"
          >
            <span v-if="showHexCodes" class="color-hex" @click.stop="copyToClipboard(color)">
              {{ color.length > 8 ? color.substring(0, 8) + '...' : color }}
            </span>
          </div>
          <button 
            v-if="store.colorPalette.length > 1"
            class="remove-btn"
            @click.stop="removeColor(color, index, $event)"
            title="Remove color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <input 
          type="color" 
          v-model="store.selectedColor" 
          class="native-color-picker"
          title="Select color"
        >
      </div>
    </div>

    <div v-if="showColorPicker" class="color-picker-modal">
      <div class="modal-content">
        <h4>Add New Color</h4>
        <div class="input-group">
          <input 
            type="text" 
            v-model="newColorInput" 
            placeholder="Enter color (hex, rgb, or name)"
            @keyup.enter="confirmAddColor"
          >
          <input 
            type="color" 
            v-model="newColorInput"
            title="Pick a color"
          >
        </div>
        <div class="modal-actions">
          <button @click="showColorPicker = false" class="cancel-btn">Cancel</button>
          <button @click="confirmAddColor" class="confirm-btn">Add Color</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-palette-container {
  --primary-color: #4a6bdf;
  --hover-color: #3a56c0;
  --danger-color: #ff4444;
  --danger-hover: #cc0000;
  --text-color: #333;
  --light-text: #777;
  --border-color: #ddd;
  --bg-color: #f8f9fa;
  --modal-bg: rgba(0, 0, 0, 0.4);
  --transition-speed: 0.2s;
}

.color-palette {
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 8px;
}

button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  padding: 0;
}

button:hover {
  background: var(--hover-color);
  transform: translateY(-1px);
}

.toggle-hex-btn {
  background: #f0f0f0;
  color: var(--text-color);
}

.toggle-hex-btn:hover {
  background: #e0e0e0;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 12px;
}

.color-swatch-container {
  position: relative;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.color-swatch-container.active {
  transform: translateY(-2px);
}

.color-swatch-container.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.color-swatch {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed) ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.color-swatch-container.active .color-swatch {
  border: 2px solid var(--primary-color);
  box-shadow: 0 4px 8px rgba(74, 107, 223, 0.3);
}

.color-swatch-container:hover .color-swatch {
  transform: scale(1.05);
}

.color-hex {
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.65rem;
  padding: 2px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.color-hex:hover {
  background: rgba(0, 0, 0, 0.8);
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: var(--danger-color);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-speed) ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.color-swatch-container:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: var(--danger-hover);
  transform: scale(1.1);
}

.native-color-picker {
  width: 48px;
  height: 48px;
  border: none;
  cursor: pointer;
  opacity: 0;
  position: absolute;
}

.color-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text-color);
  font-size: 1.2rem;
}

.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.input-group input[type="text"] {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color var(--transition-speed);
}

.input-group input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(74, 107, 223, 0.2);
}

.input-group input[type="color"] {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-actions button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 80px;
  height: auto;
}

.cancel-btn {
  background: #f0f0f0;
  color: var(--text-color);
}

.cancel-btn:hover {
  background: #e0e0e0;
  transform: none;
}

.confirm-btn {
  background: var(--primary-color);
}

.confirm-btn:hover {
  background: var(--hover-color);
}
</style>