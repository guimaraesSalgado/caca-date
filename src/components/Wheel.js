import React, { useState } from "react";

import WheelComponent from "./shared/WheelComponent";
import Modal from "./shared/Modal";

import PraiaImg from "../assets/icons-roleta/beach.svg";
import LancheImg from "../assets/icons-roleta/food.svg";
import TeatroImg from "../assets/icons-roleta/art.svg";
import FilmeImg from "../assets/icons-roleta/movie.svg";
import AcampamentoImg from "../assets/icons-roleta/nature.svg";
import TabuleiroImg from "../assets/icons-roleta/games.svg";
import MusicaImg from "../assets/icons-roleta/music.svg";
import ShowImg from "../assets/icons-roleta/ticket.svg";

const Wheel = () => {
  // Segments: opções que aparecerão na roleta
  const segments = [
    { label: "Lanche", image: LancheImg },
    { label: "Praia", image: PraiaImg },
    { label: "Filme", image: FilmeImg },
    { label: "Teatro", image: TeatroImg },
    { label: "Tabuleiro", image: TabuleiroImg },
    { label: "Acampamento", image: AcampamentoImg },
    { label: "Show", image: ShowImg },
    { label: "Música", image: MusicaImg },
  ];
  
  // Colors: cores alternadas para os segmentos
  const segColors = ["#c5c1fd", "#272774", "#c5c1fd", "#272774", "#c5c1fd", "#272774", "#c5c1fd", "#272774"];

  // Função chamada quando o giro termina
  const [winner, setWinner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const handleFinished = (winner) => {
    setWinner(winner); // Atualiza o vencedor no estado
    setResult(winner);
    setModalOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setModalOpen(false); // Fecha o modal
  };

  return (
    <div>
      <WheelComponent
        segments={segments} 
        segColors={segColors} 
        onFinished={handleFinished}
        size={250} // Tamanho da roleta
        primaryColor="#f8a85f" // Cor do centro
        contrastColor="#FFF" // Cor do texto
        buttonText="" // Texto do botão
      />
      <Modal isOpen={modalOpen} onClose={closeModal} result={result} />

    </div>

  );
};

export default Wheel;
