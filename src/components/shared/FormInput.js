import React from 'react';
import './Header.css';

const FormInput = ({ id, label, ...props }) => (
    <div className="form-section">
        <label htmlFor={id}>{label}</label>
        <input id={id} {...props} />
    </div>
);

export default FormInput;

