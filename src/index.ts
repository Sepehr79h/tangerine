import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { addHeaderToCell } from './header'; // This imports the function from header.ts
import '../style/headerStyle.css'; // This imports the CSS

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
