<script setup lang="ts">
import { useEditorStore } from '@/stores/editorStore';
import { saveAs } from 'file-saver';
import { ref } from 'vue';

const store = useEditorStore();
const importInputRef = ref<HTMLInputElement>();

const exportProject = () => {
  const project = {
    gridType: store.gridType,
    gridSize: store.gridSize,
    cellSize: store.cellSize,
    layers: store.layers,
    colorPalette: store.colorPalette,
    gridConfig: store.gridConfig
  };
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  saveAs(blob, `grid-project-${new Date().toISOString().slice(0,10)}.json`);
};

const importProject = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string);
        if (project.gridType &&
            project.gridSize &&
            project.cellSize &&
            project.layers &&
            project.colorPalette
        ) {
          store.gridType = project.gridType;
          store.gridSize = project.gridSize;
          store.cellSize = project.cellSize;
          store.layers = project.layers;
          store.colorPalette = project.colorPalette;
          store.activeLayerId = project.layers[0]?.id || null;
          if (project.gridConfig) {
            store.gridConfig = project.gridConfig;
          }
        } else {
          throw new Error('Invalid project file format');
        }
      } catch (error) {
        alert('Error loading project file: ' + (error as Error).message);
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(input.files[0]);
  }
};

const triggerImport = () => {
  if (importInputRef.value) {
    importInputRef.value.value = '';
    importInputRef.value.click();
  }
};


const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      store.setGridBackgroundImage(imageData);
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const removeBackgroundImage = () => {
  store.setGridBackgroundImage(null);
};


</script>

<template>
  <div class="toolbar-container">
    <div class="toolbar">
      <div class="toolbar-section">
        <h3 class="section-title">Grid Settings</h3>
        <div class="form-group">
          <label class="form-label">
            <span>Grid Type</span>
            <select v-model="store.gridType" class="form-select">
              <option value="square">Square Grid</option>
              <option value="hex">Hex Grid</option>
            </select>
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Cell Size</span>
            <div>
              <input 
                type="number" 
                v-model.number="store.cellSize.width" 
                min="5" 
                max="100"
                class="form-input cell-size"
              >
              <span> /  </span>
              <input 
                type="number" 
                v-model.number="store.cellSize.height" 
                min="5" 
                max="100"
                class="form-input cell-size"
              >
            </div>
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Grid Width</span>
            <input 
              type="number" 
              v-model.number="store.gridSize.width" 
              min="2" 
              max="100"
              class="form-input"
            >
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Grid Height</span>
            <input 
              type="number" 
              v-model.number="store.gridSize.height" 
              min="2" 
              max="100"
              class="form-input"
            >
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>Grid Background Image</span>
            <button @click="triggerFileInput">Browse</button>
            <input 
              type="file" 
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleImageUpload"
            >
            <button 
              v-if="store.gridConfig.gridBackgroundImage" 
              @click="removeBackgroundImage"
            >
              Remove
            </button>
          </label>
    
          <div v-if="store.gridConfig.gridBackgroundImage" class="image-options">
            <label>
              Size:
              <select v-model="store.gridConfig.gridBackgroundSize">
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="repeat">Repeat</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div  class="toolbar-section">
        <h3 class="section-title">Advance Settings</h3>
        <div class="form-group">
          <label class="form-label">
            <span>Cell Spacing</span>
            <input 
              type="number" 
              v-model.number="store.gridConfig.spacing" 
              min="0" 
              max="20"
              class="form-input"
            >
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Border Width</span>
            <input 
              type="number" 
              v-model.number="store.gridConfig.borderWidth" 
              min="0" 
              max="10"
              class="form-input"
            >
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Grid Background</span>
            <input 
              type="color" 
              v-model.number="store.gridConfig.gridBackground" 

            >
          </label>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span>Border Color</span>
            <input 
              type="color" 
              v-model.number="store.gridConfig.borderColor" 
              
            >
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>Show Border</span>
            <input 
              type="checkbox" 
              v-model.number="store.gridConfig.showBorder" 
            >
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>Cell Padding</span>
            <input 
              type="number" 
              v-model.number="store.gridConfig.cellPadding" 
              min="0" 
              max="30"
              class="form-input"
            >
          </label>
        </div>        
      </div>
      
      <div class="toolbar-section">
        <h3 class="section-title">History</h3>
        <div class="button-group">
          <button 
            @click="store.undo" 
            :disabled="store.historyIndex <= 0"
            class="toolbar-btn"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
            </svg>
            Undo
          </button>
          <button 
            @click="store.redo" 
            :disabled="store.historyIndex >= store.history.length - 1"
            class="toolbar-btn"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />
            </svg>
            Redo
          </button>
        </div>
      </div>
      
      <div class="toolbar-section">
        <h3 class="section-title">Project</h3>
        <div class="button-group">
          <button @click="exportProject" class="toolbar-btn export-btn">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Export
          </button>

          <button @click="triggerImport" class="toolbar-btn import-btn">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Import
          </button>
          <input 
            ref="importInputRef"
            type="file" 
            accept=".json" 
            @change="importProject" 
            class="file-input"
            style="display: none"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-container {
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
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px;
  background: var(--section-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: var(--radius-sm);
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--light-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--text-color);
}

.form-label span {
  font-weight: 500;
}

.form-input, .form-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  transition: var(--transition);
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
}

/* .form-input {
  width: 100%;
} */

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.toolbar-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.toolbar-btn:active {
  transform: translateY(0);
}

.toolbar-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.toolbar-btn .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

button {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.image-options {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.export-btn {
  background-color: var(--success-color);
}

.export-btn:hover {
  background-color: var(--success-hover);
}

.import-btn {
  position: relative;
  background-color: var(--primary-color);
}

.import-btn:hover {
  background-color: var(--primary-hover);
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 16px;
  }
  
  .toolbar-section {
    min-width: 100%;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .toolbar-btn {
    justify-content: center;
  }
}
</style>