// src/components/modals/CreateModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CreateCityForm from '../forms/create/CreateCityForm';
import CreateCoordinatesForm from '../forms/create/CreateCoordinatesForm';
import CreateHumanForm from '../forms/create/CreateHumanForm';
import { createCity, createCoordinates, createHuman } from '../../services/apiService'; // Import the new service
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateModal.css'; // Import the new CSS file

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        cities: any[];
        coordinates: any[];
        humans: any[];
    };
    onSuccess: () => void;
}

enum ObjectType {
    CITY = 'City',
    COORDINATES = 'Coordinates',
    HUMAN = 'Human',
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [objectType, setObjectType] = useState<ObjectType | null>(ObjectType.CITY);
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
        coordinatesId: '',
        humanId: '',
        modifiable: false
    });

    const [coordinatesForm, setCoordinatesForm] = useState({
        x: 0,
        y: 0,
        modifiable: false
    });

    const [humanForm, setHumanForm] = useState({
        age: 0,
        modifiable: false
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
                    modifiable: cityForm.modifiable,
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error",
                    owner: localStorage.getItem('username')? localStorage.getItem('username') : ""
                };
                await createCity(cityData);
                console.log('City created successfully');
            } else if (objectType === ObjectType.COORDINATES) {
                const coordinatesData = {
                    coordinates: {
                        x: coordinatesForm.x,
                        y: coordinatesForm.y,
                        modifiable: coordinatesForm.modifiable,
                        owner: localStorage.getItem('username')? localStorage.getItem('username') : ""
                    },
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await createCoordinates(coordinatesData);
                console.log('Coordinates created successfully');
            } else if (objectType === ObjectType.HUMAN) {
                const humanData = {
                    human: {
                        age: humanForm.age,
                        modifiable: humanForm.modifiable,
                        owner: localStorage.getItem('username')? localStorage.getItem('username') : ""
                    },
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await createHuman(humanData);
                console.log('Human created successfully');
            }
            onSuccess();
            onClose(); // Close the modal after successful submission
        } catch (error: any) {
            if (error.message === "User is unauthorized! Redirecting...") {
                logout();
                navigate("/auth");
            }
            console.error(error);
            alert(`Error: ${error.message}`); // Alert the user in case of error
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Create New {objectType}</h2>

                {/* Object Type Switcher */}
                <div className="object-type-switcher">
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

                    <div className="button-container">
                        <button type="submit" className="submit-button">Submit</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

export default CreateModal;
