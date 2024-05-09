let selectedFiles = []; // Array to store selected files

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;

    // Convert FileList to Array and concatenate with existing selectedFiles array
    selectedFiles = selectedFiles.concat(Array.from(files));

    // Display preview for all selected files
    displayFilePreviews(selectedFiles);

    showMessage(files.length + " file(s) selected for upload.");
});

function displayFilePreviews(files) {
    const previewBox = document.getElementById('previewBox');
    previewBox.innerHTML = ''; // Clear previous previews

    for (const file of files) {
        const previewItem = document.createElement('div');
        previewItem.classList.add('preview-item');

        if (file.type.startsWith('image/')) {
            const container = document.createElement('div');
            container.classList.add('image-container');
            
            const image = document.createElement('img');
            image.src = URL.createObjectURL(file);
            image.alt = file.name;
            image.classList.add('preview-image');
            container.appendChild(image);
            
            const fileNameContainer = document.createElement('div');
            fileNameContainer.classList.add('file-name-container');

            const fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileName.classList.add('preview-file-name');
            fileNameContainer.appendChild(fileName);

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => removeFile(file));
            fileNameContainer.appendChild(removeButton);

            container.appendChild(fileNameContainer);
            previewItem.appendChild(container);
        } else {
            const fileIcon = document.createElement('div');
            fileIcon.classList.add('file-icon');
            previewItem.appendChild(fileIcon);

            // Handle different file types
            if (file.type.startsWith('application/pdf')) {
                fileIcon.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1667px-PDF_file_icon.svg.png" alt="PDF">';
            } else if (file.type.startsWith('text/')) {
                fileIcon.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/4248/4248321.png" alt="Text">';
            } else {
                fileIcon.innerHTML = '<img src="https://previews.123rf.com/images/ihorsw/ihorsw1804/ihorsw180400350/99701923-file-icon-vector-outline-data-page-line-computer-file-symbol.jpg" alt="File">';
            }

            const fileNameContainer = document.createElement('div');
            fileNameContainer.classList.add('file-name-container');

            const fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileName.classList.add('preview-file-name');
            fileNameContainer.appendChild(fileName);

            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => removeFile(file));
            fileNameContainer.appendChild(removeButton);

            previewItem.appendChild(fileNameContainer);
        }

        previewBox.appendChild(previewItem);
    }
}


function removeFile(file) {
    selectedFiles = selectedFiles.filter(selectedFile => selectedFile !== file);
    displayFilePreviews(selectedFiles);
    showMessage('File removed: ' + file.name);
}




document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (selectedFiles.length === 0) {
        showMessage("Please select at least one file.");
        return;
    }

    try {
        for (const file of selectedFiles) {
            const fileContent = await readFileAsBase64(file);
            const response = await uploadFileToGitHub(file, fileContent);

            if (response.ok) {
                showMessage("File uploaded successfully: " + file.name);
            } else {
                const responseData = await response.json();
                showMessage("Error uploading file " + file.name + ": " + responseData.message);
                console.error('Error response:', response.status, responseData);
            }
        }
        document.getElementById('fileInput').value = ''; // Clear file input after upload
        selectedFiles = []; // Clear selectedFiles array
    } catch (error) {
        showMessage("Error uploading files: " + error.message);
        console.error('Error:', error);
    }
});

async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result.split(',')[1]); // Extract base64 content
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file); // Read file content as data URL
    });
}

async function uploadFileToGitHub(file, fileContent) {
    const sha = await calculateSHA(fileContent);
    
    const response = await fetch('https://api.github.com/repos/pavansweb/pavan/contents/files/' + file.name, {
        method: 'PUT',
        headers: {
            'Authorization': 'token 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',
            'Content-Type': 'application/json' // Specify content type as JSON
        },
        body: JSON.stringify({
            message: 'Upload file via API',
            content: fileContent, // Base64-encoded content
            encoding: 'base64', // Specify content encoding
            sha: sha // Provide the SHA checksum
        })
    });
    return response;
}

async function calculateSHA(fileContent) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileContent));
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}
