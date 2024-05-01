import React, { useEffect, useMemo, useState } from 'react';
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
import { NotebookPanel, NotebookActions } from '@jupyterlab/notebook';
import CustomNode from './CustomNode';
// import custom node css from style folder
import '../style/CustomNode.css';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';

var data = {'nodes': [{'id': '1', 'data': {'label': 'Import Libraries [1]', 'categoryColor': 'import'}}, {'id': '2', 'data': {'label': 'Load and Display Data [2]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_3'}, {'id': '3', 'data': {'label': 'Check Missing Values [3]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_2_3'}, {'id': '4', 'data': {'label': 'Data Shape [4]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '5', 'data': {'label': 'Data Information [5]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '6', 'data': {'label': 'Categorical Data Types [6]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '7', 'data': {'label': 'Attrition Value Counts [7]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '8', 'data': {'label': 'Encode Attrition Column [8]', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition Pie Chart [9]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '10', 'data': {'label': 'Integer Data Types [10]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '11', 'data': {'label': 'Age Distribution [11]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '12', 'data': {'label': 'Top 10 Age Values [12]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '13', 'data': {'label': 'Least Common Ages [13]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts [14]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts [15]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '16', 'data': {'label': 'Correlation Heatmap [16]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '17', 'data': {'label': 'Boxplot Years at Company [17]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '18', 'data': {'label': 'Business Travel vs Attrition [18]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '19', 'data': {'label': 'Department vs Attrition [19]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '20', 'data': {'label': 'Department Value Counts [20]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '21', 'data': {'label': 'Gender vs Attrition [21]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '22', 'data': {'label': 'Job Role vs Attrition [22]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '23', 'data': {'label': 'Income by Job Role and Attrition [23]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '24', 'data': {'label': 'Education Field vs Attrition [24]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '25', 'data': {'label': 'Overtime vs Attrition [25]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Count [26]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_26'}, {'id': '27', 'data': {'label': 'Prepare Features and Target [27]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_29'}, {'id': '28', 'data': {'label': 'Encode Categorical Features [28]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_29'}, {'id': '29', 'data': {'label': 'Scale Features [29]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_27_29'}, {'id': '30', 'data': {'label': 'Split Data [30]', 'categoryColor': 'model'}}, {'id': '31', 'data': {'label': 'Data Shapes After Split [31]', 'categoryColor': 'explore'}}, {'id': '32', 'data': {'label': 'Model Training and Evaluation [32]', 'categoryColor': 'model'}}, {'id': 'group_2_3', 'data': {'label': 'Data Preparation Steps [2-3]', 'categoryColor': 'wrangle'}}, {'id': 'group_4_7', 'data': {'label': 'Initial Data Exploration [4-7]', 'categoryColor': 'explore'}}, {'id': 'group_9_26', 'data': {'label': 'Comprehensive Data Analysis [9-26]', 'categoryColor': 'explore'}}, {'id': 'group_27_29', 'data': {'label': 'Feature Processing Pipeline [27-29]', 'categoryColor': 'wrangle'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': '26', 'target': 'group_27_29'}, {'source': 'group_2_3', 'target': '6'}, {'source': 'group_27_29', 'target': '30'}, {'source': 'group_9_26', 'target': 'group_27_29'}, {'source': 'group_2_3', 'target': '7'}, {'source': 'group_2_3', 'target': '4'}, {'source': 'group_2_3', 'target': '8'}, {'source': '8', 'target': 'group_9_26'}, {'source': 'group_2_3', 'target': 'group_4_7'}, {'source': '16', 'target': 'group_27_29'}, {'source': 'group_9_26', 'target': '27'}, {'source': 'group_2_3', 'target': '5'}, {'source': '2', 'target': 'group_4_7'}]}
// var data = {'nodes': [{'id': '1', 'data': {'label': 'Library Imports [1]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '2', 'data': {'label': 'Load Dataset [2]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '3', 'data': {'label': 'Check Null Values [3]', 'categoryColor': 'wrangle'}}, {'id': '4', 'data': {'label': 'Dataset Shape [4]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '5', 'data': {'label': 'Dataset Info [5]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '6', 'data': {'label': 'Object Data Types [6]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '7', 'data': {'label': 'Value Counts of Attrition [7]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '8', 'data': {'label': 'Encode Attrition [8]', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition Pie Chart [9]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '10', 'data': {'label': 'Integer Data Types [10]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '11', 'data': {'label': 'Age Distribution [11]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '12', 'data': {'label': 'Top Ages [12]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '13', 'data': {'label': 'Least Common Ages [13]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts [14]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts [15]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '16', 'data': {'label': 'Drop Columns & Correlation Heatmap [16]', 'categoryColor': 'wrangle'}}, {'id': '17', 'data': {'label': 'Years at Company Boxplot [17]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '18', 'data': {'label': 'Business Travel Countplot [18]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '19', 'data': {'label': 'Department Attrition Countplot [19]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '20', 'data': {'label': 'Department Value Counts [20]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '21', 'data': {'label': 'Gender Attrition Countplot [21]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '22', 'data': {'label': 'Job Role Attrition Countplot [22]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '23', 'data': {'label': 'Monthly Income by Job Role [23]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '24', 'data': {'label': 'Education Field Attrition Countplot [24]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '25', 'data': {'label': 'Overtime Attrition Countplot [25]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Countplot [26]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '27', 'data': {'label': 'Define Features and Target [27]', 'categoryColor': 'model'}}, {'id': '28', 'data': {'label': 'Encode Categorical Features [28]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '29', 'data': {'label': 'Scale Features [29]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '30', 'data': {'label': 'Split Dataset [30]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split [31]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '32', 'data': {'label': 'Model Training and Evaluation [32]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': 'group_1_2', 'data': {'label': 'Dataset Preparation Steps [1-2]', 'categoryColor': 'import'}}, {'id': 'group_4_7', 'data': {'label': 'Initial Data Exploration [4-7]', 'categoryColor': 'explore'}}, {'id': 'group_9_15', 'data': {'label': 'Detailed Data Analysis [9-15]', 'categoryColor': 'explore'}}, {'id': 'group_17_26', 'data': {'label': 'Comprehensive Attrition Insights [17-26]', 'categoryColor': 'explore'}}, {'id': 'group_28_29', 'data': {'label': 'Feature Processing Steps [28-29]', 'categoryColor': 'wrangle'}}, {'id': 'group_30_32', 'data': {'label': 'Model Implementation Cycle [30-32]', 'categoryColor': 'model'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': 'group_1_2', 'target': '5'}, {'source': '29', 'target': 'group_30_32'}, {'source': '16', 'target': 'group_17_26'}, {'source': '2', 'target': 'group_4_7'}, {'source': '27', 'target': 'group_28_29'}, {'source': 'group_1_2', 'target': '6'}, {'source': '8', 'target': 'group_9_15'}, {'source': 'group_28_29', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': 'group_4_7'}, {'source': 'group_1_2', 'target': '3'}, {'source': 'group_1_2', 'target': '7'}, {'source': 'group_17_26', 'target': '27'}, {'source': 'group_1_2', 'target': '8'}, {'source': 'group_9_15', 'target': '16'}, {'source': '27', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': '4'}, {'source': 'group_28_29', 'target': '30'}]}
// var data = {'nodes': [{'id': '1', 'data': {'label': 'Library Imports [1]', 'categoryColor': 'import'}, 'parentNode': 'group_1'}, {'id': '2', 'data': {'label': 'Load Dataset [2]', 'categoryColor': 'import'}, 'parentNode': 'group_1'}, {'id': '3', 'data': {'label': 'Check Null Values [3]', 'categoryColor': 'wrangle'}}, {'id': '4', 'data': {'label': 'Dataset Shape [4]', 'categoryColor': 'explore'}, 'parentNode': 'group_4'}, {'id': '5', 'data': {'label': 'Dataset Info [5]', 'categoryColor': 'explore'}, 'parentNode': 'group_4'}, {'id': '6', 'data': {'label': 'Object Type Columns [6]', 'categoryColor': 'explore'}, 'parentNode': 'group_4'}, {'id': '7', 'data': {'label': 'Attrition Value Counts [7]', 'categoryColor': 'explore'}, 'parentNode': 'group_4'}, {'id': '8', 'data': {'label': 'Encode Attrition [8]', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition Pie Chart [9]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '10', 'data': {'label': 'Integer Type Columns [10]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '11', 'data': {'label': 'Age Distribution [11]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '12', 'data': {'label': 'Top Ages [12]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '13', 'data': {'label': 'Least Common Ages [13]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts [14]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts [15]', 'categoryColor': 'explore'}, 'parentNode': 'group_9'}, {'id': '16', 'data': {'label': 'Drop Columns & Correlation Heatmap [16]', 'categoryColor': 'wrangle'}}, {'id': '17', 'data': {'label': 'Years At Company Boxplot [17]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '18', 'data': {'label': 'Business Travel Countplot [18]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '19', 'data': {'label': 'Department Countplot [19]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '20', 'data': {'label': 'Department Value Counts [20]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '21', 'data': {'label': 'Gender Countplot [21]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '22', 'data': {'label': 'Job Role Countplot [22]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '23', 'data': {'label': 'Monthly Income Barplot [23]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '24', 'data': {'label': 'Education Field Countplot [24]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '25', 'data': {'label': 'Overtime Countplot [25]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Countplot [26]', 'categoryColor': 'explore'}, 'parentNode': 'group_17'}, {'id': '27', 'data': {'label': 'Feature & Target Definition [27]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': '28', 'data': {'label': 'Encode Categorical Features [28]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': '29', 'data': {'label': 'Feature Scaling [29]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': '30', 'data': {'label': 'Train Test Split [30]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split [31]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': '32', 'data': {'label': 'Model Training & Evaluation [32]', 'categoryColor': 'model'}, 'parentNode': 'group_27'}, {'id': 'group_1', 'data': {'label': 'Library and Dataset [1-2]', 'categoryColor': 'import'}}, {'id': 'group_4', 'data': {'label': 'Dataset Structure Insight [4-7]', 'categoryColor': 'explore'}}, {'id': 'group_9', 'data': {'label': 'Dataset Value Analysis [9-15]', 'categoryColor': 'explore'}}, {'id': 'group_17', 'data': {'label': 'Employee Data Visualization [17-26]', 'categoryColor': 'explore'}}, {'id': 'group_27', 'data': {'label': 'Model Preparation Steps [27-32]', 'categoryColor': 'model'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': '2', 'target': 'group_4'}, {'source': 'group_1', 'target': '3'}, {'source': 'group_1', 'target': '6'}, {'source': '8', 'target': 'group_9'}, {'source': 'group_17', 'target': '27'}, {'source': 'group_1', 'target': '4'}, {'source': 'group_9', 'target': '16'}, {'source': 'group_1', 'target': '5'}, {'source': '16', 'target': 'group_17'}, {'source': 'group_1', 'target': 'group_4'}, {'source': 'group_1', 'target': '8'}, {'source': 'group_1', 'target': '7'}, {'source': '16', 'target': 'group_27'}, {'source': 'group_17', 'target': 'group_27'}, {'source': '26', 'target': 'group_27'}]}
// var data = {'nodes': [
//           {'id': '1', 'data': {'label': 'Import Libraries'}, 'parentNode': 'group_1'}, 
//           {'id': '2', 'data': {'label': 'Load Data'}, 'parentNode': 'group_1'}, 
//           {'id': '3', 'data': {'label': 'Display Data'}, 'parentNode': 'group_3'}, 
//           {'id': '4', 'data': {'label': 'Plot Data'}, 'parentNode': 'group_3'}, 
//           {'id': '5', 'data': {'label': 'Reshape Data'}, 'parentNode': 'group_5'}, 
//           {'id': '6', 'data': {'label': 'Check Data Shape'}, 'parentNode': 'group_5'}, 
//           {'id': '7', 'data': {'label': 'Define Target'}, 'parentNode': 'group_5'}, 
//           {'id': '8', 'data': {'label': 'Create Model'}, 'parentNode': 'group_8'}, 
//           {'id': '9', 'data': {'label': 'Fit Model'}, 'parentNode': 'group_8'}, 
//           {'id': '10', 'data': {'label': 'Get Model Slope'}, 'parentNode': 'group_8'}, 
//           {'id': '11', 'data': {'label': 'Get Model Intercept'}, 'parentNode': 'group_8'}, 
//           {'id': '12', 'data': {'label': 'Predict Values'}, 'parentNode': 'group_8'}, 
//           {'id': '13', 'data': {'label': 'Plot Predictions'}, 'parentNode': 'group_13'}, 
//           {'id': '14', 'data': {'label': 'Calculate Metrics'}, 'parentNode': 'group_13'},
//           {'id': '15', 'data': {'label': 'Print Metrics'}, 'parentNode': 'group_13'}, 
//           {'id': 'group_1', type: 'customNode', 'data': {'label': 'group_1', 'categoryColor': 'import'}}, 
//           {'id': 'group_3', type: 'customNode', 'data': {'label': 'group_3', 'categoryColor': 'explore'}}, 
//           {'id': 'group_5', type: 'customNode', 'data': {'label': 'group_5', 'categoryColor': 'wrangle'}}, 
//           {'id': 'group_8', type: 'customNode', 'data': {'label': 'group_8', 'categoryColor': 'model'}}, 
//           {'id': 'group_13', type: 'customNode', 'data': {'label': 'group_13', 'categoryColor': 'evaluate'}}], 
//       'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '7'}, {'source': '5', 'target': '6'}, {'source': '5', 'target': '9'}, {'source': '5', 'target': '12'}, {'source': '5', 'target': '14'}, {'source': '7', 'target': '9'}, {'source': '7', 'target': '14'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '14'}, {'source': '9', 'target': '10'}, {'source': '9', 'target': '11'}, {'source': '9', 'target': '12'}, {'source': '9', 'target': '13'}, {'source': '9', 'target': '14'}, {'source': '12', 'target': '13'}, {'source': '12', 'target': '14'}, {'source': 'group_5', 'target': '9'}, {'source': '2', 'target': 'group_3'}, {'source': '12', 'target': 'group_13'}, {'source': 'group_1', 'target': '7'}, {'source': 'group_1', 'target': '5'}, {'source': 'group_8', 'target': 'group_13'}, {'source': 'group_5', 'target': 'group_8'}, {'source': '8', 'target': 'group_13'}, {'source': 'group_1', 'target': 'group_5'}, {'source': 'group_8', 'target': '13'}, {'source': 'group_5', 'target': 'group_13'}, {'source': 'group_8', 'target': '14'}, {'source': '2', 'target': 'group_5'}, {'source': '5', 'target': 'group_8'}, {'source': '7', 'target': 'group_8'}, {'source': 'group_5', 'target': '14'}, {'source': '9', 'target': 'group_13'}, {'source': 'group_5', 'target': '12'}, {'source': '7', 'target': 'group_13'}, {'source': 'group_1', 'target': '4'}, {'source': 'group_1', 'target': '3'}, {'source': '5', 'target': 'group_13'}, {'source': 'group_1', 'target': 'group_3'}]}

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
  private isLoading: boolean; // New state to track loading

  constructor(treeData: TreeVisualizationProps['treeData'], private notebookPanel: NotebookPanel) {
    super();
    this.addClass('tangerine-tree-visualization-panel');
    this.id = 'tangerine-tree-visualization-panel';
    this.title.label = 'Tree Visualization';
    this.title.closable = true;

    this.treeContainer = document.createElement('div');
    this.treeContainer.id = 'tree-visualization-container';
    this.node.appendChild(this.treeContainer);

    this.isLoading = true; // Initially set to true for loading
    this.renderReactComponent(treeData);
  }

  renderReactComponent(treeData: TreeVisualizationProps['treeData']) {
    ReactDOM.render(<TreeVisualization treeData={treeData} notebookPanel={this.notebookPanel} isLoading={this.isLoading}/>, this.treeContainer);
  }

  updateTreeData(treeData: TreeVisualizationProps['treeData'], isLoading: boolean) {
    this.isLoading = isLoading;
    console.log(treeData);
    this.renderReactComponent(treeData);
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.treeContainer);
    super.dispose();
  }
}

const TreeVisualization: React.FC<TreeVisualizationProps & { isLoading: boolean }> = ({ treeData, notebookPanel, isLoading }) => {
  // Use state hooks for nodes and edges
  const nodeTypes = useMemo(() => ({
    customNode: (nodeData: any) => <CustomNode {...nodeData} onAddNode={handleAddNode} getSuggestions={getSuggestions} />
  }), []);
  console.log("Starting tree visualization")
  
  data = treeData;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [visibleNodes, setVisibleNodes] = useState(data.nodes.filter(node => !node.parentNode));
  const [visibleEdges, setVisibleEdges] = useState(data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)));
  // data.nodes.forEach((node: any) => {if (!node.parentNode) {node.hidden = true}});
  data.edges.forEach((edge: any) => {edge.type = 'smoothstep', edge.animated = true});
  data.nodes.forEach((node: any) => {node.type = 'customNode'});

  const [isRefresh, setIsRefresh] = useState(false);
  const [isAddNodeStarted, setIsAddNodeStarted] = useState(false);

  useEffect(() => {
    console.log("treeData updated", data);
    const newVisibleNodes = data.nodes.filter(node => !node.parentNode);
    const newVisibleEdges = data.edges.filter(edge => newVisibleNodes.find(node => node.id === edge.source) && newVisibleNodes.find(node => node.id === edge.target));
    setVisibleNodes(newVisibleNodes);
    setVisibleEdges(newVisibleEdges);
  }, [data]);

  useEffect(() => {
    console.log("Rendering tree visualization")
    // Initialize group visibility to false (collapsed) for each group
    console.log(visibleNodes);
    console.log(visibleEdges);
    // Apply Dagre layout to nodes and edges
    if (visibleNodes.length > 0 && visibleEdges.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(visibleNodes, visibleEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [visibleNodes, visibleEdges]);

  const getSuggestions = async (nodeId: string) => {
    setIsAddNodeStarted(true);
    console.log(visibleNodes);
    console.log(visibleEdges);
    try{
      const notebookPath = notebookPanel.context.path; 
      const response = await axios.post('http://127.0.0.1:5002/get-suggestions', {
        filepath: notebookPath,
        nodeId: nodeId,
        edges: data.edges
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 500000 
      });
      console.log(response.data);
      return response.data;
      
    }
    catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
  };

  const handleAddNode = (parentId: string, suggestion: any) => {
    // Create new node data
    const newNode = {
      id: `n${Date.now()}`, // Use a timestamp to generate a unique ID
      data: { label: suggestion.label, onAddNode: handleAddNode, getSuggestions: getSuggestions, categoryColor: suggestion.category }, // Add the missing categoryColor property
      position: { x: 250, y: 250 }, // Position should be calculated or defined appropriately
      type: 'customNode',
    };
    // Create new edge data
    const newEdge = {
      id: `e${parentId}-${newNode.id}`,
      source: parentId,
      target: newNode.id,
      type: 'smoothstep',
      animated: true
    };
    // Add new node and edge to the state
    setVisibleNodes((prevNodes) => [...prevNodes, newNode]);
    setVisibleEdges((prevEdges) => [...prevEdges, newEdge]);
    // Logic to add a new JupyterLab cell goes here
    //if parentId starts with group, create variable and set it to the string after the last underscore
    let id = parentId;
    if (parentId.startsWith('group_')) {
      id = parentId.split('_').pop() as string;
    }

    if (notebookPanel) {
      const cellIndex = notebookPanel.content.widgets.findIndex((w) => (w as any).prompt === id);
      if (cellIndex >= 0) {
        notebookPanel.model?.sharedModel.insertCell(cellIndex + 1, {
          cell_type: 'code',
          //add sample code here
          source: suggestion.code.map((line: string) => line + '\n'),
        });
        const cell = notebookPanel.content.widgets[cellIndex + 1];
        console.log(cell);
        if (cell) {
          notebookPanel.content.scrollToCell(cell);
        }
      }
    }
    setIsAddNodeStarted(false);
  };

  const handleNodeClick = (event: any, node: any) => {
    console.log('Clicked node:', node);
    // Handle the notebook panel logic as before
    if (notebookPanel) {
      console.log(notebookPanel.content.widgets);
      // if node.id starts with 'group_', scroll to the integer after 'group_'
      var cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === node.id);
      if (node.id.startsWith('group_')) {
        const group = node.id.split('_')[1]
        cell = notebookPanel.content.widgets.find((w) => (w as any).prompt === group);
        console.log(group, cell);
      }
      if (cell && isAddNodeStarted===false) {
        notebookPanel.content.scrollToCell(cell);
      }
    }
    // setIsAddNodeStarted(false);
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
        <button className="button-rerun-update" onClick={handleRerunAndUpdateTree}>
          Rerun and Update Tree
        </button>
        {isRefresh && <LinearProgress />} 
      </div>
    );
  };

  const handleRerunAndUpdateTree = async () => {
    console.log('Rerun and Update Tree button clicked');
    setIsRefresh(true);
    // Here you will add your logic to rerun calculations and update the tree
    // You might need to fetch new data, recalculate positions, or refresh the state
    try{
      // console.log(NotebookActions);
      await notebookPanel.context.sessionContext.restartKernel();
      await NotebookActions.runAll(notebookPanel.content, notebookPanel.sessionContext);
      const notebookPath = notebookPanel.context.path; 
      const response = await axios.post('http://127.0.0.1:5002/get-tree-structure', {
        filepath: notebookPath
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 500000 
      });
      const treeData = response.data;
      //const treeData = {'nodes': [{'id': '1', 'data': {'label': 'Library Imports [1]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '2', 'data': {'label': 'Load Dataset [2]', 'categoryColor': 'import'}, 'parentNode': 'group_1_2'}, {'id': '3', 'data': {'label': 'Check Null Values [3]', 'categoryColor': 'wrangle'}}, {'id': '4', 'data': {'label': 'Dataset Shape [4]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '5', 'data': {'label': 'Dataset Info [5]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '6', 'data': {'label': 'Object Data Types [6]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '7', 'data': {'label': 'Value Counts of Attrition [7]', 'categoryColor': 'explore'}, 'parentNode': 'group_4_7'}, {'id': '8', 'data': {'label': 'Encode Attrition [8]', 'categoryColor': 'wrangle'}}, {'id': '9', 'data': {'label': 'Attrition Pie Chart [9]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '10', 'data': {'label': 'Integer Data Types [10]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '11', 'data': {'label': 'Age Distribution [11]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '12', 'data': {'label': 'Top Ages [12]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '13', 'data': {'label': 'Least Common Ages [13]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '14', 'data': {'label': 'Standard Hours Value Counts [14]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '15', 'data': {'label': 'Employee Count Value Counts [15]', 'categoryColor': 'explore'}, 'parentNode': 'group_9_15'}, {'id': '16', 'data': {'label': 'Drop Unnecessary Columns [16]', 'categoryColor': 'wrangle'}}, {'id': '17', 'data': {'label': 'Years at Company Boxplot [17]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '18', 'data': {'label': 'Business Travel vs Attrition [18]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '19', 'data': {'label': 'Department vs Attrition [19]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '20', 'data': {'label': 'Department Value Counts [20]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '21', 'data': {'label': 'Gender vs Attrition [21]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '22', 'data': {'label': 'Job Role vs Attrition [22]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '23', 'data': {'label': 'Monthly Income by Job Role [23]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '24', 'data': {'label': 'Education Field vs Attrition [24]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '25', 'data': {'label': 'Overtime vs Attrition [25]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '26', 'data': {'label': 'Environment Satisfaction Count [26]', 'categoryColor': 'explore'}, 'parentNode': 'group_17_26'}, {'id': '27', 'data': {'label': 'Feature and Target Selection [27]', 'categoryColor': 'model'}}, {'id': '28', 'data': {'label': 'Encode Categorical Features [28]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '29', 'data': {'label': 'Scale Features [29]', 'categoryColor': 'wrangle'}, 'parentNode': 'group_28_29'}, {'id': '30', 'data': {'label': 'Split Dataset [30]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '31', 'data': {'label': 'Dataset Shapes After Split [31]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': '32', 'data': {'label': 'Model Training and Evaluation [32]', 'categoryColor': 'model'}, 'parentNode': 'group_30_32'}, {'id': 'group_1_2', 'data': {'label': 'Initial Data Setup [1-2]', 'categoryColor': 'import'}}, {'id': 'group_4_7', 'data': {'label': 'Dataset Structure Overview [4-7]', 'categoryColor': 'explore'}}, {'id': 'group_9_15', 'data': {'label': 'Data Distribution Analysis [9-15]', 'categoryColor': 'explore'}}, {'id': 'group_17_26', 'data': {'label': 'Attrition Analysis Factors [17-26]', 'categoryColor': 'explore'}}, {'id': 'group_28_29', 'data': {'label': 'Feature Engineering Steps [28-29]', 'categoryColor': 'wrangle'}}, {'id': 'group_30_32', 'data': {'label': 'Model Preparation Process [30-32]', 'categoryColor': 'model'}}], 'edges': [{'source': '2', 'target': '3'}, {'source': '2', 'target': '4'}, {'source': '2', 'target': '5'}, {'source': '2', 'target': '6'}, {'source': '2', 'target': '7'}, {'source': '2', 'target': '8'}, {'source': '8', 'target': '9'}, {'source': '8', 'target': '10'}, {'source': '8', 'target': '11'}, {'source': '8', 'target': '12'}, {'source': '8', 'target': '13'}, {'source': '8', 'target': '14'}, {'source': '8', 'target': '15'}, {'source': '8', 'target': '16'}, {'source': '11', 'target': '16'}, {'source': '16', 'target': '17'}, {'source': '16', 'target': '18'}, {'source': '16', 'target': '19'}, {'source': '16', 'target': '21'}, {'source': '16', 'target': '22'}, {'source': '16', 'target': '23'}, {'source': '16', 'target': '24'}, {'source': '16', 'target': '25'}, {'source': '16', 'target': '26'}, {'source': '16', 'target': '27'}, {'source': '17', 'target': '18'}, {'source': '18', 'target': '19'}, {'source': '19', 'target': '20'}, {'source': '19', 'target': '21'}, {'source': '21', 'target': '22'}, {'source': '22', 'target': '23'}, {'source': '23', 'target': '24'}, {'source': '24', 'target': '25'}, {'source': '25', 'target': '26'}, {'source': '26', 'target': '27'}, {'source': '27', 'target': '28'}, {'source': '27', 'target': '29'}, {'source': '27', 'target': '30'}, {'source': '28', 'target': '29'}, {'source': '29', 'target': '30'}, {'source': '30', 'target': '32'}, {'source': '30', 'target': '31'}, {'source': '2', 'target': 'group_4_7'}, {'source': 'group_9_15', 'target': '16'}, {'source': 'group_28_29', 'target': '30'}, {'source': 'group_1_2', 'target': '4'}, {'source': 'group_1_2', 'target': '6'}, {'source': '16', 'target': 'group_17_26'}, {'source': '27', 'target': 'group_28_29'}, {'source': 'group_1_2', 'target': '3'}, {'source': '29', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': 'group_4_7'}, {'source': '27', 'target': 'group_30_32'}, {'source': 'group_1_2', 'target': '8'}, {'source': 'group_17_26', 'target': '27'}, {'source': 'group_1_2', 'target': '7'}, {'source': 'group_1_2', 'target': '5'}, {'source': 'group_28_29', 'target': 'group_30_32'}, {'source': '8', 'target': 'group_9_15'}]};
      console.log(treeData);
      data = treeData;
      setVisibleNodes(data.nodes.filter(node => !node.parentNode));
      setVisibleEdges(data.edges.filter(edge => visibleNodes.find(node => node.id === edge.source) && visibleNodes.find(node => node.id === edge.target)));
      data.edges.forEach((edge: any) => {edge.type = 'smoothstep', edge.animated = true});
      data.nodes.forEach((node: any) => {node.type = 'customNode'});
    }
    catch (error) {
      console.error("Failed to fetch tree", error);
    }
    setIsRefresh(false);
  };


  return (
    <div style={{ height: 800 }}>
      {isLoading && <LinearProgress />}
      <Legend categoryColorMap={categoryColorMap} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
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
