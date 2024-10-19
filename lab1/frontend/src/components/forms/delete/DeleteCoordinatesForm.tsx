import React from 'react';

interface CoordinatesFormProps {
    coordinatesForm: {
        id: number;
    };
    setCoordinatesForm: React.Dispatch<React.SetStateAction<{
        id: number;
    }>>;
    coordinates: Array<{ id: number; owner: string; }>;
}

const DeleteCoordinatesForm: React.FC<CoordinatesFormProps> = ({ coordinatesForm, setCoordinatesForm, coordinates }) => {

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={coordinatesForm.id || ''}
                    onChange={(e) => setCoordinatesForm({...coordinatesForm, id: parseInt(e.target.value)})}
                    required
                >
                    <option value="">Select Coordinates ID</option>
                    {coordinates
                    .filter(coord => coord.owner === localStorage.getItem('username'))
                    .map(coord => (
                        <option key={coord.id} value={coord.id}>
                            {`ID: ${coord.id}`}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default DeleteCoordinatesForm;
