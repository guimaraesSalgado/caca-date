import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

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
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSubmit = () => {
    // Valida campos obrigatórios
    if (!convidado.trim() || !local.trim()) {
      setError("Os campos 'Nome' e 'Local' são obrigatórios.");
      setSnackbarOpen(true);
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
        <FormInput
          id="convidado"
          label="Qual é o nome da pessoa convidada?"
          value={convidado}
          onChange={(e) =>
            setConvidado(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
          }
          required
        />

        <div className="date-time-row">
          <FormInput
            id="data"
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)} // Atualiza o estado
            min={new Date().toISOString().split("T")[0]} // Restrição no HTML
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

        <FormInput
          id="local"
          label="Local do encontro"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />

        <div className="cta-section">
          <button
            className="cta-button"
            type="submit"
            disabled={!convidado.trim() || !local.trim() || isSpinning}
          >
            {isSpinning ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Encontrar date"
            )}
          </button>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BuscaEstabelecimento;
