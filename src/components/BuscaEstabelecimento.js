import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import './BuscaEstabelecimento.css'; 
import Header from './Header'; 


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

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";


const BuscaEstabelecimento = () => {
    const [convidado, setConvidado] = useState('');
    const [cep, setCep] = useState('');
    const [tipo, setTipo] = useState(''); // Tipo de date
    const [valorMaximo, setValorMaximo] = useState(1); // Limite de preço inicial
    const [raio, setRaio] = useState(1); // Define "Qualquer distância" como padrão (1 km para o backend)
    const navigate = useNavigate(); // Hook para navegação entre rotas

    // Função que faz a busca de estabelecimentos com base no CEP, tipo e valor máximo
    const buscarEstabelecimentos = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/buscar-estabelecimentos`, {
                cep,
                tipo,
                valorMaximo: Number(valorMaximo),
                raio: Number(raio),
            });

            const resultados = response.data.lugares;
            if (resultados.length > 0) {
                // Navega para a página de detalhes, passando os resultados como state
                navigate('/detalhes', { state: { lugares: resultados } });
            } else {
                alert('Nenhum estabelecimento encontrado');
            }
        } catch (error) {
            console.error("Erro ao buscar estabelecimentos:", error);
            alert('Erro ao buscar estabelecimentos');
        }
    };

    // Função para selecionar o tipo de date ao clicar na tag
    const handleTypeClick = (typeValue) => {
        setTipo(typeValue);
    };

    // Função para selecionar o raio ao clicar nas tags
    const handleRadiusClick = (radiusValue) => {
        setRaio(radiusValue);
    };

    // Função para selecionar o limite de preço ao clicar nas tags
    const handlePriceClick = (priceValue) => {
        setValorMaximo(priceValue);
    };

    return (
        <div className="container">
            <form onSubmit={buscarEstabelecimentos}>
                <div className="header">

                    <Header />

                    <div className="">
                        <h2>Achar um encontro perfeito</h2>
                    </div>
                </div>

                <div className="form-section">
                    <label>Quem será a pessoa convidada?</label>
                    <input
                        type="text"
                        value={convidado}
                        onChange={(e) => setConvidado(e.target.value)}
                        required
                        placeholder="O nome irá aparecer no convite"
                    />
                </div>

                {/* Campo de limite de gasto com tags */}
                <div className="form-section">
                    <label>Limite de gasto</label>
                    <div className="tags">
                        {priceOptions.map((price) => (
                            <span
                                key={price.value}
                                className={`tag ${price.value === valorMaximo ? 'active' : ''}`}
                                onClick={() => handlePriceClick(price.value)}
                            >
                                {price.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Campo para selecionar o tipo de date com tags */}
                <div className="form-section">
                    <label>Estilo de local</label>
                    <div className="tags">
                        {types.map((type) => (
                            <span
                                key={type.value}
                                className={`tag ${type.value === tipo ? 'active' : ''}`}
                                onClick={() => handleTypeClick(type.value)}
                            >
                                {type.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Campo para selecionar o raio em km com tags */}
                <div className="form-section">
                    <label>Distância</label>
                    <div className="tags">
                        {radiusOptions.map((radius) => (
                            <span
                                key={radius.value}
                                className={`tag ${radius.value === raio ? 'active' : ''}`}
                                onClick={() => handleRadiusClick(radius.value)}
                            >
                                {radius.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <div className='form-wrapper'>
                        <label>Insira o CEP para resultados perto de você</label>
                        <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            required
                            className="cep-input"
                        />
                    </div>
                </div>

                <button type="submit">Encontrar Date</button>
            </form>
        </div>
    );
};

export default BuscaEstabelecimento;
