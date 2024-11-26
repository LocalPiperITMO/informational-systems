// src/components/modals/ImportFilesModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import '../../styles/ImportFileModal.css';

interface ImportFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Notify the parent component of successful submission
}

const ImportFilesModal: React.FC<ImportFilesModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    // useDropzone must always be called regardless of isOpen
    const handleDrop = (acceptedFiles: File[], rejectedFiles: any) => {
        const tomlFiles = acceptedFiles.filter(file => file.name.endsWith('.toml'));

        if (rejectedFiles.length > 0 || tomlFiles.length === 0) {
            setError('Please upload only valid TOML files.');
        } else {
            setFiles([...files, ...tomlFiles]);
            setError(null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'application/toml': ['.toml'] },
        onDrop: handleDrop,
        multiple: true,
    });

    if (!isOpen) return null; // This is fine since hooks have already been initialized.

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError('No files selected for submission.');
            return;
        }

        setError(null);

        try {
            // Simulate file upload
            await Promise.all(
                files.map(file =>
                    new Promise<void>(resolve =>
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
                    {...getRootProps()}
                    className={`drag-drop-zone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps()} />
                    <p>{isDragActive ? 'Drop the files here...' : 'Drag and drop TOML files here, or click to browse'}</p>
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
