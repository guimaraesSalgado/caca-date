import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import WheelComponent from "./shared/WheelComponent";
import Modal from "./shared/Modal";
import BeachImg from "../assets/icons-roleta/beach.svg";
import FoodImg from "../assets/icons-roleta/food.svg";
import ArtImg from "../assets/icons-roleta/art.svg";
import MovieImg from "../assets/icons-roleta/movie.svg";
import NatureImg from "../assets/icons-roleta/nature.svg";
import GamesImg from "../assets/icons-roleta/games.svg";
import MusicImg from "../assets/icons-roleta/music.svg";
import TicketImg from "../assets/icons-roleta/ticket.svg";

const Wheel = () => {

  const segments = [
    {
      label: "Bora pra praia?",
      type: "beach",
      image: BeachImg,
      banner: 'https://blog.coris.com.br/wp-content/uploads/2019/07/mike-swigunski-ueBmz9K8zTg-unsplash-1-1024x768.jpg',
      background: "dark",
      items: [
        {
          title: "Praia",
          description: "Refúgio de tranquilidade e energia, onde mar, sol e areia se encontram em harmonia.",
          suggestion: [],
          location: [],
        }
      ],
    },
    {
      label: "Ta com fome?",
      type: "food",
      image: FoodImg,
      banner: 'https://www.assai.com.br/sites/default/files/blog/cachorro_quente_gourmet_-_assai_atacadista.jpg',
      background: "light", // Define light ou dark
      items: [
        {
          title: "Cozinhe juntos",
          descricao: "Divertido, Romântico, agradavél.",
          sugestao: ["Sushi", "Escondidinho", "Lasanha"],
          local: ["casa"]
        },

        {
          title: "Apresente seu restaurante preferido",
          descricao: "Intimista, Romântico, agradavél.",
          sugestao: ["Peça seu prato preferido", "Pegue uma mesa mais privada"],
          local: ["casa", "restaurante"]
        },

        {
          title: "Comam uma pizza inteira",
          descricao: " Divertido, agradavél.",
          sugestao: ["encontre uma pizza que os dois amem"],
          local: ["casa", "restaurante", "ifood"]
        },
      ],
    },
    {
      label: "Onde vamos hoje?",
      type: "art",
      image: ArtImg,
      banner: 'https://www.daninoce.com.br/wp-content/uploads/2018/05/museus-e-galerias-de-arte-que-voce-nao-pode-deixar-de-visitar-em-austin-imagem-destaque.jpg',
      background: "dark",
      items: [
        {
          title: "Museus",
          description: "Palco de emoções e criatividade, transforma vidas através da arte e expressão.",
          suggestion: [],
          location: [],
        },
        {
          title: "Teatro",
          description: "Arte viva, emoção e expressão, onde histórias ganham vida no palco e encantam a alma.",
          suggestion: [],
          location: [],
        },
        {
          title: "Galeria",
          description: "Um espaço de inspiração, onde obras revelam histórias, emoções e criatividade.",
          suggestion: [],
          location: [],
        },
        {
          title: "Centro cultural",
          description: "Polo de aprendizado e troca, unindo arte, cultura e comunidade em um só lugar.",
          suggestion: [],
          location: [],
        }
      ],
    },
    {
      label: "Hmmm Netflix ou Disney?",
      type: "movie",
      image: MovieImg,
      background: "light",
      items: [
        {
          title: "Comedia",
          description: "Traz leveza e risadas, transformando situações comuns em momentos de puro humor e diversão.",
          suggestion: [],
          location: [],
        },
        {
          title: "Terror",
          description: "Provoca medo e tensão, explorando o desconhecido e despertando calafrios em cada cena.",
          suggestion: [],
          location: [],
        },
        {
          title: "Musical",
          description: "Encanta com histórias vibrantes, cheias de música, dança e emoção que tocam o coração.",
          suggestion: [],
          location: [],
        },
      ],
    },
    {
      label: "Leva o repelente!",
      type: "nature",
      image: NatureImg,
      banner: 'https://ocamping.com.br/wp-content/uploads/2024/06/Os-Melhores-Parques-Nacionais-para-Explorar-em-seu-Proximo-Acampamento-1080x675.jpg',
      background: "dark",
      items: [
        {
          title: "Parque",
          description: "Espaço verde, tranquilo, ideal para lazer, conexão com a natureza e relaxar.",
          suggestion: [],
          location: [],
        },
        {
          title: "Praia",
          description: "Refúgio de paz, onde o mar encontra a areia, criando momentos de lazer e conexão.",
          suggestion: [],
          location: [],
        },
        {
          title: "Cachoeira",
          description: "Espetáculo natural, onde a força da água encontra a serenidade da natureza.",
          suggestion: [],
          location: [],
        }
      ],
    },
    {
      label: "O que vamos jogar hoje?",
      type: "game",
      image: GamesImg,
      background: "light",
      items: [
        {
          title: "Jogo rummikub",
          description: "Jogo de estratégia com peças numéricas, que combina lógica, raciocínio e sorte para formar sequências e grupos.",
          suggestion: [],
          location: [],
        },
        {
          title: "Jogo Uno",
          description: "Jogo de cartas dinâmico e divertido, onde os jogadores precisam combinar cores ou números e usar cartas especiais para vencer.",
          suggestion: [],
          location: [],
        },
        {
          title: "Detetive",
          description: "Jogo de tabuleiro investigativo, onde os jogadores precisam desvendar o mistério de um assassinato descobrindo o culpado, a arma e o location do crime.",
          suggestion: [],
          location: [],
        },
        {
          title: "Batalha naval",
          description: "Clássico jogo de estratégia em que os jogadores tentam afundar as frotas inimigas locationizando a posição dos navios no tabuleiro.",
          suggestion: [],
          location: [],
        },
        {
          title: "Banco imobiliário",
          description: "Jogo de negócios em que os participantes compram, vendem e negociam propriedades, tentando levar os oponentes à falência.",
          suggestion: [],
          location: [],
        },
        {
          title: "Jenga",
          description: "Jogo de habilidade e destreza, em que os jogadores removem blocos de madeira de uma torre sem derrubá-la.",
          suggestion: [],
          location: [],
        },
        {
          title: "Dominó",
          description: "Jogo tradicional em que os participantes combinam peças com números iguais, formando sequências e estratégias para vencer.",
          suggestion: [],
          location: [],
        },
        {
          title: "Patuscada",
          description: "Jogo divertido de cartas que mistura estratégia e sorte, perfeito para momentos descontraídos com amigos ou família.",
          suggestion: [],
          location: [],
        },
        {
          title: "Baralho",
          description: "Conjunto de cartas que permite jogar diversos jogos clássicos, como Truco, Poker, Buraco e muitos outros.",
          suggestion: [],
          location: [],
        }
      ],
    },
    {
      label: "Dj, solta o som!",
      type: "music",
      image: MusicImg,
      background: "dark",
      items: [
        {
          title: "Rock",
          description: "Arte sonora, expressão emocional, harmonia e ritmo que transcendem palavras.",
          suggestion: [],
          location: [],
        },
        {
          title: "Pop",
          description: "Arte sonora, expressão emocional, harmonia e ritmo que transcendem palavras.",
          suggestion: [],
          location: [],
        },
        {
          title: "Rap",
          description: "Arte sonora, expressão emocional, harmonia e ritmo que transcendem palavras.",
          suggestion: [],
          location: [],
        },
        {
          title: "R&B",
          description: "Arte sonora, expressão emocional, harmonia e ritmo que transcendem palavras.",
          suggestion: [],
          location: [],
        }
      ],
    },
    {
      label: "Eu acho chic",
      type: "show",
      image: TicketImg,
      banner: 'https://www.cartacapital.com.br/wp-content/uploads/2020/07/shows.jpg',
      background: "light",
      items: [
        {
          title: "Infantil",
          description: "Experiência vibrante, onde energia, arte e emoção se unem ao vivo",
          suggestion: [],
          location: [],
        },
        {
          title: "Concerto",
          description: "Experiência vibrante, onde energia, arte e emoção se unem ao vivo",
          suggestion: [],
          location: [],
        }
      ],
    }
  ];

  const generateSegmentColors = (segments) => {
    const zebraColors = ["#c5c1fd", "#272774"]; // Cores alternadas (claro/escuro)
    return segments.map((_, index) => zebraColors[index % 2]); // Alterna as cores com base no índice
  };

  const shuffledSegments = shuffleArray([...segments]);
  const segColors = generateSegmentColors(shuffledSegments);

  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [currentType, setCurrentType] = useState(null); // Salva o tipo sorteado
  const [retryCount, setRetryCount] = useState(0); // Conta as tentativas
  const [toastOpen, setToastOpen] = useState(false); // Estado para o toast

  const MAX_RETRIES = 3; // Limite de tentativas

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
    return array;
  }

  const handleFinished = (winner) => {
    const selectedType = segments.find((segment) => segment.type === winner);

    if (selectedType) {
      // Embaralha os itens para maior imprevisibilidade
      const shuffledItems = shuffleArray([...selectedType.items]);

      const randomItem = shuffledItems[0]; // Pega o primeiro item embaralhado

      setCurrentType(selectedType);
      setResult({
        ...randomItem,
        banner: selectedType.banner || "",
      });

      setRetryCount(0);
    } else {
      setResult({ title: "Erro", description: "Nenhum item disponível para sorteio" });
    }

    setModalOpen(true);
  };

  const retryItemSelection = () => {
    if (!currentType) return;

    setRetryCount((prevRetryCount) => {
      if (prevRetryCount + 1 >= MAX_RETRIES) {
        setModalOpen(false);
        setToastOpen(true);
        return prevRetryCount;
      }

      // Embaralha os itens antes de escolher
      const shuffledItems = shuffleArray([...currentType.items]);
      const randomItem = shuffledItems[0];

      setResult({
        ...randomItem,
        banner: currentType.banner || "",
      });

      return prevRetryCount + 1;
    });
  };


  const closeModal = () => {
    setModalOpen(false);

    if (retryCount >= MAX_RETRIES) {
      setToastOpen(true);
    }
  };


  const closeToast = () => {
    setToastOpen(false);
  };

  return (
    <div>
      <WheelComponent
        segments={shuffledSegments.map((segment) => ({
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
