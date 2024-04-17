/**
 * header.ts
 */

// Import necessary interfaces from JupyterLab
import { NotebookPanel } from '@jupyterlab/notebook';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { categoryColors } from './visualization';

/**
 * Creates a header element with provided text.
 * @param headerText The text content for the header.
 * @returns The header element.
 */
const defaultCategory = 'Import';

export function createHeaderElement(headerText: string, category: string, notebookPanel: NotebookPanel, app: JupyterFrontEnd, updateVisualization: (notebookPanel: NotebookPanel, app: JupyterFrontEnd) => void): HTMLElement {
  const headerElement = document.createElement('div');
  headerElement.className = 'my-custom-header';
  headerElement.dataset.category = category;

  // Create the editable text span
  const textSpan = document.createElement('span');
  textSpan.textContent = headerText;
  headerElement.appendChild(textSpan);

  // Create the dropdown for category selection
  const categoryDropdown = document.createElement('select');
  Object.keys(categoryColors).forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryDropdown.appendChild(option);
  });
  categoryDropdown.value = category;
  categoryDropdown.style.display = 'none'; // Initially hide the dropdown
  categoryDropdown.onchange = () => {
    const newCategory = categoryDropdown.value;
    headerElement.dataset.category = newCategory;
    // categoryButton.textContent = newCategory;
    // categoryButton.style.borderColor = categoryColors[newCategory];
    categoryButton.style.backgroundColor = categoryColors[newCategory];
    categoryDropdown.style.display = 'none'; // Hide the dropdown after selection
    updateVisualization(notebookPanel, app);
  };
  headerElement.appendChild(categoryDropdown);

  // Create the category button
  const categoryButton = document.createElement('button');
  // categoryButton.className = 'category-button';
  // categoryButton.textContent = category; // You can also set the button text to the category name
  // categoryButton.style.borderColor = categoryColors[category];
  categoryButton.style.backgroundColor = categoryColors[category];
  categoryButton.onclick = () => {
    categoryDropdown.style.display = 'block'; // Show the dropdown when button is clicked
  };
  headerElement.appendChild(categoryButton);

  // Modify the edit button to only edit text
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Text';
  editButton.onclick = () => {
    const newText = prompt('Edit header text:', textSpan.textContent || '');
    if (newText !== null) {
      textSpan.textContent = newText;
      updateVisualization(notebookPanel, app);
    }
  };
  headerElement.appendChild(editButton);

  // Create remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => {
    headerElement.remove();
    updateVisualization(notebookPanel, app);
  };
  headerElement.appendChild(removeButton);

  return headerElement;
}

/**
 * Adds headers to code cells in a notebook.
 * @param notebookPanel The notebook panel to which headers are to be added.
 * @param headerText The text for the headers.
 */
export function addHeaderToCell(notebookPanel: NotebookPanel, headerText: string, app: JupyterFrontEnd, updateVisualization: (notebookPanel: NotebookPanel, app: JupyterFrontEnd) => void) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is a cell and if it has a code cell class
          if (node instanceof HTMLElement && node.classList.contains('jp-CodeCell')) {
            const cell = notebookPanel.content.widgets.find(widget => widget.node === node);
            if (cell && !node.querySelector('.my-custom-header')) {
              const headerElement = createHeaderElement(headerText, defaultCategory, notebookPanel, app, updateVisualization);
              node.insertBefore(headerElement, node.firstChild);
              //updateVisualization(notebookPanel, app);
            }
          }
        });
      }
    });
  });

  observer.observe(notebookPanel.node, { childList: true, subtree: true });

  // Initial call to add headers to all existing code cells
  notebookPanel.content.widgets.forEach(cell => {
    if (cell.model.type === 'code' && !cell.node.querySelector('.my-custom-header')) {
      const headerElement = createHeaderElement(headerText, defaultCategory, notebookPanel, app, updateVisualization);
      cell.node.insertBefore(headerElement, cell.node.firstChild);
    }
  });

  // When the notebook is closed, disconnect the observer to prevent memory leaks
  notebookPanel.disposed.connect(() => observer.disconnect());
}
