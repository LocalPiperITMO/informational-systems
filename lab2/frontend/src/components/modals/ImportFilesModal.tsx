import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import '../../styles/ImportFileModal.css';

interface ImportFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ImportFilesModal: React.FC<ImportFilesModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (acceptedFiles: File[]) => {
        const tomlFiles = acceptedFiles.filter(file => file.name.endsWith('.toml'));
        if (tomlFiles.length === 0) {
            setError('Please upload only valid TOML files.');
            return;
        }

        setFiles(prevFiles => [...prevFiles, ...tomlFiles]);
        setError(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'application/toml': ['.toml'] },
        onDrop: handleDrop,
        multiple: true,
    });

    const handleDelete = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    // Handling drag events
    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropFile = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();

        if (draggingIndex === null) return;

        const updatedFiles = [...files];
        const [draggedFile] = updatedFiles.splice(draggingIndex, 1);
        updatedFiles.splice(targetIndex, 0, draggedFile);

        setFiles(updatedFiles);
        setDraggingIndex(null);
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError('No files selected for submission.');
            return;
        }

        setError(null);

        try {
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
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to upload files. Please try again.');
            console.error(err);
        }
    };

    if (!isOpen) return null;

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
                    <ul className="file-list">
                        {files.map((file, index) => (
                            <li
                                key={file.name + index}
                                className="file-item"
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropFile(e, index)}
                            >
                                <span>{index + 1}. {file.name}</span>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(index)}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
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
