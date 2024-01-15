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

    notebookTracker.widgetAdded.connect((sender, notebookPanel) => {
      notebookPanel.context.ready.then(() => {
        if (notebookPanel.model) {
          addHeaderToCell(notebookPanel, 'My Custom Header');
          // We no longer add the visualization panel here directly
          // The visualization panel will be created when the user selects the menu item
          notebookPanel.model.contentChanged.connect(() => {
            updateVisualizationPanel(notebookPanel, app);
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
