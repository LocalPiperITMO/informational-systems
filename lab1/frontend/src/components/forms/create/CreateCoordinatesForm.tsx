// src/components/modals/CreateCoordinatesForm.tsx
import React from 'react';

interface CoordinatesFormProps {
    coordinatesForm: {
        x: number;
        y: number;
        modifiable: boolean;
    };
    setCoordinatesForm: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
        modifiable: boolean;
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
                    step={0.00000001}
                    value={coordinatesForm.y}
                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, y: parseFloat(e.target.value) })}
                    required
                    min={-273}
                    max={273}
                />
            </div>
            <div>
                <label>Modifiable?</label>
                <input
                    type="checkbox"
                    checked={coordinatesForm.modifiable}
                    onChange={(e) => setCoordinatesForm({ ...coordinatesForm, modifiable: e.target.checked })}
                />
            </div>
        </>
    );
};

export default CreateCoordinatesForm;
