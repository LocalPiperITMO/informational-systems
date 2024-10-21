import React from 'react';

interface HumanFormProps {
    humanForm: {
        id: number;
    };
    setHumanForm: React.Dispatch<React.SetStateAction<{
        id: number;
    }>>;
    humans: Array<{ id: number; owner: string; }>;
}

const DeleteHumanForm: React.FC<HumanFormProps> = ({ humanForm, setHumanForm, humans }) => {

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={humanForm.id || ''}
                    onChange={(e) => setHumanForm({...humanForm, id : parseInt(e.target.value)})}
                    required
                >
                    <option value="">Select Human ID</option>
                    {humans
                    .filter(human => human.owner === localStorage.getItem('username') || localStorage.getItem('admin') === 'true')
                    .map(human => (
                        <option key={human.id} value={human.id}>
                            {`ID: ${human.id}`}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default DeleteHumanForm;
