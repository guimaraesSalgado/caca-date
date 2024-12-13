import React, { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import "./Modal.css";

const Modal = ({ isOpen, onClose, result, onRetry, retryCount, maxRetries }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const formatList = (items) => {
    if (!items || items.length === 0) return null;
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
  };

  const handleRetry = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onRetry();
    setIsLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Convite para Date",
          text: `Confira: ${result.title} - ${result.descricao}`,
          url: window.location.href,
        })
        .then(() => console.log("Compartilhamento realizado com sucesso"))
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      alert("Compartilhamento não suportado pelo navegador.");
    }
  };

  const formattedSuggestions = formatList(result.sugestao);
  const formattedLocations = formatList(result.local);

  const isContentEmpty =
    !result.descricao &&
    (!result.sugestao || result.sugestao.length === 0) &&
    (!result.local || result.local.length === 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="cta-button-modal close-button">
          Fechar
        </button>

        {isLoading ? (
          <div className="loading-container">
            <CircularProgress size={50} color="primary" />
          </div>
        ) : isContentEmpty ? (
          <div className="construction-container">
            <h2>Item em construção</h2>
            <p>Volte em breve para mais novidades!</p>
          </div>
        ) : (
          <>
            <div className="modal-section">
              {result.banner && (
                <img
                  src={result.banner}
                  alt="Banner do segmento"
                  className="modal-image"
                />
              )}

              <h2 className="title-card">{result.title}</h2>
              <p className="title-description">{result.descricao}</p>

              {formattedSuggestions && (
                <>
                  <h3 className="title-subtitle">Sugestões:</h3>
                  <p className="title-itens">{formattedSuggestions}</p>
                </>
              )}

              {formattedLocations && (
                <>
                  <h3 className="title-subtitle">Locais sugeridos:</h3>
                  <p className="title-itens">{formattedLocations}</p>
                </>
              )}
            </div>

            <div className="button-row">
              <button
                onClick={handleShare}
                className="cta-button-modal share-button"
              >
                <ShareIcon className="icon" />
                Convidar
              </button>
            </div>
            <div>
            {result.items?.length > 1 && retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  className="cta-button-modal retry-button"
                  disabled={isLoading}
                >
                  Tentar novamente
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
