// src/components/modals/CreateModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import UpdateCityForm from '../forms/update/UpdateCityForm';
import UpdateCoordinatesForm from '../forms/update/UpdateCoordinatesForm';
import UpdateHumanForm from '../forms/update/UpdateHumanForm';
import { updateCity, updateCoordinates, updateHuman } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UpdateModalProps {
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

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [objectType, setObjectType] = useState<ObjectType | null>(ObjectType.CITY);
    const [cityForm, setCityForm] = useState({
        id: 0,
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
        id: 0,
        x: 0,
        y: 0,
        modifiable: false
    });

    const [humanForm, setHumanForm] = useState({
        id: 0,
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
                await updateCity(cityData);
                console.log('City updated successfully');
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
                await updateCoordinates(coordinatesData);
                console.log('Coordinates updated successfully');
            } else if (objectType === ObjectType.HUMAN) {
                const humanData = {
                    human: {
                        age: humanForm.age,
                        modifiable: humanForm.modifiable,
                        owner: localStorage.getItem('username')? localStorage.getItem('username') : ""
                    },
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await updateHuman(humanData);
                console.log('Human updated successfully');
            }
            onSuccess();
            onClose(); // Close the modal after successful submission
        } catch (error : any) {
            if (error.message === "User is unauthorized! Redirecting...") {
                logout();
                navigate("/auth");
            }
            console.error(error);
            alert(`Error: ${error.message}`); // Alert the user in case of error
        }
    };

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Update {objectType}</h2>

                {/* Object Type Switcher */}
                <div style={styles.switcher}>
                    <button onClick={() => handleObjectTypeChange(ObjectType.CITY)}>City</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.COORDINATES)}>Coordinates</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.HUMAN)}>Human</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {objectType === ObjectType.CITY && (
                        <UpdateCityForm 
                            cityForm={cityForm} 
                            setCityForm={setCityForm} 
                            coordinates={data.coordinates}  // Pass coordinates
                            humans={data.humans}            // Pass humans
                            cities={data.cities}
                        />
                    )}

                    {objectType === ObjectType.COORDINATES && (
                        <UpdateCoordinatesForm coordinatesForm={coordinatesForm} setCoordinatesForm={setCoordinatesForm} />
                    )}

                    {objectType === ObjectType.HUMAN && (
                        <UpdateHumanForm humanForm={humanForm} setHumanForm={setHumanForm} />
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

export default UpdateModal;