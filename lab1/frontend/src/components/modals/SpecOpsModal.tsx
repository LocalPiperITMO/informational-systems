// src/components/modals/SpecOpsModal.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { calculateTelephoneSum, countMetersAbove, getUniqueMASLValues, relocateCityPopulation, relocateCapitalPopulation } from '../../services/specOpsService';

interface SpecOpsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        cities: any[];
    };
    onSuccess: () => void;
}

const SpecOpsModal: React.FC<SpecOpsModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [metersAboveSeaLevelThreshold, setMetersAboveSeaLevelThreshold] = useState<number>(0);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [selectedCapital, setSelectedCapital] = useState<number | null>(null);
    const [result, setResult] = useState<string | number | null>(null);
    const [uniqueMASLValues, setUniqueMASLValues] = useState<number[]>([]);

    const token = localStorage.getItem('token');

    if (!isOpen) return null;

    // Handle API errors and unauthorized access
    const handleError = (error: any) => {
        if (error.message === "User is unauthorized! Redirecting...") {
            logout();
            navigate("/auth");
        }
        console.error(error);
        alert(`Error: ${error.message}`);
    };

    // Operation 1: Calculate the sum of all telephoneCodes (spec1)
    const handleCalculateTelephoneSum = async () => {
        try {
            const response = await calculateTelephoneSum({ token });
            setResult(response.spec1);  // response.spec1 is the sum of telephone codes
        } catch (error) {
            handleError(error);
        }
    };

    // Operation 2: Count cities with metersAboveSeaLevel greater than the threshold (spec2)
    const handleCountMetersAbove = async () => {
        try {
            const response = await countMetersAbove({ token, spec2: metersAboveSeaLevelThreshold });
            setResult(response.spec2);  // response.spec2 is the count of cities above the threshold
        } catch (error) {
            handleError(error);
        }
    };

    // Operation 3: Get unique metersAboveSeaLevel values (spec3)
    const handleGetUniqueMASL = async () => {
        try {
            const response = await getUniqueMASLValues({ token });
            setUniqueMASLValues(response.spec3);  // response.spec3 is the list of unique MASL values
        } catch (error) {
            handleError(error);
        }
    };

    // Operation 4: Relocate population to the city with the least population (spec4)
    const handleRelocateCityPopulation = async () => {
        if (selectedCity === null) return;
        try {
            await relocateCityPopulation({ token, spec4: selectedCity });
            onSuccess();
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    // Operation 5: Relocate 50% of the capital population to the 3 least populated cities (spec5)
    const handleRelocateCapitalPopulation = async () => {
        if (selectedCapital === null) return;
        try {
            await relocateCapitalPopulation({ token, spec5: selectedCapital });
            onSuccess();
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Special Operations</h2>

                <div style={styles.forms}>
                    {/* Operation 1 */}
                    <div>
                        <button onClick={handleCalculateTelephoneSum}>Calculate Sum of Telephone Codes</button>
                    </div>

                    {/* Operation 2 */}
                    <div>
                        <input
                            type="number"
                            value={metersAboveSeaLevelThreshold}
                            onChange={e => setMetersAboveSeaLevelThreshold(Number(e.target.value))}
                            placeholder="Meters Above Sea Level Threshold"
                        />
                        <button onClick={handleCountMetersAbove}>Count Cities Above MASL</button>
                    </div>

                    {/* Operation 3 */}
                    <div>
                        <button onClick={handleGetUniqueMASL}>Get Unique MASL Values</button>
                    </div>

                    {/* Operation 4 */}
                    <div>
                        <select onChange={e => setSelectedCity(Number(e.target.value))}>
                            <option value={''}>Select City</option>
                            {data.cities
                                .filter(city => city.owner === localStorage.getItem('username') && city.modifiable)
                                .map(city => (
                                    <option key={city.id} value={city.id}>
                                        ID: {city.id}, Name: {city.name}
                                    </option>
                                ))}
                        </select>
                        <button onClick={handleRelocateCityPopulation}>Relocate City Population</button>
                    </div>

                    {/* Operation 5 */}
                    <div>
                        <select onChange={e => setSelectedCapital(Number(e.target.value))}>
                            <option value={''}>Select Capital City</option>
                            {data.cities
                                .filter(city => city.owner === localStorage.getItem('username') && city.capital && city.modifiable)
                                .map(city => (
                                    <option key={city.id} value={city.id}>
                                        ID: {city.id}, Name: {city.name}
                                    </option>
                                ))}
                        </select>
                        <button onClick={handleRelocateCapitalPopulation}>Relocate 50% Capital Population</button>
                    </div>
                </div>

                {/* Result Window */}
                <div style={styles.resultWindow}>
                    {typeof result === 'number' && <p>Result: {result}</p>}
                    {uniqueMASLValues.length > 0 && (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Unique MASL Values</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueMASLValues.map(value => (
                                    <tr key={value}>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
};

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '100%',
    },
    forms: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '10px',
        marginBottom: '20px',
    },
    resultWindow: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#f9f9f9',
    },
};

export default SpecOpsModal;
