import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from 'react-flow-renderer';
import dagre from '@dagrejs/dagre';
import { Widget } from '@lumino/widgets';
import '../style/TreeVisualization.css'; // Adjust the path as needed
// import { toggleCollapse } from './TreeUtils'; // Adjust the path as needed
import { NotebookPanel } from '@jupyterlab/notebook';

// Initialize the dagre graph for layout calculations
// var data = {
//   "nodes": [
//     {"id": "import", "data": {"label": "Data Import"}},
//     {"id": "wrangle", "data": {"label": "Data Wrangling"}},
//     {"id": "explore", "data": {"label": "Data Exploration"}},
//     {"id": "model", "data": {"label": "Model Building"}},
//     {"id": "evaluate", "data": {"label": "Model Evaluation"}},
//     {"id": "1", "data": {"label": "Import Libraries"}, "parentNode": "import"},
//     {"id": "2", "data": {"label": "Load Dataset"}, "parentNode": "import"},
//     {"id": "3", "data": {"label": "Preview Data"}, "parentNode": "explore"},
//     {"id": "4", "data": {"label": "Plot Experience vs Salary"}, "parentNode": "explore"},
//     {"id": "5", "data": {"label": "Reshape Experience Data"}, "parentNode": "wrangle"},
//     {"id": "6", "data": {"label": "Check Reshaped Data Shape"}, "parentNode": "wrangle"},
//     {"id": "7", "data": {"label": "Define Target Variable"}, "parentNode": "wrangle"},
//     {"id": "8", "data": {"label": "Initialize Model"}, "parentNode": "model"},
//     {"id": "9", "data": {"label": "Fit Model"}, "parentNode": "model"},
//     {"id": "10", "data": {"label": "Display Slope"}, "parentNode": "evaluate"},
//     {"id": "11", "data": {"label": "Display Intercept"}, "parentNode": "evaluate"},
//     {"id": "12", "data": {"label": "Predict Values"}, "parentNode": "model"},
//     {"id": "13", "data": {"label": "Plot Predictions"}, "parentNode": "evaluate"},
//     {"id": "14", "data": {"label": "Calculate Metrics"}, "parentNode": "evaluate"},
//     {"id": "15", "data": {"label": "Print Metrics"}, "parentNode": "evaluate"}
//   ],
//   "edges": [
//     {"source": "2", "target": "3"},
//     {"source": "2", "target": "4"},
//     {"source": "2", "target": "5"},
//     {"source": "2", "target": "7"},
//     {"source": "5", "target": "6"},
//     {"source": "5", "target": "9"},
//     {"source": "5", "target": "12"},
//     {"source": "5", "target": "14"},
//     {"source": "7", "target": "9"},
//     {"source": "7", "target": "14"},
//     {"source": "8", "target": "9"},
//     {"source": "8", "target": "12"},
//     {"source": "8", "target": "14"},
//     {"source": "9", "target": "10"},
//     {"source": "9", "target": "11"},
//     {"source": "9", "target": "12"},
//     {"source": "9", "target": "13"},
//     {"source": "9", "target": "14"},
//     {"source": "12", "target": "13"},
//     {"source": "12", "target": "14"}
//   ]
// }
// var data = {'nodes': [{'id': 'import', 'data': {'label': 'Data Import'}}, {'id': 'wrangle', 'data': {'label': 'Data Wrangling'}}, {'id': 'explore', 'data': {'label': 'Data Exploration'}}, {'id': 'model', 'data': {'label': 'Model Building'}}, {'id': 'evaluate', 'data': {'label': 'Model Evaluation'}}, {'id': '1', 'data': {'label': 'Library Imports'}, 'parentNode': 'import'}, {'id': '2', 'data': {'label': 'Load Dataset'}, 'parentNode': 'import'}, {'id': '3', 'data': {'label': 'Check Null Values'}, 'parentNode': 'wrangle'}, {'id': '4', 'data': {'label': 'Dataset Shape'}, 'parentNode': 'explore'}, {'id': '5', 'data': {'label': 'Dataset Info'}, 'parentNode': 'explore'}, {'id': '6', 'data': {'label': 'Object Data Types'}, 'parentNode': 'explore'}, {'id': '7', 'data': {'label': 'Value Counts of Attrition'}, 'parentNode': 'explore'}, {'id': '8', 'data': {'label': 'Encode Attrition'}, 'parentNode': 'wrangle'}, {'id': '9', 'data': {'label': 'Attrition Pie Chart'}, 'parentNode': 'explore'}, {'id': '10', 'data': {'label': 'Integer Data Types'}, 'parentNode': 'explore'}, {'id': '11', 'data': {'label': 'Age Distribution'}, 'parentNode': 'explore'}, {'id': '12', 'data': {'label': 'Top Ages'}, 'parentNode': 'explore'}, {'id': '13', 'data': {'label': 'Least Common Ages'}, 'parentNode': 'explore'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts'}, 'parentNode': 'explore'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts'}, 'parentNode': 'explore'}, {'id': '16', 'data': {'label': 'Drop Columns & Correlation Heatmap'}, 'parentNode': 'wrangle'}, {'id': '17', 'data': {'label': 'Years at Company Boxplot'}, 'parentNode': 'explore'}, {'id': '18', 'data': {'label': 'Business Travel vs Attrition'}, 'parentNode': 'explore'}, {'id': '19', 'data': {'label': 'Department vs Attrition'}, 'parentNode': 'explore'}, {'id': '20', 'data': {'label': 'Department Value Counts'}, 'parentNode': 'explore'}, {'id': '21', 'data': {'label': 'Gender vs Attrition'}, 'parentNode': 'explore'}, {'id': '22', 'data': {'label': 'Job Role vs Attrition'}, 'parentNode': 'explore'}, {'id': '23', 'data': {'label': 'Monthly Income by Job Role'}, 'parentNode': 'explore'}, {'id': '24', 'data': {'label': 'Education Field vs Attrition'}, 'parentNode': 'explore'}, {'id': '25', 'data': {'label': 'Overtime vs Attrition'}, 'parentNode': 'explore'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Count'}, 'parentNode': 'explore'}, {'id': '27', 'data': {'label': 'Feature & Target Definition'}, 'parentNode': 'model'}, {'id': '28', 'data': {'label': 'Encode Categorical Features'}, 'parentNode': 'wrangle'}, {'id': '29', 'data': {'label': 'Feature Scaling'}, 'parentNode': 'wrangle'}, {'id': '30', 'data': {'label': 'Train Test Split'}, 'parentNode': 'model'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split'}, 'parentNode': 'model'}, {'id': '32', 'data': {'label': 'Model Training & Evaluation'}, 'parentNode': 'model'}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}]}

//var data = {'nodes': [{'id': 'import', 'data': {'label': 'Data Import'}}, {'id': 'wrangle', 'data': {'label': 'Data Wrangling'}}, {'id': 'explore', 'data': {'label': 'Data Exploration'}}, {'id': 'model', 'data': {'label': 'Model Building'}}, {'id': 'evaluate', 'data': {'label': 'Model Evaluation'}}, {'id': '1', 'data': {'label': 'Library Imports'}, 'parentNode': 'group_1'}, {'id': '2', 'data': {'label': 'Load Dataset'}, 'parentNode': 'group_1'}, {'id': '3', 'data': {'label': 'Check Null Values'}, 'parentNode': 'wrangle'}, {'id': '4', 'data': {'label': 'Dataset Shape'}, 'parentNode': 'group_4'}, {'id': '5', 'data': {'label': 'Dataset Info'}, 'parentNode': 'group_4'}, {'id': '6', 'data': {'label': 'Object Data Types'}, 'parentNode': 'group_4'}, {'id': '7', 'data': {'label': 'Value Counts of Attrition'}, 'parentNode': 'group_4'}, {'id': '8', 'data': {'label': 'Encode Attrition'}, 'parentNode': 'wrangle'}, {'id': '9', 'data': {'label': 'Attrition Pie Chart'}, 'parentNode': 'group_9'}, {'id': '10', 'data': {'label': 'Integer Data Types'}, 'parentNode': 'group_9'}, {'id': '11', 'data': {'label': 'Age Distribution'}, 'parentNode': 'group_9'}, {'id': '12', 'data': {'label': 'Top Ages'}, 'parentNode': 'group_9'}, {'id': '13', 'data': {'label': 'Least Common Ages'}, 'parentNode': 'group_9'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts'}, 'parentNode': 'group_9'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts'}, 'parentNode': 'group_9'}, {'id': '16', 'data': {'label': 'Drop Columns & Correlation Heatmap'}, 'parentNode': 'wrangle'}, {'id': '17', 'data': {'label': 'Years at Company Boxplot'}, 'parentNode': 'group_17'}, {'id': '18', 'data': {'label': 'Business Travel vs Attrition'}, 'parentNode': 'group_17'}, {'id': '19', 'data': {'label': 'Department vs Attrition'}, 'parentNode': 'group_17'}, {'id': '20', 'data': {'label': 'Department Value Counts'}, 'parentNode': 'group_17'}, {'id': '21', 'data': {'label': 'Gender vs Attrition'}, 'parentNode': 'group_17'}, {'id': '22', 'data': {'label': 'Job Role vs Attrition'}, 'parentNode': 'group_17'}, {'id': '23', 'data': {'label': 'Monthly Income by Job Role'}, 'parentNode': 'group_17'}, {'id': '24', 'data': {'label': 'Education Field vs Attrition'}, 'parentNode': 'group_17'}, {'id': '25', 'data': {'label': 'Overtime vs Attrition'}, 'parentNode': 'group_17'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Count'}, 'parentNode': 'group_17'}, {'id': '27', 'data': {'label': 'Feature & Target Definition'}, 'parentNode': 'model'}, {'id': '28', 'data': {'label': 'Encode Categorical Features'}, 'parentNode': 'group_28'}, {'id': '29', 'data': {'label': 'Feature Scaling'}, 'parentNode': 'group_28'}, {'id': '30', 'data': {'label': 'Train Test Split'}, 'parentNode': 'group_30'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split'}, 'parentNode': 'group_30'}, {'id': '32', 'data': {'label': 'Model Training & Evaluation'}, 'parentNode': 'group_30'}, {'id': 'group_1', 'data': {'label': 'group_1'}, 'parentNode': 'import'}, {'id': 'group_4', 'data': {'label': 'group_4'}, 'parentNode': 'explore'}, {'id': 'group_9', 'data': {'label': 'group_9'}, 'parentNode': 'explore'}, {'id': 'group_17', 'data': {'label': 'group_17'}, 'parentNode': 'explore'}, {'id': 'group_28', 'data': {'label': 'group_28'}, 'parentNode': 'wrangle'}, {'id': 'group_30', 'data': {'label': 'group_30'}, 'parentNode': 'model'}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': '2', 'target': 'group_4'}, {'source': '27', 'target': 'group_28'}, {'source': 'group_1', 'target': '3'}, {'source': 'group_17', 'target': '27'}, {'source': 'group_1', 'target': '4'}, {'source': '29', 'target': 'group_30'}, {'source': '16', 'target': 'group_17'}, {'source': 'group_1', 'target': '6'}, {'source': 'group_1', 'target': '8'}, {'source': 'group_28', 'target': '30'}, {'source': 'group_1', 'target': '5'}, {'source': 'group_1', 'target': '7'}, {'source': '27', 'target': 'group_30'}, {'source': 'group_28', 'target': 'group_30'}, {'source': 'group_9', 'target': '16'}, {'source': 'group_1', 'target': 'group_4'}, {'source': '8', 'target': 'group_9'}]}

var data = {'nodes': [
          {'id': '1', 'data': {'label': 'Import Libraries'}, 'parentNode': 'group_1'}, 
          {'id': '2', 'data': {'label': 'Load Data'}, 'parentNode': 'group_1'}, 
          {'id': '3', 'data': {'label': 'Display Data'}, 'parentNode': 'group_3'}, 
          {'id': '4', 'data': {'label': 'Plot Data'}, 'parentNode': 'group_3'}, 
          {'id': '5', 'data': {'label': 'Reshape Data'}, 'parentNode': 'group_5'}, 
          {'id': '6', 'data': {'label': 'Check Data Shape'}, 'parentNode': 'group_5'}, 
          {'id': '7', 'data': {'label': 'Define Target'}, 'parentNode': 'group_5'}, 
          {'id': '8', 'data': {'label': 'Create Model'}, 'parentNode': 'group_8'}, 
          {'id': '9', 'data': {'label': 'Fit Model'}, 'parentNode': 'group_8'}, 
          {'id': '10', 'data': {'label': 'Get Model Slope'}, 'parentNode': 'group_8'}, 
          {'id': '11', 'data': {'label': 'Get Model Intercept'}, 'parentNode': 'group_8'}, 
          {'id': '12', 'data': {'label': 'Predict Values'}, 'parentNode': 'group_8'}, 
          {'id': '13', 'data': {'label': 'Plot Predictions'}, 'parentNode': 'group_13'}, 
          {'id': '14', 'data': {'label': 'Calculate Metrics'}, 'parentNode': 'group_13'},
          {'id': '15', 'data': {'label': 'Print Metrics'}, 'parentNode': 'group_13'}, 
          {'id': 'group_1', 'data': {'label': 'group_1'}, 'categoryColor': 'import'}, 
          {'id': 'group_3', 'data': {'label': 'group_3'}, 'categoryColor': 'explore'}, 
          {'id': 'group_5', 'data': {'label': 'group_5'}, 'categoryColor': 'wrangle'}, 
          {'id': 'group_8', 'data': {'label': 'group_8'}, 'categoryColor': 'model'}, 
          {'id': 'group_13', 'data': {'label': 'group_13'}, 'categoryColor': 'evaluate'}], 
      'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '7'}, {'source': '5', 'target': '6'}, {'source': '5', 'target': '9'}, {'source': '5', 'target': '12'}, {'source': '5', 'target': '14'}, {'source': '7', 'target': '9'}, {'source': '7', 'target': '14'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '14'}, {'source': '9', 'target': '10'}, {'source': '9', 'target': '11'}, {'source': '9', 'target': '12'}, {'source': '9', 'target': '13'}, {'source': '9', 'target': '14'}, {'source': '12', 'target': '13'}, {'source': '12', 'target': '14'}, {'source': 'group_5', 'target': '9'}, {'source': '2', 'target': 'group_3'}, {'source': '12', 'target': 'group_13'}, {'source': 'group_1', 'target': '7'}, {'source': 'group_1', 'target': '5'}, {'source': 'group_8', 'target': 'group_13'}, {'source': 'group_5', 'target': 'group_8'}, {'source': '8', 'target': 'group_13'}, {'source': 'group_1', 'target': 'group_5'}, {'source': 'group_8', 'target': '13'}, {'source': 'group_5', 'target': 'group_13'}, {'source': 'group_8', 'target': '14'}, {'source': '2', 'target': 'group_5'}, {'source': '5', 'target': 'group_8'}, {'source': '7', 'target': 'group_8'}, {'source': 'group_5', 'target': '14'}, {'source': '9', 'target': 'group_13'}, {'source': 'group_5', 'target': '12'}, {'source': '7', 'target': 'group_13'}, {'source': 'group_1', 'target': '4'}, {'source': 'group_1', 'target': '3'}, {'source': '5', 'target': 'group_13'}, {'source': 'group_1', 'target': 'group_3'}]}


// var data = {'nodes': [
//   {'id': 'import', 'data': {'label': 'Data Import'}}, 
//   {'id': 'wrangle', 'data': {'label': 'Data Wrangling'}}, 
//   {'id': 'explore', 'data': {'label': 'Data Exploration'}}, 
//   {'id': 'model', 'data': {'label': 'Model Building'}}, 
//   {'id': 'evaluate', 'data': {'label': 'Model Evaluation'}}, 
//   {'id': '1', 'data': {'label': 'Library Imports'}, 'parentNode': 'import'}, 
//   {'id': '2', 'data': {'label': 'Load Dataset'}, 'parentNode': 'import'}, 
//   {'id': '3', 'data': {'label': 'Check Null Values'}, 'parentNode': 'wrangle'}, 

//   {'id': 'cluster4567', 'data': {'label': 'Cluster 4567'}, 'parentNode': 'explore'},


//   {'id': '4', 'data': {'label': 'Dataset Shape'}, 'parentNode': 'cluster4567'}, 
//   {'id': '5', 'data': {'label': 'Dataset Info'}, 'parentNode': 'cluster4567'}, 
//   {'id': '6', 'data': {'label': 'Object Data Types'}, 'parentNode': 'cluster4567'}, 
//   {'id': '7', 'data': {'label': 'Value Counts of Attrition'}, 'parentNode': 'cluster4567'}, 



//   {'id': '8', 'data': {'label': 'Encode Attrition'}, 'parentNode': 'wrangle'}, 

//   {'id': 'cluster91011', 'data': {'label': 'Cluster 91011'}, 'parentNode': 'explore'},

//   {'id': '9', 'data': {'label': 'Attrition Pie Chart'}, 'parentNode': 'cluster91011'}, 
//   {'id': '10', 'data': {'label': 'Integer Data Types'}, 'parentNode': 'cluster91011'}, 
//   {'id': '11', 'data': {'label': 'Age Distribution'}, 'parentNode': 'cluster91011'}, 


//   {'id': 'cluster12131415', 'data': {'label': 'Cluster 12131415'}, 'parentNode': 'explore'},

//   {'id': '12', 'data': {'label': 'Top Ages'}, 'parentNode': 'cluster12131415'}, 
//   {'id': '13', 'data': {'label': 'Least Common Ages'}, 'parentNode': 'cluster12131415'}, 
//   {'id': '14', 'data': {'label': 'Standard Hours Value Counts'}, 'parentNode': 'cluster12131415'}, 
//   {'id': '15', 'data': {'label': 'Employee Count Value Counts'}, 'parentNode': 'cluster12131415'}, 


//   {'id': '16', 'data': {'label': 'Drop Columns & Correlation Heatmap'}, 'parentNode': 'wrangle'}, 
//   {'id': '17', 'data': {'label': 'Years at Company Boxplot'}, 'parentNode': 'explore'}, 
//   {'id': '18', 'data': {'label': 'Business Travel vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '19', 'data': {'label': 'Department vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '20', 'data': {'label': 'Department Value Counts'}, 'parentNode': 'explore'}, 
//   {'id': '21', 'data': {'label': 'Gender vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '22', 'data': {'label': 'Job Role vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '23', 'data': {'label': 'Monthly Income by Job Role'}, 'parentNode': 'explore'}, 
//   {'id': '24', 'data': {'label': 'Education Field vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '25', 'data': {'label': 'Overtime vs Attrition'}, 'parentNode': 'explore'}, 
//   {'id': '26', 'data': {'label': 'Environment Satisfaction Count'}, 'parentNode': 'explore'}, 
//   {'id': '27', 'data': {'label': 'Feature & Target Definition'}, 'parentNode': 'model'}, 
//   {'id': '28', 'data': {'label': 'Encode Categorical Features'}, 'parentNode': 'wrangle'}, 
//   {'id': '29', 'data': {'label': 'Feature Scaling'}, 'parentNode': 'wrangle'}, 
//   {'id': '30', 'data': {'label': 'Train Test Split'}, 'parentNode': 'model'}, 
//   {'id': '31', 'data': {'label': 'Dataset Shapes After Split'}, 'parentNode': 'model'}, 
//   {'id': '32', 'data': {'label': 'Model Training & Evaluation'}, 'parentNode': 'model'}], 
//   'edges': [
//     {'source': '2', 'target': '3'}, 

//     {'source': '2', 'target': 'cluster4567'}, 

//     {'source': '2', 'target': '4'}, 
//     {'source': '2', 'target': '5'}, 
//     {'source': '2', 'target': '6'}, 
//     {'source': '2', 'target': '7'}, 
//     {'source': '2', 'target': '8'}, 

//     {'source': '8', 'target': 'cluster91011'}, 

//     {'source': '8', 'target': '9'}, 
//     {'source': '8', 'target': '10'}, 
//     {'source': '8', 'target': '11'}, 

//     {'source': '8', 'target': 'cluster12131415'}, 

//     {'source': '8', 'target': '12'}, 
//     {'source': '8', 'target': '13'}, 
//     {'source': '8', 'target': '14'}, 
//     {'source': '8', 'target': '15'}, 
//     {'source': '8', 'target': '16'}, 
//     {'source': '11', 'target': '16'}, 
//     {'source': '16', 'target': '17'}, 
//     {'source': '16', 'target': '18'}, 
//     {'source': '16', 'target': '19'}, 
//     {'source': '16', 'target': '21'}, 
//     {'source': '16', 'target': '22'}, 
//     {'source': '16', 'target': '23'}, 
//     {'source': '16', 'target': '24'}, 
//     {'source': '16', 'target': '25'}, 
//     {'source': '16', 'target': '26'}, 
//     {'source': '16', 'target': '27'}, 
//     {'source': '17', 'target': '18'}, 
//     {'source': '18', 'target': '19'}, 
//     {'source': '19', 'target': '20'}, 
//     {'source': '19', 'target': '21'}, 
//     {'source': '21', 'target': '22'}, 
//     {'source': '22', 'target': '23'}, 
//     {'source': '23', 'target': '24'}, 
//     {'source': '24', 'target': '25'}, 
//     {'source': '25', 'target': '26'}, 
//     {'source': '26', 'target': '27'}, 
//     {'source': '27', 'target': '28'}, 
//     {'source': '27', 'target': '29'}, 
//     {'source': '27', 'target': '30'}, 
//     {'source': '28', 'target': '29'}, 
//     {'source': '29', 'target': '30'}, 
//     {'source': '30', 'target': '32'}, 
//     {'source': '30', 'target': '31'}]}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;
const categoryColorMap: { [key: string]: string } = {
  import: 'LightGreen',
  wrangle: 'LightBlue',
  explore: 'LightCoral',
  model: 'LightCyan',
  evaluate: 'LightGoldenRodYellow'
};

// Function to apply Dagre layout to nodes and edges
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  console.log("Getting layouted elements");
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'LR' ? 'left' : 'top';
    node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
    // node.data = { label: `${node.label} (${node.id})` };
    node.style = { backgroundColor: categoryColorMap[node.categoryColor] };
  });
  return { nodes, edges };
};

export interface TreeVisualizationProps {
  treeData: {
    nodes: any[]; // Adjust type to match React Flow's Node type
    edges: any[]; // Adjust type to match React Flow's Edge type
  };
  notebookPanel: NotebookPanel;
}

class TreeVisualizationWidget extends Widget {
  private treeContainer: HTMLDivElement;

  constructor(treeData: TreeVisualizationProps['treeData'], private notebookPanel: NotebookPanel) {
    super();
    this.addClass('tangerine-tree-visualization-panel');
    this.id = 'tangerine-tree-visualization-panel';
    this.title.label = 'Tree Visualization';
    this.title.closable = true;

    this.treeContainer = document.createElement('div');
    this.treeContainer.id = 'tree-visualization-container';
    this.node.appendChild(this.treeContainer);

    this.renderReactComponent(treeData);
  }

  renderReactComponent(treeData: TreeVisualizationProps['treeData']) {
    ReactDOM.render(<TreeVisualization treeData={treeData} notebookPanel={this.notebookPanel}/>, this.treeContainer);
  }

  updateTreeData(treeData: TreeVisualizationProps['treeData']) {
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ treeData, notebookPanel }) => {
  // Use state hooks for nodes and edges
  data = treeData;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [visibleNodes] = useState(data.nodes.filter(node => !node.parentNode));
  const [visibleEdges] = useState(data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)));
  // data.nodes.forEach((node: any) => {if (!node.parentNode) {node.hidden = true}});
  data.edges.forEach((edge: any) => {edge.type = 'smoothstep', edge.animated = true});

  useEffect(() => {
    console.log("Rendering tree visualization")
    // Initialize group visibility to false (collapsed) for each group
    console.log(visibleNodes);
    console.log(visibleEdges);
    // Apply Dagre layout to nodes and edges
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(visibleNodes, visibleEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [visibleNodes, visibleEdges]);

  const handleNodeClick = (event: any, node: any) => {
    console.log('Clicked node:', node);
    
    // // Toggle the visibility of the child nodes if a group node is clicked
    // //if (!node.parentNode) {
    // setActiveGroup(activeGroup === node.id ? null : node.id);
    // // update visibility of all nodes that have the clicked node as a parentNode
    // var updatedVisibleNodes = [...visibleNodes];
    // data.nodes.forEach(curr => {
    //   if (curr.parentNode === node.id) {
    //     if (!visibleNodes.includes(curr)) {
    //       updatedVisibleNodes.push(curr);
    //     }
    //     else {
    //       updatedVisibleNodes = updatedVisibleNodes.filter(item => item !== curr);
    //     }
    //   }
    // });
    // var updatedEdges = data.edges.filter(edge => updatedVisibleNodes.find(node => node.id === edge.source) && updatedVisibleNodes.find(node => node.id === edge.target));
    // console.log(updatedVisibleNodes);
    // setVisibleNodes(updatedVisibleNodes);
    // setVisibleEdges(updatedEdges);


    // Handle the notebook panel logic as before
    if (notebookPanel) {
      console.log(notebookPanel.content.widgets);
      const cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === node.id);
      if (cell) {
        notebookPanel.content.scrollToCell(cell);
      }
    }
  };

  

  const Legend = ({ categoryColorMap }: { categoryColorMap: Record<string, string> }) => {
    return (
      <div className="legend">
        {Object.keys(categoryColorMap).map((category) => (
          <div key={category} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: categoryColorMap[category] }}></span>
            <span className="legend-text">{category}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height: 800 }}>
      <Legend categoryColorMap={categoryColorMap} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};


export { TreeVisualization, TreeVisualizationWidget };
