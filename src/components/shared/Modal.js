import React, { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import InterestsIcon from "@mui/icons-material/Interests";
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
          text: `Confira: ${result.title} - ${result.description}`,
          url: window.location.href,
        })
        .then(() => console.log("Compartilhamento realizado com sucesso"))
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      alert("Compartilhamento não suportado pelo navegador.");
    }
  };

  const formattedSuggestions = formatList(result.suggestion);
  const formattedLocations = formatList(result.location);

  const isContentEmpty =
    !result.description &&
    (!result.suggestion || result.suggestion.length === 0) &&
    (!result.location || result.location.length === 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="cta-button-modal close-button">
         Girar novamente
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
              <p className="title-description">{result.description}</p>

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
              {retryCount < maxRetries && (
                <>
                  <button
                    onClick={handleRetry}
                    className="cta-button-modal retry-button"
                    disabled={isLoading}
                  >
                    <InterestsIcon className="icon" />
                    Embaralhar
                  </button>
                </>
              )}
              <button
                onClick={handleShare}
                className="cta-button-modal share-button"
              >
                <ShareIcon className="icon" />
                Convidar
              </button>
            </div>

              {/* <div>
              <p className="attempts-remaining">
                      Tentativas restantes: {maxRetries - retryCount}
                    </p>
              </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
