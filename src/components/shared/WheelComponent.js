import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./WheelComponent.css";

const WheelComponent = ({
  segments,
  segColors,
  onFinished,
  size = 290,
  primaryColor = "black",
  contrastColor = "white",
  buttonText = "",
}) => {
  const [angleCurrent, setAngleCurrent] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomAngle = Math.random() * 360 + 3600; // Pelo menos 10 voltas
    const finalAngle = angleCurrent + randomAngle;
    setAngleCurrent(finalAngle);

    setTimeout(() => {
      const normalizedAngle = finalAngle % 360;
      const segmentIndex = Math.floor(
        (segments.length - normalizedAngle / (360 / segments.length)) % segments.length
      );

      setIsSpinning(false);
      onFinished(segments[segmentIndex].label); // Passa o rótulo do segmento para o callback
    }, 3000);
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = size * 2;
    canvas.height = size * 2;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const PI2 = Math.PI * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, index) => {
      const startAngle = (PI2 * index) / segments.length;
      const endAngle = (PI2 * (index + 1)) / segments.length;

      // Draw segment background
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, size, startAngle, endAngle);
      ctx.fillStyle = segColors[index];
      ctx.fill();
      ctx.stroke();

      // Draw image
      const image = new Image();
      image.src = segments[index].image;

      image.onload = () => {
        ctx.save();
        ctx.translate(centerX, centerY);
        const angle = (startAngle + endAngle) / 2;
        ctx.rotate(angle);

        // Adjust image size and position
        const imgSize = size / 4;
        ctx.drawImage(image, size - imgSize - 20, -imgSize / 2, imgSize, imgSize);

        ctx.restore();
      };
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, PI2);
    ctx.fillStyle = primaryColor;
    ctx.fill();

    // Add center text
    ctx.fillStyle = contrastColor;
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(buttonText, centerX, centerY + 5);
  }, [segments, segColors, size, primaryColor, contrastColor, buttonText]);

  useEffect(() => {
    drawWheel();
  }, [segments, drawWheel]);

  return (
    <div className="wheel-container">
      <div className="description-container">
        <h2>Vamos sortear o seu date?</h2>
        <p style={{color: `#bbbbbd`}}>Basta girar a Roleta e chamar o seu par</p>
      </div>

      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className="wheel"
        style={{
          transform: `rotate(${angleCurrent}deg)`,
        }}
      />
      <div className="button-container">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Voltar
        </button>

        <button
          className="spin-button"
          type="button"
          onClick={spin}
          disabled={isSpinning}
        >
          {isSpinning ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Girar"
          )}
        </button>

      </div>
    </div>
  );
};

export default WheelComponent;
