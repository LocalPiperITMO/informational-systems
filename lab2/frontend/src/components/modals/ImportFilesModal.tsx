import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import '../../styles/ImportFileModal.css';

interface ImportFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ImportFilesModal: React.FC<ImportFilesModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [files, setFiles] = useState<File[]>([]);
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

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedFiles = Array.from(files);
        const [removed] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, removed);

        setFiles(reorderedFiles);
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
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="fileQueue">
                            {(provided) => (
                                <ul
                                    className="file-list"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {files.map((file, index) => (
                                        <Draggable
                                            key={file.name + index}
                                            draggableId={file.name + index}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="file-item"
                                                >
                                                    <span>{index + 1}. {file.name}</span>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        ✖
                                                    </button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
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
