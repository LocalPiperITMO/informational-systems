// src/components/modals/ImportFilesModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/ImportFileModal.css';

interface ImportFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Notify the parent component of successful submission
}

const ImportFilesModal: React.FC<ImportFilesModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(event.dataTransfer.files);
            validateAndSetFiles(droppedFiles);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            validateAndSetFiles(selectedFiles);
        }
    };

    const validateAndSetFiles = (incomingFiles: File[]) => {
        const tomlFiles = incomingFiles.filter(file => file.name.endsWith('.toml'));

        if (tomlFiles.length === 0) {
            setError('Please upload only TOML files.');
        } else {
            setFiles(tomlFiles);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError('No files selected for submission.');
            return;
        }

        setError(null);

        try {
            // Simulating a file upload service
            await Promise.all(
                files.map(file =>
                    new Promise<void>((resolve) =>
                        setTimeout(() => {
                            console.log(`Uploaded: ${file.name}`);
                            resolve();
                        }, 1000)
                    )
                )
            );
            setFiles([]);
            onSuccess(); // Notify the parent about the success
            onClose();
        } catch (err) {
            setError('Failed to upload files. Please try again.');
            console.error(err);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Import TOML Files</h2>

                <div
                    className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <p>Drag and drop TOML files here, or click to upload</p>
                    <input
                        type="file"
                        accept=".toml"
                        multiple
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="upload-button">
                        Browse Files
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="file-list">
                        <h4>Files to upload:</h4>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="actions">
                    <button onClick={handleSubmit} className="submit-button">
                        Submit
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default ImportFilesModal;