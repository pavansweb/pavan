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
            const image = document.createElement('img');
            image.src = URL.createObjectURL(file);
            image.alt = file.name;
            image.classList.add('preview-image');
            previewItem.appendChild(image);
        } else {
            const fileName = document.createElement('p');
            fileName.textContent = file.name;
            fileName.classList.add('preview-file-name');
            previewItem.appendChild(fileName);
        }

        previewBox.appendChild(previewItem);
    }
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
