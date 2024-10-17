import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roleta.css';
import axios from 'axios';

// Função para embaralhar o array
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// Lista de prêmios e palavras-chave associadas
const premiosIniciais = [
    'Shows',
    'Cinema ao Ar Livre',
    'Passeio no Parque',
    'Show ao Vivo',
    'Café da Manhã',
    'Balada VIP',
    'Museus e galerias',
    'Spa Relaxante',
    'Jantar Romântico',
];

// Palavras-chave associadas aos prêmios
const palavrasChavePremios = {
    'Shows': ['música ao vivo', 'concerto', 'evento musical'],
    'Cinema ao Ar Livre': ['cinema outdoor', 'filmes ao ar livre', 'filme no parque'],
    'Passeio no Parque': ['parque', 'passeio ao ar livre', 'natureza'],
    'Show ao Vivo': ['show de música', 'música ao vivo', 'evento'],
    'Café da Manhã': ['café', 'brunch', 'padaria', 'restaurante para café da manhã'],
    'Balada VIP': ['balada', 'clube noturno', 'festa', 'noite VIP'],
    'Museus e galerias': ['museu', 'galeria de arte', 'exposição de arte'],
    'Spa Relaxante': ['spa', 'massagem', 'relaxamento', 'terapia'],
    'Jantar Romântico': ['restaurante italiano', 'restaurante brasileiro', 'jantar à luz de velas']
};

const coresIniciais = [
    '#ff6b6b', // cor 1
    '#ffcc5c', // cor 2
    '#4ecdc4', // cor 3
    '#f7cac9', // cor 4
    '#92a8d1', // cor 5
    '#f7786b', // cor 6
    '#c0e218', // cor 7
    '#6b5b95',  // cor 8
    '#000'  // cor 9
];

// Usando forwardRef para expor girarRoleta ao componente pai
const Roleta = forwardRef((props, ref) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [premios] = useState(shuffleArray([...premiosIniciais])); // Prêmios embaralhados
    const [cores] = useState(shuffleArray([...coresIniciais])); // Cores embaralhadas
    const [rotationAngle, setRotationAngle] = useState(0); // Ângulo final da rotação
    const navigate = useNavigate();

    // Usar useImperativeHandle para expor funções ao componente pai
    useImperativeHandle(ref, () => ({
        girarRoleta,
    }));

    // Função para calcular o prêmio baseado no ângulo final da rotação
    const calcularPremio = (angulo) => {
        const anguloPorPremio = 360 / premios.length; // Ângulo coberto por cada prêmio
        const anguloCorrigido = (angulo + 360) % 360; // Corrigir ângulo para valores positivos

        // Encontrar o índice do prêmio baseado no ângulo final
        const premioIndex = Math.floor(anguloCorrigido / anguloPorPremio);
        return premios[premioIndex];
    };

    // Função para buscar estabelecimentos usando palavras-chave
    const buscarEstabelecimentosComPremio = async (premio) => {
        setIsLoading(true);
        const keywords = palavrasChavePremios[premio].join(', '); // Converte a lista de palavras-chave em uma string
        try {
            const response = await axios.post('http://localhost:3001/buscar-estabelecimentos', {
                keyword: keywords, // Envia as palavras-chave associadas ao prêmio
                cep: '07808090',
                tipo: 'restaurant',
                valorMaximo: 3,
                raio: 20
            });

            const lugares = response.data.lugares;
            if (lugares.length > 0) {
                navigate('/detalhes', { state: { lugares } });
            } else {
                alert('Nenhum estabelecimento encontrado com base no prêmio.');
            }
        } catch (error) {
            console.error('Erro ao buscar estabelecimentos:', error);
            alert('Erro ao buscar estabelecimentos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Função para girar a roleta
    const girarRoleta = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        const randomRotation = Math.floor(3600 + Math.random() * 360); // Gira pelo menos 10 vezes
        const premioSorteado = calcularPremio(randomRotation % 360); // Calcular o prêmio baseado na rotação final

        setRotationAngle(randomRotation); // Definir o ângulo de rotação final

        setTimeout(() => {
            setIsSpinning(false);
            setResult(premioSorteado);
            buscarEstabelecimentosComPremio(premioSorteado); // Buscar estabelecimentos com base no prêmio
        }, 5000); // Tempo da rotação
    };

    return (
        <div className="roleta-container">
            <div className={`roleta ${isSpinning ? 'girar' : ''}`} style={{ transform: `rotate(${rotationAngle}deg)` }}>
                <div className="seta"></div>
                <div className="pratos">
                    {premios.map((premio, index) => (
                        <div
                            key={index}
                            className="prato"
                            style={{
                                transform: `rotate(${index * (360 / premios.length)}deg)`,
                                backgroundColor: cores[index]
                            }}
                        >
                            <span>{premio}</span>
                        </div>
                    ))}
                </div>
                <div className="centro-roleta"></div>
            </div>

            <button onClick={girarRoleta} className={`botao-roleta ${isSpinning || isLoading ? 'desativado' : ''}`}>
                {isSpinning || isLoading ? 'Girando...' : 'Girar Roleta'}
            </button>
        </div>
    );
});

export default Roleta;
