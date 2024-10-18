// src/components/modals/CreateHumanForm.tsx
import React from 'react';

interface HumanFormProps {
    humanForm: {
        age: number;
        modifiable: boolean;
    };
    setHumanForm: React.Dispatch<React.SetStateAction<{
        age: number;
        modifiable: boolean;
    }>>;
}

const UpdateHumanForm: React.FC<HumanFormProps> = ({ humanForm, setHumanForm }) => {
    return (
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
            <div>
                <label>Modifiable?</label>
                <input
                    type="checkbox"
                    checked={humanForm.modifiable}
                    onChange={(e) => setHumanForm({ ...humanForm, modifiable: e.target.checked })}
                />
            </div>
        </>
    );
};

export default UpdateHumanForm;
