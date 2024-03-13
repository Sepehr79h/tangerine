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
// import { createTreeVisualization } from './TreeVisualization';
// import ReactDOM from 'react-dom';
import { TreeVisualizationWidget } from './TreeVisualization'; // Adjust the path as needed
import axios from 'axios';


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
    const treeCommandID = 'tangerine:open-tree-visualization';

    app.commands.addCommand(commandID, {
      label: 'Open Tangerine Visualization',
      isVisible: () => notebookTracker.currentWidget !== null,
      execute: () => {
        const currentNotebookPanel = notebookTracker.currentWidget;
        if (currentNotebookPanel) {
          updateVisualizationPanel(currentNotebookPanel, app);
        }
      }
    })
    app.commands.addCommand(treeCommandID, {
      label: 'Open Tree Visualization',
      isVisible: () => notebookTracker.currentWidget !== null,
      execute: () => {
        const currentNotebookPanel = notebookTracker.currentWidget;
        if (currentNotebookPanel) {
          updateTreeVisualizationPanel(currentNotebookPanel, treeManager, app);
        }
      }
    });

    commandPalette.addItem({ command: commandID, category: 'Tangerine' });

    const tangerineMenu = new Menu({ commands: app.commands });
    tangerineMenu.title.label = 'Tangerine';
    mainMenu.addMenu(tangerineMenu);
    tangerineMenu.addItem({ command: commandID });
    tangerineMenu.addItem({ command: treeCommandID });

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
                //createTreeVisualization(notebookPanel, treeManager, app);
              });
              //updateTreeVisualizationPanel(notebookPanel, treeManager, app);
              updateVisualizationPanel(notebookPanel, app);
              //updateTreeVisualization(notebookPanel, treeManager.getTreeSnapshot(), app); // Update tree visualization
            }
          
            if (args.type === 'remove') {
              console.log(args);
              treeManager.removeNode(args.oldIndex);
              console.log(treeManager.indexIdMap);
              console.log(treeManager.getTreeSnapshot());
              //updateTreeVisualizationPanel(notebookPanel, treeManager, app);
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

async function updateTreeVisualizationPanel(notebookPanel: NotebookPanel, treeManager: TreeManager, app: JupyterFrontEnd): Promise<void> {
  console.log("Updating tree visualization panel")
  const notebookPath = notebookPanel.context.path; 
  console.log(notebookPath)
  const treePanelId = `tangerine-tree-visualization-${notebookPanel.id}`;
  let treePanel = Array.from(app.shell.widgets()).find(w => w.id === treePanelId) as TreeVisualizationWidget | undefined;

  // Send the notebook path to the backend and fetch the tree data
  console.log("Fetching tree data for notebook: ", notebookPath)
  try {
    const response = await axios.post('http://127.0.0.1:5002/get-tree-structure', {
      filepath: notebookPath
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 50000 
    });

    const treeData = response.data;
    console.log(treeData);

    // const categoryPromises = treeData.nodes.map(async (node: any) => {
    //   const category = await axios.post('http://127.0.0.1:5002/get-node-category', {
    //     filepath: notebookPath,
    //     cellIndex: node.id
    //   }, {
    //     headers: { 'Content-Type': 'application/json' },
    //     timeout: 50000
    //   });
    //   console.log("category for node", node.id, ":", category.data);
    //   node.category = category.data; 
    // });

    // const headerPromises = treeData.nodes.map(async (node: any) => {
    //   const header = await axios.post('http://127.0.0.1:5002/get-node-header', {
    //     filepath: notebookPath,
    //     cellIndex: node.id
    //   }, {
    //     headers: { 'Content-Type': 'application/json' },
    //     timeout: 50000 
    //   });
    //   console.log("header for node", node.id, ":", header.data);
    //   node.header = header.data; //'import' //category.data;
    // });

    // await Promise.all(categoryPromises);
    // await Promise.all(headerPromises);

    if (treePanel) {
      // Update the existing panel with the new tree data
      treePanel.updateTreeData(treeData);
    } else {
      // Create a new panel if it doesn't exist and add it to the JupyterLab shell
      treePanel = new TreeVisualizationWidget(treeData, notebookPanel);
      treePanel.id = treePanelId;
      app.shell.add(treePanel, 'main', { mode: 'split-right' });
    }
  } catch (error) {
    console.error("Failed to fetch tree data:", error);
  }
}






export default plugin;
