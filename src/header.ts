/**
 * header.ts
 */

// Import necessary interfaces from JupyterLab
import { NotebookPanel } from '@jupyterlab/notebook';
import { JupyterFrontEnd } from '@jupyterlab/application';

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

  // Create edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => {
    const newCategory = prompt('Enter category (Import, Wrangle, Explore, Model, Evaluate):', headerElement.dataset.category);
    const newText = prompt('Edit header text:', textSpan.textContent || '');
    if (newText !== null && newCategory !== null) {
      textSpan.textContent = newText;
      headerElement.dataset.category = newCategory; // Update the category
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
              updateVisualization(notebookPanel, app);
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
