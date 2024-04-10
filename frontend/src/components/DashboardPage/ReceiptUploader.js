import React, { useCallback, useState } from 'react';
import { useGrocery } from './GroceryContext'; 
import { useDropzone } from 'react-dropzone';
import './dashboard.css'; // Ensure this path is correct

function ReceiptUploader() {
  const { setRefreshGroceries } = useGrocery();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const handleUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('receipt', selectedFile);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/receipts/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // On successful upload, trigger the grocery list refresh
      setRefreshGroceries(true);
      alert('File uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Error during file upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="upload-section">
      <div className="upload-bar">
        <span>Upload Receipt</span>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      <div {...getRootProps()} className="drag-zone">
        <input {...getInputProps()} />
        {!selectedFile && (
          isDragActive ?
            <p>Drop the file here ...</p> :
            <p>Drag 'n' drop a receipt here, or click to select a file</p>
        )}
        {selectedFile && (
          <div className="file-info">
            Selected file: {selectedFile.name}
            <button onClick={removeSelectedFile}>Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptUploader;
