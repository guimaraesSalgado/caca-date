import React from 'react';

const FormSelect = ({ id, label, options = [], ...props }) => (
    <div className="form-section">
        <label htmlFor={id}>{label}</label>
        <select id={id} {...props}>
            <option value="">{props.placeholder}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default FormSelect;

