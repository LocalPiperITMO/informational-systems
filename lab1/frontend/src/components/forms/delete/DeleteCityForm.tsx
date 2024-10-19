import React from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface CityFormProps {
    cityForm: {
        id: number;
    };
    setCityForm: React.Dispatch<React.SetStateAction<{
        id: number;   
    }>>;
    cities: Array<{ 
        id: number;
        owner: string;
    }>;
}

const DeleteCityForm: React.FC<CityFormProps> = ({ cityForm, setCityForm, cities }) => {

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={cityForm.id || ''}
                    onChange={(e) => setCityForm({...cityForm, id: parseInt(e.target.value)})}
                    required
                >
                    <option value="">Select ID</option>
                    {cities
                    .filter(city => city.owner === localStorage.getItem('username'))
                    .map(city => (
                        <option key={city.id} value={city.id}>
                            {`ID: ${city.id}`}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default DeleteCityForm;
