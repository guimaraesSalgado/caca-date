import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import bannerImage from "../assets/title-caca-date.svg";

import FormInput from "./shared/FormInput";
import FormSelect from "./shared/FormSelect";

import "./BuscaEstabelecimento.css";

const BuscaEstabelecimento = () => {
  const navigate = useNavigate();
  const [convidado, setConvidado] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [isSpinning] = useState(false);
  const [errors, setErrors] = useState({ convidado: "", local: "" });

  const validateFields = () => {
    const newErrors = {};
    if (!convidado.trim()) newErrors.convidado = "Este campo deve ser preenchido";
    if (!local.trim()) newErrors.local = "Este campo deve ser preenchido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Atualiza o valor do campo e remove erros dinâmicos se o campo for válido
    if (field === "convidado") {
      setConvidado(value);
      if (value.trim()) setErrors((prev) => ({ ...prev, convidado: "" }));
    } else if (field === "local") {
      setLocal(value);
      if (value.trim()) setErrors((prev) => ({ ...prev, local: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }
    navigate("/wheel");
  };

  const generateHourOptions = (selectedDate) => {
    const now = new Date();
    const todayISO = now.toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD
    const currentHour = now.getHours();

    if (selectedDate === todayISO) {
      // Para hoje, mostre apenas horas futuras
      return Array.from({ length: 24 - currentHour - 1 }, (_, i) => {
        const hour = currentHour + 1 + i;
        const formattedHour = String(hour).padStart(2, "0");
        return `${formattedHour}:00`;
      });
    }

    // Para outras datas, mostre todas as horas
    return Array.from({ length: 24 }, (_, i) => {
      const formattedHour = String(i).padStart(2, "0");
      return `${formattedHour}:00`;
    });
  };

  return (
    <div className="container busca-container">
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
            id="convidado"
            label="Qual é o nome da pessoa convidada?"
            value={convidado}
            onChange={(e) =>
              handleInputChange(
                "convidado",
                e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
              )
            }
            required
          />
          {errors.convidado &&
            <div className="error-tag">
              <span className="error-text">{errors.convidado}</span>
            </div>
          }
        </div>

        <div className="date-time-row">
          <FormInput
            id="data"
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />

          <FormSelect
            id="hora"
            label="Hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            options={data ? generateHourOptions(data) : []}
            disabled={!data}
          />
        </div>

        <div className="form-group">
          <FormInput
            id="local"
            label="Local do encontro"
            value={local}
            onChange={(e) => handleInputChange("local", e.target.value)}
            required
          />
          {errors.local &&
            <div className="error-tag">
              <span className="error-text">{errors.local}</span>
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
