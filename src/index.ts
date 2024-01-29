import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook'; // Import NotebookPanel here
import { addHeaderToCell } from './header';
import { createVisualizationPanel } from './visualization';
import '../style/headerStyle.css';
import { Widget, Menu } from '@lumino/widgets';

import { IMainMenu } from '@jupyterlab/mainmenu';
import { ICommandPalette } from '@jupyterlab/apputils';
import { TreeManager } from './TreeManager';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_tangerine:plugin',
  requires: [INotebookTracker, IMainMenu, ICommandPalette],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd, 
    notebookTracker: INotebookTracker, 
    mainMenu: IMainMenu, 
    commandPalette: ICommandPalette
  ) => {
    console.log('JupyterLab extension jupyterlab_tangerine is activated!');

    const commandID = 'tangerine:open-visualization';
    app.commands.addCommand(commandID, {
      label: 'Open Tangerine Visualization',
      isVisible: () => notebookTracker.currentWidget !== null,
      execute: () => {
        const currentNotebookPanel = notebookTracker.currentWidget;
        if (currentNotebookPanel) {
          updateVisualizationPanel(currentNotebookPanel, app);
        }
      }
    });

    commandPalette.addItem({ command: commandID, category: 'Tangerine' });

    const tangerineMenu = new Menu({ commands: app.commands });
    tangerineMenu.title.label = 'Tangerine';
    mainMenu.addMenu(tangerineMenu);
    tangerineMenu.addItem({ command: commandID });

    const treeManager = new TreeManager();

    notebookTracker.widgetAdded.connect((sender, notebookPanel) => {
      notebookPanel.context.ready.then(() => {
        if (notebookPanel.model) {
          // Existing setup code
          const cellHeaderText = 'My Custom Header';
          addHeaderToCell(notebookPanel, cellHeaderText, app, updateVisualizationPanel);
          notebookPanel.model.contentChanged.connect(() => {
            updateVisualizationPanel(notebookPanel, app);
          });
          // Add listener for cell changes (addition and removal)
          notebookPanel.model.cells.changed.connect((sender, args) => {
            if (args.type === 'add') {
              args.newValues.forEach(cell => {
                // Assuming JupyterLab provides a unique ID for each cell, use that as the identifier
                const cellId = cell.id;
                console.log(cellId);
                treeManager.addNode(args.newIndex, cellId, cellHeaderText, null);
                console.log(treeManager.indexIdMap);
                console.log(treeManager.getTreeSnapshot());
              });
              updateVisualizationPanel(notebookPanel, app);
              //updateTreeVisualization(notebookPanel, treeManager.getTreeSnapshot(), app); // Update tree visualization
            }
          
            if (args.type === 'remove') {
              console.log(args);
              treeManager.removeNode(args.oldIndex);
              console.log(treeManager.indexIdMap);
              console.log(treeManager.getTreeSnapshot());
              updateVisualizationPanel(notebookPanel, app);
              //updateTreeVisualization(notebookPanel, treeManager.getTreeSnapshot(), app); // Update tree visualization
            }
          });
        }
      });
    });
  }
};

function updateVisualizationPanel(notebookPanel: NotebookPanel, app: JupyterFrontEnd): void {
  // Find the existing visualization panel by its ID
  const existingPanelId = `tangerine-visualization-${notebookPanel.id}`;
  const existingPanel = Array.from(app.shell.widgets()).find(w => w.id === existingPanelId) as Widget | undefined;
  // If the panel exists, close it
  if (existingPanel) {
    existingPanel.close();
  }
  // Create a new visualization panel for the current notebook
  const visualizationPanel = createVisualizationPanel(notebookPanel);
  visualizationPanel.id = existingPanelId; // Set a unique ID for the panel based on the notebook's ID
  // Add the new visualization panel to the JupyterLab shell
  app.shell.add(visualizationPanel, 'main', { mode: 'split-bottom' });
}
export default plugin;
