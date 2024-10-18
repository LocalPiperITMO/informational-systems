import React from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface CityFormProps {
    cityForm: {
        id: number;
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
        modifiable: boolean;
    };
    setCityForm: React.Dispatch<React.SetStateAction<{
        id: number;
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
        modifiable: boolean;       
    }>>;
    coordinates: Array<{ id: string; x: number; y: number, owner: string }>;
    humans: Array<{ id: string; age: number, owner: string }>;
    cities: Array<{ 
        id: number;
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
        modifiable: boolean;
        owner: string;
    }>;
}

const UpdateCityForm: React.FC<CityFormProps> = ({ cityForm, setCityForm, coordinates, humans, cities }) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const localDate = new Date(e.target.value);
        const zonedDate = dayjs(localDate).utc().format();
        setCityForm({ ...cityForm, establishmentDate: zonedDate });
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedCity = cities.find(city => city.id === selectedId);
        
        if (selectedCity) {
            setCityForm({
                ...selectedCity, // Populate form with selected city's data
            });
        } else {
            setCityForm({
                id: selectedId,
                name: '',
                area: 0,
                population: 0,
                establishmentDate: '',
                capital: false,
                metersAboveSeaLevel: 0,
                telephoneCode: 0,
                climate: '',
                government: '',
                coordinatesId: '',
                humanId: '',
                modifiable: false,
            });
        }
    };

    const isFormDisabled = cityForm.id === 0 || !cityForm.modifiable;

    return (
        <>
            <div>
                <label>ID:</label>
                <select
                    value={cityForm.id || ''}
                    onChange={handleIdChange}
                    required
                >
                    <option value="">Select ID</option>
                    {cities
                    .filter(city => city.owner === localStorage.getItem('username'))
                    .filter(city => city.modifiable)
                    .map(city => (
                        <option key={city.id} value={city.id}>
                            {`ID: ${city.id}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                    required
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Area:</label>
                <input
                    type="number"
                    value={cityForm.area}
                    step={0.00000001}
                    onChange={(e) => setCityForm({ ...cityForm, area: parseFloat(e.target.value) })}
                    required
                    min={0.00000001}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Population:</label>
                <input
                    type="number"
                    value={cityForm.population}
                    onChange={(e) => setCityForm({ ...cityForm, population: parseInt(e.target.value) })}
                    required
                    min={1}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Establishment Date:</label>
                <input
                    type="date"
                    value={cityForm.establishmentDate ? dayjs(cityForm.establishmentDate).format('YYYY-MM-DD') : ''}
                    onChange={handleDateChange}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Capital:</label>
                <input
                    type="checkbox"
                    checked={cityForm.capital}
                    onChange={(e) => setCityForm({ ...cityForm, capital: e.target.checked })}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Meters Above Sea Level:</label>
                <input
                    type="number"
                    value={cityForm.metersAboveSeaLevel}
                    onChange={(e) => setCityForm({ ...cityForm, metersAboveSeaLevel: parseInt(e.target.value) })}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Telephone Code:</label>
                <input
                    type="number"
                    value={cityForm.telephoneCode}
                    onChange={(e) => setCityForm({ ...cityForm, telephoneCode: parseInt(e.target.value) })}
                    required
                    min={1}
                    max={100000}
                    disabled={isFormDisabled}
                />
            </div>
            <div>
                <label>Climate:</label>
                <select
                    value={cityForm.climate}
                    onChange={(e) => setCityForm({ ...cityForm, climate: e.target.value })}
                    required
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                >
                    <option value="">Select Government (optional)</option>
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
                    disabled={isFormDisabled}
                >
                    <option value="">Select Coordinates</option>
                    {coordinates
                    .filter(coord => coord.owner === localStorage.getItem('username'))
                    .map(coord => (
                        <option key={coord.id} value={coord.id}>
                            {`ID: ${coord.id}, X: ${coord.x}, Y: ${coord.y}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Human:</label>
                <select
                    value={cityForm.humanId}
                    onChange={(e) => setCityForm({ ...cityForm, humanId: e.target.value })}
                    disabled={isFormDisabled}
                >
                    <option value="">Select Human (optional)</option>
                    {humans
                    .filter(human => human.owner === localStorage.getItem('username'))
                    .map(human => (
                        <option key={human.id} value={human.id}>
                            {`ID: ${human.id}, Age: ${human.age}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Modifiable?</label>
                <input
                    type="checkbox"
                    checked={cityForm.modifiable}
                    onChange={(e) => setCityForm({ ...cityForm, modifiable: e.target.checked })}
                    disabled={isFormDisabled}
                />
            </div>
        </>
    );
};

export default UpdateCityForm;
