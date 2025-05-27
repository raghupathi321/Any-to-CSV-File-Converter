let selectedFiles = [];
let convertedFiles = [];

// DOM references
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const statusMessages = document.getElementById('statusMessages');

// Upload zone click or drop
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', e => {
  handleFiles(e.target.files);
  fileInput.value = ''; // allow reselecting same file
});

// Handle file uploads
function handleFiles(files) {
  for (const file of files) {
    selectedFiles.push(file);
    const li = document.createElement('li');
    li.textContent = file.name;
    fileList.appendChild(li);
  }
  statusMessages.textContent = `${selectedFiles.length} files selected`;
}

// Convert files (dummy implementation)
convertBtn.addEventListener('click', () => {
  if (selectedFiles.length === 0) {
    alert('No files selected to convert.');
    return;
  }

  convertedFiles = [];
  let convertedCount = 0;

  selectedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      const convertedContent = content.toUpperCase(); // Dummy conversion
      convertedFiles.push({
        filename: file.name.replace(/\.[^/.]+$/, '') + '_converted.csv',
        content: convertedContent
      });
      convertedCount++;
      if (convertedCount === selectedFiles.length) {
        statusMessages.textContent = `Converted ${convertedFiles.length} files`;
      }
    };
    reader.readAsText(file);
  });
});

// Clear everything
clearBtn.addEventListener('click', () => {
  selectedFiles = [];
  convertedFiles = [];
  fileList.innerHTML = '';
  statusMessages.textContent = 'Cleared all files';
});

// Download all converted files
downloadAllBtn.addEventListener('click', () => {
  if (convertedFiles.length === 0) {
    alert('No converted files available for download.');
    return;
  }

  convertedFiles.forEach(fileObj => {
    const blob = new Blob([fileObj.content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: fileObj.filename,
      saveAs: true
    }, () => {
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });
  });
});

