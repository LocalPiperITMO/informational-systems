import React from 'react';

interface HumanFormProps {
    humanForm: {
        id: number;
        age: number;
        modifiable: boolean;
    };
    setHumanForm: React.Dispatch<React.SetStateAction<{
        id: number;
        age: number;
        modifiable: boolean;
    }>>;
    humans: Array<{ id: number; age: number; owner: string; modifiable: boolean }>;
}

const UpdateHumanForm: React.FC<HumanFormProps> = ({ humanForm, setHumanForm, humans }) => {
    
    const handleIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedHuman = humans.find(human => human.id === selectedId);
        
        if (selectedHuman) {
            setHumanForm({
                ...selectedHuman, // Populate form with selected human's data
                modifiable: selectedHuman.modifiable
            });
        } else {
            // Reset the form if no valid ID is selected
            setHumanForm({
                id: 0,
                age: 0,
                modifiable: false
            });
        }
    };

    const isFormDisabled = humanForm.id === 0 || !humanForm.modifiable;

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={humanForm.id || ''}
                    onChange={handleIdChange}
                    required
                >
                    <option value="">Select Human ID</option>
                    {humans
                    .filter(human => human.owner === localStorage.getItem('username'))
                    .filter(human => human.modifiable)
                    .map(human => (
                        <option key={human.id} value={human.id}>
                            {`ID: ${human.id}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Age:</label>
                <input
                    type="number"
                    value={humanForm.age}
                    onChange={(e) => setHumanForm({ ...humanForm, age: parseInt(e.target.value) })}
                    required
                    min={1}
                    disabled={isFormDisabled}
                />
            </div>
        </>
    );
};

export default UpdateHumanForm;
