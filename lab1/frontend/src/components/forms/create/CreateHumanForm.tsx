// src/components/modals/CreateHumanForm.tsx
import React from 'react';

interface HumanFormProps {
    humanForm: {
        age: number;
    };
    setHumanForm: React.Dispatch<React.SetStateAction<{
        age: number;
    }>>;
}

const CreateHumanForm: React.FC<HumanFormProps> = ({ humanForm, setHumanForm }) => {
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
        </>
    );
};

export default CreateHumanForm;
