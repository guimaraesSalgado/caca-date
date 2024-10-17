import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BuscaEstabelecimento.css';
import './Roleta.css'; // Importar o CSS da roleta 
import Header from './Header';
import Roleta from './Roleta'; // Componente da Roleta

const types = [
    { value: 'restaurant', label: 'Restaurante' },
    { value: 'cafe', label: 'Café' },
    { value: 'bar', label: 'Bar' },
    { value: 'gym', label: 'Academia' },
    { value: 'movie_theater', label: 'Cinema' },
    { value: 'shopping_mall', label: 'Shopping' },
    { value: 'park', label: 'Parque' },
    { value: 'museum', label: 'Museu' },
    { value: 'night_club', label: 'Balada/Clube' },
    { value: 'zoo', label: 'Zoológico' },
    { value: 'stadium', label: 'Estádio' },
];

const radiusOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 15, label: '15 km' },
    { value: 20, label: 'Qualquer distância' }
];

const priceOptions = [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' },
    { value: 5, label: '$$$$$' }
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const BuscaEstabelecimento = () => {
    const [formState, setFormState] = useState({
        convidado: '',
        cep: '',
        tipo: '',
        valorMaximo: 1,
        raio: 5,
        keyword: '', // Campo para palavra-chave
    });
    const [isRandom, setIsRandom] = useState(true); 
    const [isLoading, setIsLoading] = useState(false);
    const [isRoletaFullVisible, setIsRoletaFullVisible] = useState(false); // Controla a visibilidade total da roleta
    const [isSpinning, setIsSpinning] = useState(false); // Controla o giro da roleta
    const roletaRef = useRef(null); // Referência para o componente da roleta
    const navigate = useNavigate();

    // Solicitar a localização ao carregar a página
    useEffect(() => {
        obterLocalizacaoAtual();
    }, []);

    const obterLocalizacaoAtual = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    converterCoordenadasParaCEP(latitude, longitude);
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    alert("Não foi possível obter sua localização. Certifique-se de permitir o acesso à localização.");
                }
            );
        } else {
            alert("Seu navegador não suporta a geolocalização.");
        }
    };

    const converterCoordenadasParaCEP = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`);
            if (response.data.results && response.data.results.length > 0) {
                const cepData = response.data.results[0].address_components.find(component => component.types.includes("postal_code"));
                if (cepData && cepData.long_name) {
                    const cep = cepData.long_name;
                    setFormState((prevState) => ({ ...prevState, cep }));
                } else {
                    throw new Error("CEP não encontrado nas coordenadas fornecidas.");
                }
            } else {
                throw new Error("Nenhum resultado encontrado para as coordenadas fornecidas.");
            }
        } catch (error) {
            console.error("Erro ao converter coordenadas para CEP:", error);
            alert("Erro ao buscar o CEP baseado na sua localização.");
        }
    };

    const buscarEstabelecimentos = async (e) => {
        e.preventDefault();

        if (!formState.cep && !isRandom) {
            alert('Não foi possível obter um CEP válido. Tente novamente.');
            return;
        }

        if (isRandom) {
            setIsRoletaFullVisible(true); // Mostra a roleta completa
            setTimeout(() => {
                setIsSpinning(true); // Inicia o giro da roleta
                if (roletaRef.current) {
                    roletaRef.current.girarRoleta(); // Gira a roleta a partir da referência
                }
            }, 1000);
        } else {
            try {
                setIsLoading(true);
                const response = await axios.post(`${API_URL}/buscar-estabelecimentos`, {
                    ...formState,
                    valorMaximo: Number(formState.valorMaximo),
                    raio: Number(formState.raio)
                });
                const lugares = response.data.lugares;
                if (lugares.length > 0) {
                    navigate('/detalhes', { state: { lugares } });
                } else {
                    alert('Nenhum estabelecimento encontrado.');
                }
            } catch (error) {
                console.error("Erro ao buscar estabelecimentos:", error);
                alert('Erro ao buscar estabelecimentos.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className="container">
            <form onSubmit={buscarEstabelecimentos}>
                <div className="header">
                    <Header />
                    <h2>{isRandom ? 'Achar um date aleatório' : 'Achar um date perfeito'}</h2>
                </div>

                <div className="form-section">
                    <label>Quem será a pessoa convidada?</label>
                    <input
                        type="text"
                        value={formState.convidado}
                        onChange={(e) => handleInputChange('convidado', e.target.value)}
                        required
                        placeholder="O nome irá aparecer no convite"
                    />
                </div>

                <div className="form-section tags-toggle">
                    <button
                        type="button"
                        className={`tag ${isRandom ? 'active' : ''}`}
                        onClick={() => setIsRandom(true)}
                    >
                        Busca Aleatória
                    </button>

                    ou

                    <button
                        type="button"
                        className={`tag ${!isRandom ? 'active' : ''}`}
                        onClick={() => setIsRandom(false)}
                    >
                        Personalizar Busca
                    </button>
                </div>

                {/* Campo de Palavra-chave para a busca personalizada */}
                {!isRandom && (
                    <div className="form-section">
                        <label>Palavra-chave</label>
                        <input
                            type="text"
                            value={formState.keyword}
                            onChange={(e) => handleInputChange('keyword', e.target.value)}
                            placeholder="Digite uma palavra-chave"
                        />
                    </div>
                )}

                {!isRandom && (
                    <div className="form-section">
                        <div className="form-wrapper">
                            <label>Insira o CEP para resultados perto de você</label>
                            <input
                                type="text"
                                value={formState.cep}
                                onChange={(e) => handleInputChange('cep', e.target.value)}
                                required
                                className="cep-input"
                            />
                        </div>
                    </div>
                )}

                {!isRandom && (
                    <>
                        <div className="form-section">
                            <label>Limite de gasto</label>
                            <div className="tags">
                                {priceOptions.map((price) => (
                                    <button
                                        key={price.value}
                                        className={`tag ${price.value === formState.valorMaximo ? 'active' : ''}`}
                                        onClick={() => handleInputChange('valorMaximo', price.value)}
                                    >
                                        {price.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Estilo de local</label>
                            <div className="tags">
                                {types.map((type) => (
                                    <button
                                        key={type.value}
                                        className={`tag ${type.value === formState.tipo ? 'active' : ''}`}
                                        onClick={() => handleInputChange('tipo', type.value)}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Distância</label>
                            <div className="tags">
                                {radiusOptions.map((radius) => (
                                    <button
                                        key={radius.value}
                                        className={`tag ${radius.value === formState.raio ? 'active' : ''}`}
                                        onClick={() => handleInputChange('raio', radius.value)}
                                    >
                                        {radius.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Encontrar Date'}
                </button>
            </form>

            {/* Roleta visível pela metade inicialmente e sobe ao clicar */}
            {isRandom && (
                <div className={`roleta-wrapper ${isRoletaFullVisible ? 'full-visible' : 'half-visible'}`}>
                    <Roleta ref={roletaRef} isSpinning={isSpinning} />
                </div>
            )}
        </div>
    );
};

export default BuscaEstabelecimento;
