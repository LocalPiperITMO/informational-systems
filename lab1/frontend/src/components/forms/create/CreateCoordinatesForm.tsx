// src/components/modals/CreateCoordinatesForm.tsx
import React from 'react';

interface CoordinatesFormProps {
    coordinatesForm: {
        x: number;
        y: number;
    };
    setCoordinatesForm: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    }>>;
}

const CreateCoordinatesForm: React.FC<CoordinatesFormProps> = ({ coordinatesForm, setCoordinatesForm }) => {
    return (
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
    );
};

export default CreateCoordinatesForm;
