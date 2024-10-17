// src/components/modals/CreateCityForm.tsx
import React from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface CityFormProps {
    cityForm: {
        name: string;
        area: number;
        population: number;
        establishmentDate: string;
        capital: boolean;
        metersAboveSeaLevel: number;
        telephoneCode: number;
        climate: string;
        government: string;
        coordinatesId: string;
        humanId: string;
    };
    setCityForm: React.Dispatch<React.SetStateAction<{
        name: string;
        area: number;
        population: number;
        establishmentDate: string;
        capital: boolean;
        metersAboveSeaLevel: number;
        telephoneCode: number;
        climate: string;
        government: string;
        coordinatesId: string; 
        humanId: string;       
    }>>;
    coordinates: Array<{ id: string; x: number; y: number }>; // Prop for available coordinates
    humans: Array<{ id: string; age: number }>;             // Prop for available humans
}

const CreateCityForm: React.FC<CityFormProps> = ({ cityForm, setCityForm, coordinates, humans }) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const localDate = new Date(e.target.value);
        const zonedDate = dayjs(localDate).utc().format();
        setCityForm({ ...cityForm, establishmentDate: zonedDate });
    }
    
    return (
        <>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Area:</label>
                <input
                    type="number"
                    value={cityForm.area}
                    onChange={(e) => setCityForm({ ...cityForm, area: parseFloat(e.target.value) })}
                    required
                    min={0}
                />
            </div>
            <div>
                <label>Population:</label>
                <input
                    type="number"
                    value={cityForm.population}
                    onChange={(e) => setCityForm({ ...cityForm, population: parseInt(e.target.value) })}
                    required
                    min={0}
                />
            </div>
            <div>
                <label>Establishment Date:</label>
                <input
                    type="date"
                    value={dayjs(cityForm.establishmentDate).format('YYYY-MM-DD')}
                    onChange={handleDateChange}
                />
            </div>
            <div>
                <label>Capital:</label>
                <input
                    type="checkbox"
                    checked={cityForm.capital}
                    onChange={(e) => setCityForm({ ...cityForm, capital: e.target.checked })}
                />
            </div>
            <div>
                <label>Meters Above Sea Level:</label>
                <input
                    type="number"
                    value={cityForm.metersAboveSeaLevel}
                    onChange={(e) => setCityForm({ ...cityForm, metersAboveSeaLevel: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Telephone Code:</label>
                <input
                    type="number"
                    value={cityForm.telephoneCode}
                    onChange={(e) => setCityForm({ ...cityForm, telephoneCode: parseInt(e.target.value) })}
                    required
                />
            </div>
            <div>
                <label>Climate:</label>
                <select
                    value={cityForm.climate}
                    onChange={(e) => setCityForm({ ...cityForm, climate: e.target.value })}
                    required
                >
                    <option value="">Select Climate</option>
                    <option value="MONSOON">Monsoon</option>
                    <option value="SUBARCTIC">Subarctic</option>
                    <option value="POLAR_ICECAP">Polar Icecap</option>
                    <option value="DESERT">Desert</option>
                </select>
            </div>
            <div>
                <label>Government:</label>
                <select
                    value={cityForm.government}
                    onChange={(e) => setCityForm({ ...cityForm, government: e.target.value })}
                    required
                >
                    <option value="">Select Government</option>
                    <option value="DICTATORSHIP">Dictatorship</option>
                    <option value="NOOCRACY">Noocracy</option>
                    <option value="REPUBLIC">Republic</option>
                    <option value="STRATOCRACY">Stratocracy</option>
                </select>
            </div>
            <div>
                <label>Coordinates:</label>
                <select
                    value={cityForm.coordinatesId}
                    onChange={(e) => setCityForm({ ...cityForm, coordinatesId: e.target.value })}
                    required
                >
                    <option value="">Select Coordinates</option>
                    {coordinates.map(coord => (
                        <option key={coord.id} value={coord.id}>
                            {`X: ${coord.x}, Y: ${coord.y}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Human:</label>
                <select
                    value={cityForm.humanId}
                    onChange={(e) => setCityForm({ ...cityForm, humanId: e.target.value })}
                >
                    <option value="">Select Human (optional)</option>
                    {humans.map(human => (
                        <option key={human.id} value={human.id}>
                            {`Age: ${human.age}`}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default CreateCityForm;
