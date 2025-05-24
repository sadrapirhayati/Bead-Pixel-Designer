<script setup lang="ts">
import { useEditorStore } from '@/stores/editorStore';

const store = useEditorStore();
</script>

<template>
  <div class="grid-settings">
    <!-- <h3>Grid Settings</h3> -->
    
    <div class="setting-group">
      <label>
        Cell Spacing: 
        <input type="number" v-model.number="store.gridConfig.spacing" min="0" max="10">
        <!-- <input type="range" v-model.number="store.gridConfig.spacing" min="0" max="10" step="1">
        {{ store.gridConfig.spacing }}px -->
      </label>
    </div>
    
    <div class="setting-group">
      <label>
        Border Width:
        <input type="number" v-model.number="store.gridConfig.borderWidth" min="0" max="10">
        <!-- <input type="range" v-model.number="store.gridConfig.borderWidth" min="0" max="5" step="1">
        {{ store.gridConfig.borderWidth }}px -->
      </label>
    </div>
    
    <div class="setting-group">
      <label>
        Grid Background:
        <input type="color" v-model="store.gridConfig.gridBackground">
      </label>
    </div>

    <div class="setting-group">
      <label>
        Border Color:
        <input type="color" v-model="store.gridConfig.borderColor">
      </label>
    </div>
    
    <div class="setting-group">
      <label>
        <input type="checkbox" v-model="store.gridConfig.showBorder">
        Show Borders:
      </label>
    </div>
    
    <div class="setting-group">
      <label>
        Cell Padding:
        <input type="number" v-model.number="store.gridConfig.cellPadding" min="0" max="10">
        <!-- <input type="range" v-model.number="store.gridConfig.cellPadding" min="0" max="10" step="1">
        {{ store.gridConfig.cellPadding }}px -->
      </label>
    </div>
  </div>
</template>

<style scoped>
.grid-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 20px;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input[type="range"] {
  width: 60%;
} */
</style>