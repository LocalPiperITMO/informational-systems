// src/components/modals/CreateModal.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

enum ObjectType {
    CITY = 'City',
    COORDINATES = 'Coordinates',
    HUMAN = 'Human',
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const [objectType, setObjectType] = useState<ObjectType | null>(ObjectType.CITY);

    // Form State for City, Coordinates, and Human
    const [cityForm, setCityForm] = useState({
        name: '',
        area: 0,
        population: 0,
        establishmentDate: '',
        capital: false,
        metersAboveSeaLevel: 0,
        telephoneCode: 0,
        climate: '',
        government: '',
    });

    const [coordinatesForm, setCoordinatesForm] = useState({
        x: 0,
        y: 0
    });

    const [humanForm, setHumanForm] = useState({
        age: 0
    });

    if (!isOpen) return null;

    const handleObjectTypeChange = (type: ObjectType) => {
        setObjectType(type);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (objectType === ObjectType.CITY) {
            console.log('Submitting City:', cityForm);
        } else if (objectType === ObjectType.COORDINATES) {
            console.log('Submitting Coordinates:', coordinatesForm);
        } else if (objectType === ObjectType.HUMAN) {
            console.log('Submitting Human:', humanForm);
        }
        onClose(); // Close the modal after submission
    };

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Create New {objectType}</h2>

                {/* Object Type Switcher */}
                <div style={styles.switcher}>
                    <button onClick={() => handleObjectTypeChange(ObjectType.CITY)}>City</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.COORDINATES)}>Coordinates</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.HUMAN)}>Human</button>
                </div>

                <form onSubmit={handleSubmit}>

                    {objectType === ObjectType.CITY && (
                        <>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={cityForm.name}
                                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Area:</label>
                                <input
                                    type="number"
                                    value={cityForm.area}
                                    onChange={(e) => setCityForm({ ...cityForm, area: parseFloat(e.target.value) })}
                                    required
                                    min={0}
                                />
                            </div>
                            <div>
                                <label>Population:</label>
                                <input
                                    type="number"
                                    value={cityForm.population}
                                    onChange={(e) => setCityForm({ ...cityForm, population: parseInt(e.target.value) })}
                                    required
                                    min={0}
                                />
                            </div>
                            <div>
                                <label>Establishment Date:</label>
                                <input
                                    type="date"
                                    value={cityForm.establishmentDate}
                                    onChange={(e) => setCityForm({ ...cityForm, establishmentDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Capital:</label>
                                <input
                                    type="checkbox"
                                    checked={cityForm.capital}
                                    onChange={(e) => setCityForm({ ...cityForm, capital: e.target.checked })}
                                />
                            </div>
                            <div>
                                <label>Meters Above Sea Level:</label>
                                <input
                                    type="number"
                                    value={cityForm.metersAboveSeaLevel}
                                    onChange={(e) => setCityForm({ ...cityForm, metersAboveSeaLevel: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label>Telephone Code:</label>
                                <input
                                    type="number"
                                    value={cityForm.telephoneCode}
                                    onChange={(e) => setCityForm({ ...cityForm, telephoneCode: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Climate:</label>
                                <select
                                    value={cityForm.climate}
                                    onChange={(e) => setCityForm({ ...cityForm, climate: e.target.value })}
                                    required
                                >
                                    <option value="">Select Climate</option>
                                    <option value="MONSOON">Monsoon</option>
                                    <option value="SUBARCTIC">Subarctic</option>
                                    <option value="POLAR_ICECAP">Polar Icecap</option>
                                    <option value="DESERT">Desert</option>
                                </select>
                            </div>
                            <div>
                                <label>Government:</label>
                                <select
                                    value={cityForm.government}
                                    onChange={(e) => setCityForm({ ...cityForm, government: e.target.value })}
                                    required
                                >
                                    <option value="">Select Government</option>
                                    <option value="DICTATORSHIP">Dictatorship</option>
                                    <option value="NOOCRACY">Noocracy</option>
                                    <option value="REPUBLIC">Republic</option>
                                    <option value="STRATOCRACY">Stratocracy</option>
                                </select>
                            </div>
                        </>
                    )}

                    {objectType === ObjectType.COORDINATES && (
                        <>
                            <div>
                                <label>X:</label>
                                <input
                                    type="number"
                                    value={coordinatesForm.x}
                                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, x: parseInt(e.target.value) })}
                                    required
                                    min={-443}
                                    max={443}
                                />
                            </div>
                            <div>
                                <label>Y:</label>
                                <input
                                    type="number"
                                    value={coordinatesForm.y}
                                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, y: parseFloat(e.target.value) })}
                                    required
                                    min={273}
                                    max={273}
                                />
                            </div>
                        </>
                    )}

                    {objectType === ObjectType.HUMAN && (
                        <>
                            <div>
                                <label>Age:</label>
                                <input
                                    type="number"
                                    value={humanForm.age}
                                    onChange={(e) => setHumanForm({ ...humanForm, age: parseInt(e.target.value) })}
                                    required
                                    min={1}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '100%',
    },
    switcher: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-around',
    }
};

export default CreateModal;
