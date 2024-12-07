import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import '../../styles/ImportFileModal.css';
import { importFiles } from '../../services/fileService';

interface ImportFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const exampleTOML = `
[[createQuery]]
type = "human"
data = { age = 52, isModifiable = true }

[[createQuery]]
type = "coordinates"
data = { x = 1, y = -1.234, isModifiable = true }

[[createQuery]]
type = "city"
data = { name = "Springfield", coordinates = 75, governor = { age = 30, isModifiable = true }, area = 1200.5, population = 500000, capital = true, metersAboveSeaLevel = 50, establishmentDate = "2022-01-01T00:00:00Z", telephoneCode = 12345, climate = "MONSOON", government = "NOOCRACY", isModifiable = true }
`;

const ImportFilesModal: React.FC<ImportFilesModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showExample, setShowExample] = useState(false);
    const [logs, setLogs] = useState<string[]>([]); // Store logs from the backend
    const [isLogModalOpen, setLogModalOpen] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('No files selected for submission.');
            return;
        }
        setError(null);
        try {
            const data = {
                token: localStorage.getItem('token'),
                files: files
            };
            const response = await importFiles(data);
            setFiles([]);
            setLogs(response.results || []);
            setLogModalOpen(true);
        } catch (err) {
            setError('Failed to upload files. Please try again.');
            console.error(err);
        }
    };

    const closeLogModal = () => {
        setLogModalOpen(false);
        onSuccess(); // Call onSuccess after closing the modal
        onClose(); // Call onClose after onSuccess
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
                    <button onClick={() => setShowExample(true)} className="example-button">
                        Show Example
                    </button>
                </div>

                {showExample && (
                    <div className="example-modal">
                        <div className="example-content">
                            <h3>Example TOML File</h3>
                            <pre className="example-code">{exampleTOML}</pre>
                            <button
                                className="close-example-button"
                                onClick={() => setShowExample(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {isLogModalOpen && (
                    <div className="log-modal">
                        <div className="log-modal-content">
                            <h3>Import Logs</h3>
                            <div className="log-content">
                                {logs.length > 0 ? (
                                    logs.map((log, index) => {
                                        let logClass = '';
                                        if (log.startsWith('[SUCCESS]')) {
                                            logClass = 'log-success';
                                        } else if (log.startsWith('[ERROR]')) {
                                            logClass = 'log-error';
                                        } else if (log.startsWith('    [CONSTRAINT]')) {
                                            logClass = 'log-constraint';
                                        }

                                        return (
                                            <pre key={index} className={`log-entry ${logClass}`}>
                                                {log}
                                            </pre>
                                        );
                                    })
                                ) : (
                                    <p>No logs available.</p>
                                )}
                            </div>
                            <button onClick={closeLogModal} className="close-button">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default ImportFilesModal;
