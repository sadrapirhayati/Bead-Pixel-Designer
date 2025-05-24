<script setup lang="ts">
import { useEditorStore } from '@/stores/editorStore';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const store = useEditorStore();
const newLayerName = ref('');
const isDragging = ref(false);
const dragItemIndex = ref<number | null>(null);

const createLayer = () => {
  if (newLayerName.value.trim()) {
    store.createNewLayer();
    if (store.activeLayer) {
      store.activeLayer.name = newLayerName.value;
    }
    newLayerName.value = '';
  }
};

const colorActiveLayer = () => {
  if (store.activeLayer) {
    store.colorAllCellsInLayer(store.selectedColor);
  }
};

const deleteLayer = (layerId: string, event: MouseEvent) => {
  event.stopPropagation();
  if (store.layers.length > 1) {
    store.deleteLayer(layerId);
  } else {
    alert("You can't delete the last layer");
  }
};

const onDragStart = (index: number) => {
  isDragging.value = true;
  dragItemIndex.value = index;
};

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (dragItemIndex.value !== null && dragItemIndex.value !== index) {
    const layers = [...store.layers];
    const draggedItem = layers[dragItemIndex.value];
    layers.splice(dragItemIndex.value, 1);
    layers.splice(index, 0, draggedItem);
    store.layers = layers;
    dragItemIndex.value = index;
  }
};

const onDragEnd = () => {
  isDragging.value = false;
  dragItemIndex.value = null;
};
</script>

<template>
  <div class="layer-manager">
    <div class="header">
      <h3 class="title">Layer Manager</h3>
      <div class="layer-count">{{ store.layers.length }} layer{{ store.layers.length !== 1 ? 's' : '' }}</div>
    </div>

    <div class="layer-list">
      <div 
        v-for="(layer, index) in store.layers" 
        :key="layer.id"
        class="layer-item"
        :class="{ 
          active: layer.id === store.activeLayerId,
          dragging: isDragging && dragItemIndex === index
        }"
        @click="store.activeLayerId = layer.id"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover="onDragOver($event, index)"
        @dragend="onDragEnd"
      >
        <div class="layer-visibility">
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="layer.visible" 
              @click.stop
            >
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="layer-info">
          <span class="layer-name">{{ layer.name }}</span>
          <span class="layer-id">ID: {{ layer.id.slice(0, 4) }}</span>
        </div>
        
        <button 
          class="delete-btn"
          @click.stop="deleteLayer(layer.id, $event)"
          title="Delete layer"
        >
          <Icon icon="mdi:trash-can-outline" width="16" />
        </button>
      </div>
    </div>
    
    <div class="layer-controls">
      <div class="input-group">
        <input 
          v-model="newLayerName" 
          placeholder="New layer name"
          @keyup.enter="createLayer"
          class="layer-input"
        >
        <button 
          @click="createLayer"
          class="add-btn"
          :disabled="!newLayerName.trim()"
        >
          <Icon icon="mdi:plus" width="16" />
          Add Layer
        </button>
      </div>
      
      <button 
        v-if="store.activeLayer" 
        @click="colorActiveLayer"
        class="color-btn"
      >
        <Icon icon="mdi:format-color-fill" width="16" />
        Fill Layer
      </button>
    </div>
  </div>
</template>

<style scoped>
.layer-manager {
  --primary-color: #4a6bdf;
  --primary-hover: #3a56c0;
  --danger-color: #ff4444;
  --danger-hover: #cc0000;
  --success-color: #28a745;
  --success-hover: #218838;
  --text-color: #2d3748;
  --light-text: #718096;
  --border-color: #e2e8f0;
  --bg-color: #f8fafc;
  --section-bg: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --radius-md: 8px;
  --radius-sm: 4px;
  --transition: all 0.2s ease;

  background: var(--section-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.layer-count {
  font-size: 0.8rem;
  color: var(--light-text);
  background: var(--bg-color);
  padding: 2px 8px;
  border-radius: 12px;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
  position: relative;
}

.layer-item:hover {
  background: #edf2f7;
  transform: translateX(2px);
}

.layer-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-hover);
}

.layer-item.dragging {
  opacity: 0.5;
  background: #e2e8f0;
}

.layer-visibility {
  display: flex;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: var(--transition);
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--success-color);
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.layer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layer-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-id {
  font-size: 0.7rem;
  color: var(--light-text);
  opacity: 0.7;
}

.layer-item.active .layer-id {
  color: rgba(255,255,255,0.7);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--light-text);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.delete-btn:hover {
  color: var(--danger-color);
  background: rgba(255, 68, 68, 0.1);
}

.layer-item.active .delete-btn {
  color: rgba(255,255,255,0.8);
}

.layer-item.active .delete-btn:hover {
  color: white;
  background: rgba(255,255,255,0.2);
}

.layer-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.layer-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  transition: var(--transition);
}

.layer-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
}

.add-btn, .color-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.add-btn {
  background-color: var(--primary-color);
  color: white;
}

.add-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.add-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.color-btn {
  background-color: var(--success-color);
  color: white;
  justify-content: center;
}

.color-btn:hover {
  background-color: var(--success-hover);
  transform: translateY(-1px);
}

/* Custom scrollbar */
.layer-list::-webkit-scrollbar {
  width: 6px;
}

.layer-list::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 3px;
}

.layer-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.layer-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>