// Global variables
let selectedFiles = [];
let convertedFiles = [];

// DOM elements

const fileList = document.getElementById('fileList');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const progressSection = document.getElementById('progressSection');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');
const previewTable = document.getElementById('previewTable');
const togglePreview = document.getElementById('togglePreview');
const statusMessages = document.getElementById('statusMessages');
const batchOperations = document.getElementById('batchOperations');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Options
const flattenOption = document.getElementById('flatten');
const includeEmptyOption = document.getElementById('includeEmpty');
const autoDetectHeadersOption = document.getElementById('autoDetectHeaders');
const encodingSelect = document.getElementById('encoding');
const delimiterSelect = document.getElementById('delimiter');
const quoteCharSelect = document.getElementById('quoteChar');

// Initialize event listeners
function initializeEventListeners() {
  // File upload events
  uploadZone.addEventListener('click', (e) => {
    if(e.target===fileInput) return; 
  fileInput.value = '';
  fileInput.click();
}
);
  uploadZone.addEventListener('dragover', handleDragOver);
  uploadZone.addEventListener('dragleave', handleDragLeave);
  uploadZone.addEventListener('drop', handleDrop);
  uploadZone.addEventListener('keydown', handleKeyDown);
  
  fileInput.addEventListener('change', handleFileSelect);
  
  // Button events
  convertBtn.addEventListener('click', convertFiles);
  clearBtn.addEventListener('click', clearAll);
  togglePreview.addEventListener('click', togglePreviewSection);
  downloadAllBtn.addEventListener('click', downloadAllFiles);

  // Prevent default drag behaviors on document
  document.addEventListener('dragenter', preventDefault);
  document.addEventListener('dragover', preventDefault);
  document.addEventListener('dragleave', preventDefault);
  document.addEventListener('drop', preventDefault);
}

// Event handlers
function handleDragOver(e) {
  e.preventDefault();
  uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
}

function handleKeyDown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
}

function handleFileSelect(e) {
  console.log('handleFileSelect triggered');
  const files = Array.from(e.target.files);
  processFiles(files);
  e.target.value = '';
}

function preventDefault(e) {
  e.preventDefault();
}

// File processing
function processFiles(files) {
  const validExtensions = ['.json', '.xml', '.xlsx', '.xls', '.tsv', '.yaml', '.yml', '.csv'];
  const validFiles = files.filter(file => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return validExtensions.includes(extension);
  });

  if (validFiles.length === 0) {
    showStatusMessage('No valid files selected. Please select JSON, XML, Excel, TSV, YAML, or CSV files.', 'warning');
    return;
  }

  selectedFiles = [...selectedFiles, ...validFiles];
  updateFileList();
  updateConvertButton();
  
  if (validFiles.length !== files.length) {
    showStatusMessage(`${validFiles.length} valid files added. ${files.length - validFiles.length} files were skipped.`, 'warning');
  } else {
    showStatusMessage(`${validFiles.length} files added successfully.`, 'success');
  }
}

function updateFileList() {
  if (selectedFiles.length === 0) {
    fileList.innerHTML = '';
    return;
  }

  fileList.innerHTML = selectedFiles.map((file, index) => `
    <div class="file-item" role="listitem">
      <div class="file-info">
        <svg class="file-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
        <div class="file-details">
          <h4>${escapeHtml(file.name)}</h4>
          <div class="file-meta">${formatFileSize(file.size)} • ${getFileType(file.name)}</div>
        </div>
      </div>
      <div class="file-actions">
        <button class="btn-icon-small remove" data-index="${index}" aria-label="Remove ${escapeHtml(file.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners for remove buttons
  document.querySelectorAll('.btn-icon-small.remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      removeFile(index);
    });
  });
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFileList();
  updateConvertButton();
  
  if (selectedFiles.length === 0) {
    showStatusMessage('All files removed.', 'info');
  }
}

function updateConvertButton() {
  convertBtn.disabled = selectedFiles.length === 0;
  convertBtn.textContent = selectedFiles.length === 0 ? 'Convert Files' : `Convert ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`;
}

// Conversion functions
async function convertFiles() {
  if (selectedFiles.length === 0) return;
  
  convertedFiles = [];
  showProgress(true);
  updateProgress(0, 'Starting conversion...');
  
  try {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const progress = ((i + 1) / selectedFiles.length) * 100;
      updateProgress(progress, `Converting ${file.name}...`);
      
      const convertedData = await convertFile(file);
      convertedFiles.push({
        name: file.name.replace(/\.[^/.]+$/, '') + '.csv',
        data: convertedData,
        originalFile: file
      });
    }
    
    updateProgress(100, 'Conversion completed!');
    showStatusMessage(`Successfully converted ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}.`, 'success');
    showBatchOperations();
    
    if (convertedFiles.length > 0) {
      showPreview(convertedFiles[0]);
    }
    
  } catch (error) {
    showStatusMessage(`Conversion failed: ${error.message}`, 'error');
    console.error('Conversion error:', error);
  } finally {
    setTimeout(() => showProgress(false), 2000);
  }
}

async function convertFile(file) {
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const fileContent = await readFileContent(file);
  
  switch (extension) {
    case '.json':
      return convertJsonToCsv(fileContent);
    case '.xml':
      return convertXmlToCsv(fileContent);
    case '.xlsx':
    case '.xls':
      return convertExcelToCsv(file);
    case '.tsv':
      return convertTsvToCsv(fileContent);
    case '.yaml':
    case '.yml':
      return convertYamlToCsv(fileContent);
    case '.csv':
      return reformatCsv(fileContent);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsText(file, encodingSelect.value);
  });
}

function convertJsonToCsv(jsonContent) {
  try {
    const data = JSON.parse(jsonContent);
    return jsonToCSV(data);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

function convertXmlToCsv(xmlContent) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    const data = xmlToObject(xmlDoc);
    return jsonToCSV(data);
  } catch (error) {
    throw new Error('Invalid XML format');
  }
}

function convertExcelToCsv(file) {
  // This would require a library like SheetJS
  // For now, return a placeholder
  throw new Error('Excel conversion requires additional libraries');
}

function convertTsvToCsv(tsvContent) {
  const lines = tsvContent.split('\n');
  const csvLines = lines.map(line => {
    const fields = line.split('\t');
    return fields.map(field => `"${field.replace(/"/g, '""')}"`).join(',');
  });
  return csvLines.join('\n');
}

function convertYamlToCsv(yamlContent) {
  // This would require a YAML parser library
  // For now, return a placeholder
  throw new Error('YAML conversion requires additional libraries');
}

function reformatCsv(csvContent) {
  const delimiter = delimiterSelect.value;
  const quoteChar = quoteCharSelect.value;
  
  // Parse and reformat CSV with new options
  const lines = csvContent.split('\n');
  return lines.map(line => {
    const fields = parseCSVLine(line);
    return fields.map(field => `${quoteChar}${field.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar)}${quoteChar}`).join(delimiter);
  }).join('\n');
}

// Utility functions for conversion
function jsonToCSV(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    if (flattenOption.checked) {
      data = data.map(item => flattenObject(item));
    }
    
    const headers = getAllKeys(data);
    const csvRows = [headers.join(',')];
    
    data.forEach(item => {
      const row = headers.map(header => {
        const value = getNestedValue(item, header) || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  } else if (typeof data === 'object' && data !== null) {
    const flattened = flattenOption.checked ? flattenObject(data) : data;
    const headers = Object.keys(flattened);
    const values = headers.map(key => `"${String(flattened[key] || '').replace(/"/g, '""')}"`);
    return headers.join(',') + '\n' + values.join(',');
  } else {
    throw new Error('Invalid JSON structure for CSV conversion');
  }
}

function xmlToObject(xmlNode) {
  const result = {};
  
  if (xmlNode.nodeType === Node.TEXT_NODE) {
    return xmlNode.nodeValue.trim();
  }
  
  if (xmlNode.nodeType === Node.ELEMENT_NODE) {
    if (xmlNode.childNodes.length > 0) {
      for (let i = 0; i < xmlNode.childNodes.length; i++) {
        const child = xmlNode.childNodes[i];
        const childName = child.nodeName;
        
        if (childName === '#text') {
          const text = child.nodeValue.trim();
          if (text) return text;
        } else {
          if (!result[childName]) {
            result[childName] = [];
          }
          result[childName].push(xmlToObject(child));
        }
      }
    }
    
    // Flatten single-item arrays
    Object.keys(result).forEach(key => {
      if (result[key].length === 1) {
        result[key] = result[key][0];
      }
    });
  }
  
  return result;
}

function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(flattened, flattenObject(item, `${newKey}[${index}]`));
          } else {
            flattened[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

function getAllKeys(data) {
  const keys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => keys.add(key));
  });
  return Array.from(keys);
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// UI functions
function showProgress(show) {
  progressSection.style.display = show ? 'block' : 'none';
}

function updateProgress(percent, text) {
  progressPercent.textContent = `${Math.round(percent)}%`;
  progressText.textContent = text;
  progressFill.style.width = `${percent}%`;
}

function showStatusMessage(message, type = 'info') {
  const messageEl = document.createElement('div');
  messageEl.className = `status-message ${type}`;
  messageEl.textContent = message;
  
  statusMessages.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

function showBatchOperations() {
  batchOperations.style.display = convertedFiles.length > 0 ? 'block' : 'none';
  downloadAllBtn.disabled = convertedFiles.length === 0;
}

function showPreview(convertedFile) {
  const lines = convertedFile.data.split('\n').slice(0, 10); // First 10 lines
  const rows = lines.map(line => parseCSVLine(line));
  
  if (rows.length === 0) {
    previewContent.innerHTML = '<p>No data to preview</p>';
    return;
  }
  
  const table = document.createElement('table');
  table.className = 'preview-table';
  
  // Headers
  if (rows.length > 0) {
    const headerRow = document.createElement('tr');
    rows[0].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  }
  
  // Data rows
  rows.slice(1).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  
  previewContent.innerHTML = '';
  previewContent.appendChild(table);
  previewSection.style.display = 'block';
}

function togglePreviewSection() {
  const isVisible = previewSection.style.display !== 'none';
  previewSection.style.display = isVisible ? 'none' : 'block';
  togglePreview.textContent = isVisible ? 'Show Preview' : 'Hide Preview';
}

// Download functions
function downloadAllFiles() {
  if (convertedFiles.length === 0) return;
  
  if (convertedFiles.length === 1) {
    downloadFile(convertedFiles[0]);
  } else {
    // Create a zip file for multiple files
    createZipDownload();
  }
}

function downloadFile(convertedFile) {
  const blob = new Blob([convertedFile.data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = convertedFile.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function createZipDownload() {
  // This would require a ZIP library like JSZip
  // For now, download files individually
  convertedFiles.forEach((file, index) => {
    setTimeout(() => downloadFile(file), index * 500);
  });
}

// Clear functions
function clearAll() {
  selectedFiles = [];
  convertedFiles = [];
  fileInput.value = '';
  updateFileList();
  updateConvertButton();
  showBatchOperations();
  previewSection.style.display = 'none';
  showStatusMessage('All files cleared.', 'info');
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileType(filename) {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  const types = {
    '.json': 'JSON',
    '.xml': 'XML',
    '.xlsx': 'Excel',
    '.xls': 'Excel',
    '.tsv': 'TSV',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.csv': 'CSV'
  };
  return types[extension] || 'Unknown';
}
let uploadZone, fileInput;

document.addEventListener('DOMContentLoaded', () => {
  uploadZone = document.getElementById('uploadZone');
  fileInput = document.getElementById('fileInput');
  initializeEventListeners();
  updateConvertButton();
});
