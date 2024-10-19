// src/components/modals/CreateModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import DeleteCityForm from '../forms/delete/DeleteCityForm';
import DeleteCoordinatesForm from '../forms/delete/DeleteCoordinatesForm';
import DeleteHumanForm from '../forms/delete/DeleteHumanForm';
import { deleteCity, deleteCoordinates, deleteHuman } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DeleteModalProps {
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

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [objectType, setObjectType] = useState<ObjectType | null>(ObjectType.CITY);
    const [cityForm, setCityForm] = useState({
        id: 0
    });

    const [coordinatesForm, setCoordinatesForm] = useState({
        id: 0
    });

    const [humanForm, setHumanForm] = useState({
        id: 0
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
                    id: cityForm.id,
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await deleteCity(cityData);
                console.log('City deleted successfully');
            } else if (objectType === ObjectType.COORDINATES) {
                const coordinatesData = {
                    id: coordinatesForm.id,
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await deleteCoordinates(coordinatesData);
                console.log('Coordinates deleted successfully');
            } else if (objectType === ObjectType.HUMAN) {
                const humanData = {
                    id: humanForm.id,
                    token: localStorage.getItem('token')? localStorage.getItem('token') : "error"
                };
                await deleteHuman(humanData);
                console.log('Human deleted successfully');
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
                <h2>Delete {objectType}</h2>

                {/* Object Type Switcher */}
                <div style={styles.switcher}>
                    <button onClick={() => handleObjectTypeChange(ObjectType.CITY)}>City</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.COORDINATES)}>Coordinates</button>
                    <button onClick={() => handleObjectTypeChange(ObjectType.HUMAN)}>Human</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {objectType === ObjectType.CITY && (
                        <DeleteCityForm 
                            cityForm={cityForm} 
                            setCityForm={setCityForm} 
                            cities={data.cities}
                        />
                    )}

                    {objectType === ObjectType.COORDINATES && (
                        <DeleteCoordinatesForm coordinatesForm={coordinatesForm} setCoordinatesForm={setCoordinatesForm} coordinates={data.coordinates}/>
                    )}

                    {objectType === ObjectType.HUMAN && (
                        <DeleteHumanForm humanForm={humanForm} setHumanForm={setHumanForm} humans={data.humans}/>
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

export default DeleteModal;
