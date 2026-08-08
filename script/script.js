const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');

function toggleMenu(show) {
    sideMenu.classList.toggle('active', show);
    menuOverlay.classList.toggle('active', show);
}

menuToggle.addEventListener('click', () => toggleMenu(true));
menuClose.addEventListener('click', () => toggleMenu(false));
menuOverlay.addEventListener('click', () => toggleMenu(false));

const navUploader = document.getElementById('navUploader');
const navApi = document.getElementById('navApi');
const pageUploader = document.getElementById('pageUploader');
const pageApi = document.getElementById('pageApi');

navUploader.addEventListener('click', () => {
    pageApi.classList.remove('active');
    pageUploader.classList.add('active');
    navApi.classList.remove('active-link');
    navUploader.classList.add('active-link');
    toggleMenu(false);
});

navApi.addEventListener('click', () => {
    pageUploader.classList.remove('active');
    pageApi.classList.add('active');
    navUploader.classList.remove('active-link');
    navApi.classList.add('active-link');
    toggleMenu(false);
});

const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const uploadBtn = document.getElementById('uploadBtn');
const resultCard = document.getElementById('resultCard');
const resultUrlInput = document.getElementById('resultUrlInput');
const copyResultBtn = document.getElementById('copyResultBtn');

browseBtn.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
});

['dragleave', 'drop'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        renderFile();
    }
});

fileInput.addEventListener('change', () => {
    renderFile();
});

function renderFile() {
    fileList.innerHTML = '';
    resultCard.style.display = 'none';

    if (!fileInput.files || fileInput.files.length === 0) {
        uploadBtn.disabled = true;
        return;
    }

    uploadBtn.disabled = false;
    const file = fileInput.files[0];
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
        <span class="file-name">${file.name}</span>
        <i class="fa-solid fa-xmark remove-file" onclick="removeSelectedFile()"></i>
    `;
    fileList.appendChild(item);
}

window.removeSelectedFile = function() {
    fileInput.value = '';
    renderFile();
}

uploadBtn.addEventListener('click', async () => {
    if (!fileInput.files || fileInput.files.length === 0) return;

    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah...';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success && data.url) {
            resultUrlInput.value = data.url;
            resultCard.style.display = 'flex';
        } else {
            alert('Upload gagal: ' + (data.message || 'Error server'));
        }
    } catch (err) {
        alert('Gagal terhubung ke API');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Unggah Sekarang';
    }
});

copyResultBtn.addEventListener('click', () => {
    copyText(resultUrlInput.value, copyResultBtn);
});

function copyText(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
        }, 2000);
    });
}

document.getElementById('copyCodeBtn').addEventListener('click', function() {
    copyText(document.getElementById('jsCodeBlock').textContent, this);
});
