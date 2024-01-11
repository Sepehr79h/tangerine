import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';

/**
 * Add header to a notebook cell.
 */
function addHeaderToCell(notebookPanel: NotebookPanel, headerText: string) {
  // Find the cell elements in the notebook
  const cells = notebookPanel.content.widgets;

  cells.forEach(cell => {
    if (cell.model.type === 'code') {
      // Create the header element
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
        // Use an empty string as a fallback if textSpan.textContent is null
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

      // Insert the header above the cell
      cell.node.insertBefore(headerElement, cell.node.firstChild);
    }
  });
}

/**
 * Initialization data for the jupyterlab_tangerine extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_tangerine:plugin',
  requires: [INotebookTracker],
  autoStart: true,
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension jupyterlab_tangerine is activated!');

    // When a notebook is opened, add headers to its cells
    notebookTracker.widgetAdded.connect((sender, notebookPanel) => {
      // Wait for the notebook to be fully loaded
      notebookPanel.context.ready.then(() => {
        addHeaderToCell(notebookPanel, 'My Custom Header');
      });
    });
  }
};

export default plugin;
