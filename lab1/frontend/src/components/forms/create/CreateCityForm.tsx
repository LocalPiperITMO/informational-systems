// src/components/modals/CreateCityForm.tsx
import React from 'react';

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
    }>>;
}

const CreateCityForm: React.FC<CityFormProps> = ({ cityForm, setCityForm }) => {
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
                    value={cityForm.establishmentDate}
                    onChange={(e) => setCityForm({ ...cityForm, establishmentDate: e.target.value })}
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
        </>
    );
};

export default CreateCityForm;
