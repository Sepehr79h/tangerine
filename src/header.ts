/**
 * header.ts
 */

// Import necessary interfaces from JupyterLab
import { NotebookPanel } from '@jupyterlab/notebook';

/**
 * Creates a header element with provided text.
 * @param headerText The text content for the header.
 * @returns The header element.
 */
export function createHeaderElement(headerText: string): HTMLElement {
  const headerElement = document.createElement('div');
  headerElement.className = 'my-custom-header';

  // Create the editable text span
  const textSpan = document.createElement('span');
  textSpan.textContent = headerText;
  headerElement.appendChild(textSpan);

  // Create edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = () => {
    // Prompt to edit the header text
    const newText = prompt('Edit header text:', textSpan.textContent || '');
    if (newText !== null) {
      textSpan.textContent = newText;
    }
  };
  headerElement.appendChild(editButton);

  // Create remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => {
    headerElement.remove();
  };
  headerElement.appendChild(removeButton);

  return headerElement;
}

/**
 * Adds headers to code cells in a notebook.
 * @param notebookPanel The notebook panel to which headers are to be added.
 * @param headerText The text for the headers.
 */
export function addHeaderToCell(notebookPanel: NotebookPanel, headerText: string) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is a cell and if it has a code cell class
          if (node instanceof HTMLElement && node.classList.contains('jp-CodeCell')) {
            const cell = notebookPanel.content.widgets.find(widget => widget.node === node);
            if (cell && !node.querySelector('.my-custom-header')) {
              const headerElement = createHeaderElement(headerText);
              node.insertBefore(headerElement, node.firstChild);
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
      const headerElement = createHeaderElement(headerText);
      cell.node.insertBefore(headerElement, cell.node.firstChild);
    }
  });

  // When the notebook is closed, disconnect the observer to prevent memory leaks
  notebookPanel.disposed.connect(() => observer.disconnect());
}
