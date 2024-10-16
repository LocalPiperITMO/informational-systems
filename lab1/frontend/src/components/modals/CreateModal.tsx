import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CreateCityForm from '../forms/create/CreateCityForm';
import CreateCoordinatesForm from '../forms/create/CreateCoordinatesForm';
import CreateHumanForm from '../forms/create/CreateHumanForm';

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
                        <CreateCityForm cityForm={cityForm} setCityForm={setCityForm} />
                    )}

                    {objectType === ObjectType.COORDINATES && (
                        <CreateCoordinatesForm coordinatesForm={coordinatesForm} setCoordinatesForm={setCoordinatesForm} />
                    )}

                    {objectType === ObjectType.HUMAN && (
                        <CreateHumanForm humanForm={humanForm} setHumanForm={setHumanForm} />
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
