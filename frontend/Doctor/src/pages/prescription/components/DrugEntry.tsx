// DrugEntry.tsx
import React from 'react';
import './PrescriptionForm.css';
import type {Drug} from "../util/prescriptions.types.ts";

interface DrugEntryProps {
    drug: Drug;
    onRemove: (id: string) => void;
    onChange: (id: string, field: keyof Drug, value: string) => void;
    showRemove: boolean;
}

const DrugEntry: React.FC<DrugEntryProps> = ({drug, onRemove, onChange, showRemove}) => {
    return (<div className="drug-entry">
            <div className="form-group">
                <label>Drug Name:</label>
                <input
                    type="text"
                    value={drug.name}
                    onChange={(e) => onChange(drug.id, 'name', e.target.value)}
                    required
                />
            </div>
            {/* Other drug fields... */}
            {showRemove && (<button
                    type="button"
                    className="remove-drug-btn"
                    onClick={() => onRemove(drug.id)}
                >
                    Remove
                </button>)}
        </div>);
};

export default DrugEntry;
