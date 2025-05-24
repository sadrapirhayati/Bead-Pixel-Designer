<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3';
import { useEditorStore } from '@/stores/editorStore';

const props = defineProps<{
  width: number;
  height: number;
}>();

const store = useEditorStore();
const canvasRef = ref<HTMLDivElement | null>(null);

const drawGrid = () => {
  if (!canvasRef.value) return;
  
  // Clear previous grid
  d3.select(canvasRef.value).selectAll('*').remove();

  const svg = d3.select(canvasRef.value)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height);


  
  if (store.gridType === 'square') {
    drawSquareGrid(svg);
  } else {
    drawHexGrid(svg);
  }
  
  drawCells(svg);

  if (store.gridConfig.gridBackgroundImage) {
      svg.append('image')
        .attr('href', store.gridConfig.gridBackgroundImage)
        .attr('visibility', store.gridConfig.showGridBackgroundImage? 'visible': 'hidden')
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('preserveAspectRatio', 'none')
        .style('opacity', 0.3) // Adjust as needed
        .attr('x', 0)
        .attr('y', 0)
        .attr('pointer-events', 'none');
    }
};

const drawSquareGrid = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const spacing = store.gridConfig.spacing
  const showBorder = store.gridConfig.showBorder
  const borderColor = store.gridConfig.borderColor
  const cellPadding = store.gridConfig.cellPadding
  const borderWidth = store.gridConfig.borderWidth

  svg.append('rect')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('fill', store.gridConfig.gridBackground);

  for (let y = 0; y < store.grid.height; y++) {
    for (let x = 0; x < store.grid.width; x++) {
      const pos = store.grid.getCellPosition(x, y);
      const adjustedPos = {
        x: pos.x +  spacing,
        y: pos.y + spacing
      };
      svg.append('rect')
        .attr('x', adjustedPos.x)
        .attr('y', adjustedPos.y)
        .attr('width', store.cellSize.width - spacing * 2)
        .attr('height', store.cellSize.height - spacing * 2)
        .attr('stroke', showBorder ? borderColor : 'none')
        .attr('stroke-width', borderWidth)
        .attr('fill', () => (x + y) % 2 === 0 && store.gridConfig.useAlternateColor 
          ? store.gridConfig.alternateColor 
          : 'transparent')
        .attr('rx', cellPadding)
        .attr('ry', cellPadding)
        .attr('data-x', x)
        .attr('data-y', y)
        .on('click', () => {
          if (store.activeLayer) {
            store.setCellColor(x, y, store.selectedColor);
          }
        });
    }
  }
};

const drawHexGrid = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const spacing = store.gridConfig.spacing
  const showBorder = store.gridConfig.showBorder
  const borderColor = store.gridConfig.borderColor
  const cellPadding = store.gridConfig.cellPadding
  const borderWidth = store.gridConfig.borderWidth
  
  const cellSize = store.cellSize;
  const offset = cellSize.width / 2;

  svg.append('rect')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('fill', store.gridConfig.gridBackground);

  for (let y = 0; y < store.grid.height; y++) {
    for (let x = 0; x < store.grid.width; x++) {
      const posX = x * cellSize.width + (y % 2 === 1 ? offset : 0);
      const posY = y * cellSize.height;
      svg.append('rect')
        .attr('x', posX)
        .attr('y', posY)
        .attr('width', cellSize.width - spacing * 2)
        .attr('height', cellSize.height - spacing * 2)
        .attr('stroke', showBorder ? borderColor : 'none')
        .attr('stroke-width', borderWidth)
        .attr('fill', () => (x + y) % 2 === 0 && store.gridConfig.useAlternateColor 
          ? store.gridConfig.alternateColor 
          : 'transparent')
        .attr('rx', cellPadding)
        .attr('ry', cellPadding)
        .attr('data-x', x)
        .attr('data-y', y)
        .on('click', () => {
          if (store.activeLayer) {
            store.setCellColor(x, y, store.selectedColor);
          }
        });
    }
  }
};

const drawCells = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const { spacing, borderColor, borderWidth, showBorder, cellPadding } = store.gridConfig;
  
  store.layers.forEach(layer => {
    if (!layer.visible) return;
    
    Object.values(layer.cells).forEach(cell => {
      const pos = store.grid.getCellPosition(cell.x, cell.y);
      const adjustedPos = {
        x: pos.x + spacing,
        y: pos.y + spacing
      };
      const size = {
        width: store.cellSize.width - spacing * 2,
        height: store.cellSize.height - spacing * 2,
      }
      
      if (store.gridType === 'square') {
        svg.append('rect')
          .attr('x', adjustedPos.x)
          .attr('y', adjustedPos.y)
          .attr('width', size.width)
          .attr('height', size.height)
          .attr('fill', cell.color)
          .attr('stroke', showBorder ? borderColor : 'none')
          .attr('stroke-width', borderWidth)
          .attr('rx', cellPadding)
          .attr('ry', cellPadding)
          .attr('opacity', layer.id === store.activeLayerId ? 1 : 0.7)
          .attr('pointer-events', 'none');
      } else {
        svg.append('rect')
          .attr('x', adjustedPos.x)
          .attr('y', adjustedPos.y)
          .attr('width', size.width)
          .attr('height', size.height)
          .attr('fill', cell.color)
          .attr('stroke', showBorder ? borderColor : 'none')
          .attr('stroke-width', borderWidth)
          .attr('rx', cellPadding)
          .attr('ry', cellPadding)
          .attr('opacity', layer.id === store.activeLayerId ? 1 : 0.7)
          .attr('pointer-events', 'none');;
      }
    });
  });
};

watch(() => [store.gridType,
            store.cellSize,
            store.gridSize.width,
            store.gridSize.height,
            store.layers,
            store.activeLayerId,
            store.gridConfig.spacing,
            store.gridConfig.borderColor,
            store.gridConfig.borderWidth,
            store.gridConfig.showBorder,
            store.gridConfig.cellPadding,
            store.gridConfig.gridBackground,
            store.gridConfig.alternateColor,
            store.gridConfig.useAlternateColor,
            store.gridConfig.gridPattern,
            store.gridConfig.gridBackgroundImage,
            store.gridConfig.gridBackgroundSize,
            store.gridConfig.showGridBackgroundImage
          ], () => {
  drawGrid();
}, { deep: true });

onMounted(() => {
  drawGrid();
});
</script>

<template>
<br>

    <span>Show Background</span>
    <input 
      type="checkbox" 
      v-model.number="store.gridConfig.showGridBackgroundImage" 
    >

  <div ref="canvasRef" class="canvas-container"></div>
</template>

<style scoped>
.canvas-container {
  border: 1px solid #ddd;
  margin: 20px auto;
  padding: 20px;
}
</style>