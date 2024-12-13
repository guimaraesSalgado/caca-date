import React, { useState } from "react";
import WheelComponent from "./shared/WheelComponent";
import Modal from "./shared/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PraiaImg from "../assets/icons-roleta/beach.svg";
import LancheImg from "../assets/icons-roleta/food.svg";
import TeatroImg from "../assets/icons-roleta/art.svg";
import FilmeImg from "../assets/icons-roleta/movie.svg";
import AcampamentoImg from "../assets/icons-roleta/nature.svg";
import TabuleiroImg from "../assets/icons-roleta/games.svg";
import MusicaImg from "../assets/icons-roleta/music.svg";
import ShowImg from "../assets/icons-roleta/ticket.svg";
 
const Wheel = () => {
  const segments = [
    {
      label: "Bora pra praia?",
      type: "beach",
      image: PraiaImg,
      banner: 'https://blog.coris.com.br/wp-content/uploads/2019/07/mike-swigunski-ueBmz9K8zTg-unsplash-1-1024x768.jpg',
      color: "dark",
      items: [
        {
          title: "Praia",
          descricao: "Refúgio de tranquilidade e energia, onde mar, sol e areia se encontram em harmonia.",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "Ta com fome?",
      type: "food",
      image: LancheImg,
      banner: 'https://www.assai.com.br/sites/default/files/blog/cachorro_quente_gourmet_-_assai_atacadista.jpg',
      color: "light", // Define light ou dark
      items: [
        {
          title: "Comida brasileira",
          descricao:
            "Colorida, rica em temperos e tradições, combina sabores intensos com muita criatividade.",
          sugestao: ["Moqueca", "Cachorro quente", "Escondidinho"],
          local: ["casa", "restaurante", "ifood"],
        },
        {
          title: "Comida Mexicana",
          descricao:
            "Vibrante, apimentada e cheia de contrastes, une tradição e intensidade em cada prato.",
          sugestao: ["Tacos", "Burritos", "Nachos"],
          local: ["casa", "restaurante", "ifood"],
        },
        {
          title: "Comida Italiana",
          descricao:
            "Artesanal, rica em sabores, aromas e tradição familiar autêntica.",
          sugestao: ["Pizza", "Macarrão"],
          local: ["casa", "restaurante", "ifood"],
        },
        {
          title: "Comida Árabe",
          descricao:
            "Aromática, equilibrada, rica em especiarias e cheia de história.",
          sugestao: ["Kibes"],
          local: ["casa", "restaurante", "ifood"],
        },
      ],
    },
    {
      label: "Onde vamos hoje?",
      type: "art",
      image: TeatroImg,
      banner: 'https://www.daninoce.com.br/wp-content/uploads/2018/05/museus-e-galerias-de-arte-que-voce-nao-pode-deixar-de-visitar-em-austin-imagem-destaque.jpg',
      color: "dark",
      items: [
        {
          title: "Museus",
          descricao: "Palco de emoções e criatividade, transforma vidas através da arte e expressão.",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "Hmmm Netflix ou Disney?",
      type: "movie",
      image: FilmeImg,
      color: "light",
      items: [
        {
          title: "Filmes",
          descricao: "",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "Leva o repelente!",
      type: "nature",
      image: AcampamentoImg,
      banner: 'https://ocamping.com.br/wp-content/uploads/2024/06/Os-Melhores-Parques-Nacionais-para-Explorar-em-seu-Proximo-Acampamento-1080x675.jpg',
      color: "dark",
      items: [
        {
          title: "Parque",
          descricao: "Espaço verde, tranquilo, ideal para lazer, conexão com a natureza e relaxar.",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "O que vamos jogar hoje?",
      type: "game",
      image: TabuleiroImg,
      color: "light",
      items: [
        {
          title: "Jogos",
          descricao: "",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "Dj, solta o som!",
      type: "music",
      image: MusicaImg,
      color: "dark",
      items: [
        {
          title: "Musica",
          descricao: "Arte sonora, expressão emocional, harmonia e ritmo que transcendem palavras.",
          sugestao: [],
          local: [],
        }
      ],
    },
    {
      label: "Eu acho chic",
      type: "show",
      image: ShowImg,
      banner: 'https://www.cartacapital.com.br/wp-content/uploads/2020/07/shows.jpg',
      color: "light",
      items: [
        {
          title: "Show",
          descricao: "Experiência vibrante, onde energia, arte e emoção se unem ao vivo",
          sugestao: [],
          local: [],
        }
      ],
    }
  ];

  const generateSegmentColors = (segments) =>
    segments.map((segment) =>
      segment.color === "light" ? "#c5c1fd" : "#272774"
    );

  const segColors = generateSegmentColors(segments);

  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [currentType, setCurrentType] = useState(null); // Salva o tipo sorteado
  const [retryCount, setRetryCount] = useState(0); // Conta as tentativas
  const [toastOpen, setToastOpen] = useState(false); // Estado para o toast

  const MAX_RETRIES = 3; // Limite de tentativas

  const handleFinished = (winner) => {
    const selectedType = segments.find((segment) => segment.type === winner);

    if (selectedType) {
      const randomItem =
        selectedType.items[
          Math.floor(Math.random() * selectedType.items.length)
        ] || {}; // Fallback para evitar erros caso items esteja vazio

      setCurrentType(selectedType); // Atualiza o tipo atual

      setResult({
        ...randomItem,
        banner: selectedType.banner || "",
      });

      setRetryCount(0); // Reseta as tentativas no primeiro sorteio
    } else {
      setResult({ title: "Erro", descricao: "Nenhuma opção encontrada" });
    }

    setModalOpen(true);
  };

  const retryItemSelection = () => {
    if (!currentType) return;

    setRetryCount((prevRetryCount) => {
      if (prevRetryCount + 1 >= MAX_RETRIES) {
        setModalOpen(false); // Fecha o modal após atingir o limite
        setToastOpen(true); // Exibe o toast
        return prevRetryCount;
      }

      const randomItem =
        currentType.items[
          Math.floor(Math.random() * currentType.items.length)
        ] || {}; // Fallback para evitar erros caso items esteja vazio

      setResult({
        ...randomItem,
        banner: currentType.banner || "",
      });

      return prevRetryCount + 1; // Incrementa o contador
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setToastOpen(true); // Exibe o toast
  };

  const closeToast = () => {
    setToastOpen(false);
  };

  return (
    <div>
      <WheelComponent
        segments={segments.map((segment) => ({
          label: segment.type,
          image: segment.image,
        }))}
        segColors={segColors}
        onFinished={(winner) => handleFinished(winner)}
        size={250}
        primaryColor="#f8a85f"
        contrastColor="#FFF"
        buttonText=""
      />
      {result && (
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          result={result}
          onRetry={retryItemSelection} // Passa a função de tentar novamente
          retryCount={retryCount}
          maxRetries={MAX_RETRIES}
        />
      )}
      {/* Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={8000} // 8 segundos
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity="info" sx={{ width: "100%" }}>
          Assine para sorteios ilimitados!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Wheel;
