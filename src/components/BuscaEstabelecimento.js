import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import bannerImage from "../assets/title-caca-date.svg";

import Header from "./shared/Header";
import FormInput from "./shared/FormInput";

import "./BuscaEstabelecimento.css";

const BuscaEstabelecimento = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState("");
  const [isSpinning] = useState(false);
  const [errors, setErrors] = useState({ persona: "", local: "" });

  const validateFields = () => {
    const newErrors = {};
    if (!persona.trim()) newErrors.persona = "⚠️ Este campo deve ser preenchido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Atualiza o valor do campo e remove erros dinâmicos se o campo for válido
    if (field === "persona") {
      setPersona(value);
      if (value.trim()) setErrors((prev) => ({ ...prev, persona: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }
    navigate("/wheel");
  };

  return (
    <div className="container busca-container">
      < Header/>
      <div className="hero-section">
        <img src={bannerImage} alt="Título Caca Date" className="hero-image" />
      </div>

      <form
        className="form-container"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <FormInput
            id="persona"
            label="Qual o seu nome?"
            value={persona}
            onChange={(e) =>
              handleInputChange(
                "persona",
                e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
              )
            }
            required
          />
          {errors.persona &&
            <div className="error-tag">
              <span className="error-text">{errors.persona}</span>
            </div>
          }
        </div>

        <div className="cta-section">
          <button
            className="cta-button"
            type="button"
            onClick={handleSubmit}
          >
            {isSpinning ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Encontrar date"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuscaEstabelecimento;
