// CreateModal.tsx
import React, { useState } from 'react';
import '../../styles/Modal.css'; // Add styles for modal

const objectTypes = {
  City: ['Name', 'Area', 'Population', 'Capital', 'Telephone Code', 'Climate'],
  Coordinates: ['X', 'Y'],
  Human: ['Name', 'Age']
};

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<string>('City');
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [modifiable, setModifiable] = useState(false);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setFormData({}); // Reset form data on type change
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModifiableChange = () => {
    setModifiable(!modifiable);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ ...formData, modifiable });
  };

  const inputFields = objectTypes[selectedType as keyof typeof objectTypes].map((field : any) => (
    <div key={field}>
      <label>{field}:</label>
      <input type="text" name={field} onChange={handleChange} />
    </div>
  ));

// CreateModal.tsx
return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Create New {selectedType}</h2>
  
        <label htmlFor="object-type">Select Object Type:</label>
        <select id="object-type" onChange={handleTypeChange}>
          {Object.keys(objectTypes).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
  
        <form onSubmit={handleSubmit}>
          {inputFields}
  
          <div>
            <label>
              <input
                type="checkbox"
                checked={modifiable}
                onChange={handleModifiableChange}
              />
              Modifiable?
            </label>
          </div>
  
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );  }

export default CreateModal;
