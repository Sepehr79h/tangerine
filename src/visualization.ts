import { NotebookPanel } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';

// Define a mapping from header categories to colors
const categoryColors = {
  'Import': '#007bff',
  'Wrangle': '#28a745',
  'Explore': '#6f42c1',
  'Model': '#dc3545',
  'Evaluate': '#ffc107'
};

// A function to create the visualization panel
export function createVisualizationPanel(notebookPanel: NotebookPanel): Widget {
  const panel = document.createElement('div');
  panel.className = 'tangerine-visualization-panel';

  // Map headers to categories and colors
  const headerColorMapping = mapHeadersToCategories(notebookPanel);

  // Create rectangles for headers and attach them to the panel
  Object.keys(headerColorMapping).forEach(cellIndex => {
    const cell = notebookPanel.content.widgets[parseInt(cellIndex)];
    const headerText = (cell.model.toJSON().source as string).split('\n')[0].trim();
    const color = headerColorMapping[cellIndex];
    const rectangle = createRectangleForHeader(headerText, color);

    attachNavigationHandler(rectangle, parseInt(cellIndex), notebookPanel);
    panel.appendChild(rectangle);
  });

  // Create a new Widget and attach the panel element to it
  const widget = new Widget();
  widget.node.appendChild(panel);
  widget.id = 'tangerine-visualization-panel';
  return widget;
}

// Function to iterate over notebook cells and map headers to categories
function mapHeadersToCategories(notebookPanel: NotebookPanel): { [key: string]: string } {
    const categoryColorMapping: { [key: string]: string } = {};
  
    // Find all custom headers in the notebook
    const headers = notebookPanel.node.querySelectorAll('.my-custom-header');
  
    headers.forEach((header, index) => {
      const category = (header as HTMLElement).dataset.category;
      if (category && category in categoryColors) {
        categoryColorMapping[String(index)] = categoryColors[category as keyof typeof categoryColors];
      }
    });
  
    return categoryColorMapping;
}

// Function to create a visual rectangle for each header cell
function createRectangleForHeader(headerText: string, color: string): HTMLElement {
  const rectangle = document.createElement('div');
  rectangle.className = 'tangerine-visualization-rectangle';
  rectangle.style.backgroundColor = color;
  rectangle.title = headerText; // Tooltip to show the header text on hover
  rectangle.textContent = headerText; // Optionally display the header text or an abbreviation on the rectangle

  // Set styles for the rectangle
  rectangle.style.width = '100%'; // Or a fixed width if you prefer
  rectangle.style.height = '20px'; // Or the height that matches your design
  rectangle.style.margin = '2px 0'; // Add some space between rectangles

  return rectangle;
}

// Function to attach event listeners to rectangles for navigation
function attachNavigationHandler(rectangle: HTMLElement, cellIndex: number, notebookPanel: NotebookPanel): void {
  rectangle.addEventListener('click', () => {
    // Logic to scroll to the cell at cellIndex
    const cell = notebookPanel.content.widgets[cellIndex];
    notebookPanel.content.scrollToCell(cell);
  });
}
