import React from 'react';

interface CoordinatesFormProps {
    coordinatesForm: {
        id: number;
        x: number;
        y: number;
        modifiable: boolean;
    };
    setCoordinatesForm: React.Dispatch<React.SetStateAction<{
        id: number;
        x: number;
        y: number;
        modifiable: boolean;
    }>>;
    coordinates: Array<{ id: number; x: number; y: number; owner: string; modifiable: boolean }>;
}

const UpdateCoordinatesForm: React.FC<CoordinatesFormProps> = ({ coordinatesForm, setCoordinatesForm, coordinates }) => {
    
    const handleIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedCoordinates = coordinates.find(coord => coord.id === selectedId);
        
        if (selectedCoordinates) {
            setCoordinatesForm({
                ...selectedCoordinates, // Populate form with selected coordinates' data
                modifiable: selectedCoordinates.modifiable
            });
        } else {
            // Reset the form if no valid ID is selected
            setCoordinatesForm({
                id: 0,
                x: 0,
                y: 0,
                modifiable: false
            });
        }
    };

    const isFormDisabled = coordinatesForm.id === 0 || !coordinatesForm.modifiable;

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={coordinatesForm.id || ''}
                    onChange={handleIdChange}
                    required
                >
                    <option value="">Select Coordinates ID</option>
                    {coordinates
                    .filter(coord => coord.owner === localStorage.getItem('username') || localStorage.getItem('admin') === 'true')
                    .filter(coord => coord.modifiable)
                    .map(coord => (
                        <option key={coord.id} value={coord.id}>
                            {`ID: ${coord.id}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>X:</label>
                <input
                    type="number"
                    value={coordinatesForm.x}
                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, x: parseInt(e.target.value) })}
                    required
                    min={-443}
                    max={443}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Y:</label>
                <input
                    type="number"
                    step={0.00000001}
                    value={coordinatesForm.y}
                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, y: parseFloat(e.target.value) })}
                    required
                    min={-273}
                    max={273}
                    disabled={isFormDisabled}
                />
            </div>
        </>
    );
};

export default UpdateCoordinatesForm;
