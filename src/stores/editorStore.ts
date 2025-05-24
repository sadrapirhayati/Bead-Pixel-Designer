import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { HexGrid,
            SquareGrid,
            type Cell,
            type GridType,
            type Layer,
            type EditorState } from '../types/editorTypes'

export const useEditorStore = defineStore('editor', () => {
  // State
  const gridType = ref<GridType>('square');
  const gridSize = ref({ width: 12, height: 5 });
  const cellSize = ref({ width: 50, height: 50 });
  const layers = ref<Layer[]>([]);
  const activeLayerId = ref<string | null>(null);
  const colorPalette = ref<string[]>(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF']);
  const selectedColor = ref('#FF0000');
  const history = ref<EditorState[]>([]);
  const historyIndex = ref(-1);

  const gridConfig = ref({
    spacing: 0, // pixels between cells
    borderColor: '#cccccc',
    borderWidth: .1,
    showBorder: true,
    cellPadding: 0, // inner padding
    gridBackground: '#ffffff',
    gridBackgroundImage: null as string | null, // Will store base64 encoded image
    gridBackgroundSize: 'cover' as 'cover' | 'contain' | 'repeat',
    showGridBackgroundImage: true,
    alternateColor: '#f5f5f5',
    useAlternateColor: true,
    gridPattern: 'solid'
  });

  // Getters
  const activeLayer = computed(() => layers.value.find(layer => layer.id === activeLayerId.value));
  const grid = computed(() => {
    return gridType.value === 'hex' 
      ? new HexGrid(gridSize.value.width, gridSize.value.height, cellSize.value)
      : new SquareGrid(gridSize.value.width, gridSize.value.height, cellSize.value);
  });

  // Actions
  function createNewLayer() {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.value.length + 1}`,
      cells: {},
      visible: true
    };
    layers.value.push(newLayer);
    activeLayerId.value = newLayer.id;
    saveState();
  }

  function deleteLayer(layerId: string) {

  }

  function setCellColor(x: number, y: number, color: string) {
    if (!activeLayer.value) return;
    // console.log(x)
    // console.log(y)
    const cellId = `${x},${y}`;
    activeLayer.value.cells[cellId] = { x, y, color };
    saveState();
  }

  function colorAllCellsInLayer(color: string) {
    if (!activeLayer.value) return;
    
    grid.value.getAllCoordinates().forEach(({x, y}) => { 
      const cellId = `${x},${y}`;
      activeLayer.value!.cells[cellId] = { x, y, color };
    });
    saveState();
  }

  function saveState() {
    // Truncate any future states if we're in the middle of history
    history.value = history.value.slice(0, historyIndex.value + 1);
    
    const state: EditorState = {
      gridType: gridType.value,
      layers: JSON.parse(JSON.stringify(layers.value)),
      activeLayerId: activeLayerId.value
    };
    
    history.value.push(state);
    historyIndex.value = history.value.length - 1;
  }

  function undo() {
    if (historyIndex.value <= 0) return;
    
    historyIndex.value--;
    const state = history.value[historyIndex.value];
    applyState(state);
  }

  function redo() {
    if (historyIndex.value >= history.value.length - 1) return;
    
    historyIndex.value++;
    const state = history.value[historyIndex.value];
    applyState(state);
  }

  function applyState(state: EditorState) {
    gridType.value = state.gridType;
    layers.value = JSON.parse(JSON.stringify(state.layers));
    activeLayerId.value = state.activeLayerId;
  }


  function setGridBackgroundImage(imageData: string | null) {
    gridConfig.value.gridBackgroundImage = imageData;
    saveState();
  }

  // function updateGridSize(width: number, height: number) {
  //   gridSize.value = { width, height };
  //   saveState();
  // }

  // Initialize
  createNewLayer();

  return {
    gridType,
    gridSize,
    cellSize,
    layers,
    activeLayerId,
    activeLayer,
    grid,
    colorPalette,
    selectedColor,
    historyIndex,
    history,
    gridConfig,
    
    createNewLayer,
    setCellColor,
    colorAllCellsInLayer,
    undo,
    redo,
    saveState,
    deleteLayer,
    setGridBackgroundImage
    // updateGridSize
  };
});