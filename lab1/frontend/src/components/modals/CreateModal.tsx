// src/components/modals/CreateModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CreateCityForm from '../forms/create/CreateCityForm';
import CreateCoordinatesForm from '../forms/create/CreateCoordinatesForm';
import CreateHumanForm from '../forms/create/CreateHumanForm';
import { createCity, createCoordinates, createHuman } from '../../services/apiService'; // Import the new service

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        cities: any[];
        coordinates: any[];
        humans: any[];
    };
}

enum ObjectType {
    CITY = 'City',
    COORDINATES = 'Coordinates',
    HUMAN = 'Human',
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, data }) => {
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
        coordinatesId: '',  // New field for selected Coordinates
        humanId: ''          // New field for selected Human
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (objectType === ObjectType.CITY) {
                const cityData = {
                    name: cityForm.name,
                    area: cityForm.area,
                    population: cityForm.population,
                    establishmentDate: cityForm.establishmentDate,
                    capital: cityForm.capital,
                    metersAboveSeaLevel: cityForm.metersAboveSeaLevel,
                    telephoneCode: cityForm.telephoneCode,
                    climate: cityForm.climate,
                    government: cityForm.government,
                    coordinatesId: cityForm.coordinatesId,
                    humanId: cityForm.humanId,
                    token: "your-token-here"  // Add any necessary token if required
                };
                await createCity(cityData);
                console.log('City created successfully');
            } else if (objectType === ObjectType.COORDINATES) {
                const coordinatesData = {
                    coordinates: {
                        x: coordinatesForm.x,
                        y: coordinatesForm.y
                    },
                    token: "your-token-here"
                };
                await createCoordinates(coordinatesData);
                console.log('Coordinates created successfully');
            } else if (objectType === ObjectType.HUMAN) {
                const humanData = {
                    human: {
                        age: humanForm.age
                    },
                    token: "your-token-here"
                };
                await createHuman(humanData);
                console.log('Human created successfully');
            }
            onClose(); // Close the modal after successful submission
        } catch (error : any) {
            console.error(error);
            alert(`Error: ${error.message}`); // Alert the user in case of error
        }
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
                        <CreateCityForm 
                            cityForm={cityForm} 
                            setCityForm={setCityForm} 
                            coordinates={data.coordinates}  // Pass coordinates
                            humans={data.humans}            // Pass humans
                        />
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
