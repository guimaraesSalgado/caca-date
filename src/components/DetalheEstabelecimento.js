import React, { useRef } from 'react';
import { FaStar } from 'react-icons/fa'; 
import { useLocation, useNavigate } from 'react-router-dom'; // Importa o useNavigate para redirecionamento
import Slider from 'react-slick'; 
import Header from './Header';
import './DetalheEstabelecimento.css';

// Componente para a seta da direita
const RightArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: '#f7c325', right: '-10px' }} // Personaliza o estilo da seta
            onClick={onClick}
        />
    );
};

const DetalheEstabelecimento = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook para navegação
    const { lugares } = location.state || { lugares: [] };

    const sliderRef = useRef(null); // UseRef para controlar o carrossel

    const getPhotoUrl = (photo_reference) => {
        if (!photo_reference) return null;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
        centerMode: true,
        centerPadding: "40px",
        nextArrow: <RightArrow />, // Personaliza a seta da direita
        prevArrow: null, // Remove a seta da esquerda
    };

    // Função para obter o item ativo no carrossel e compartilhar
    const handleShareItem = () => {
        if (sliderRef.current) {
            const currentSlide = sliderRef.current.innerSlider.state.currentSlide;
            const lugarAtual = lugares[currentSlide];
            if (navigator.share) {
                navigator.share({
                    title: `Convite para ${lugarAtual.name}`,
                    text: `Encontre-se em ${lugarAtual.name}, localizado em ${lugarAtual.formatted_address}. 
                    Avaliação: ${lugarAtual.rating} estrelas.`,
                    url: window.location.href
                })
                .then(() => console.log('Compartilhamento realizado com sucesso!'))
                .catch((error) => console.log('Erro ao compartilhar', error));
            } else {
                console.log('A API Web Share não é suportada neste navegador.');
            }
        }
    };

    // Função para redirecionar para a página de busca
    const handleGoToSearch = () => {
        navigate('/'); // Redireciona para a página de busca
    };

    return (
        <div className="container">
            <Header />
            <div className='description'>
                <h3>Trouxemos o melhor para você!</h3>
            </div>

            {lugares.length > 0 ? (
                <Slider {...settings} ref={sliderRef}>
                    {lugares.map((lugar, index) => (
                        <div key={index} className="detail">
                            <div className="list-item">
                                <div className="item-box">
                                    <div className="item-box-image">
                                    <div className="rating-box">
                                            {/* Ícone de estrela usando React Icons */}
                                            <FaStar color="#293845" /> {/* Define a cor da estrela */}
                                            <p>{lugar.rating}</p> 
                                        </div>
                                        {lugar.photo_reference && (
                                            <img
                                                src={getPhotoUrl(lugar.photo_reference)}
                                                alt="Estabelecimento"
                                                className="estabelecimento-imagem"
                                            />
                                        )}
                                    </div>
                                    <div className="item-box-info">
                                        <p className="nome">{lugar.name}</p>
                                        <div className="price-status">
                                            <p style={{ color: '#f7c325', fontWeight: '600' }}>
                                                {Array(lugar.price_level).fill('$').join('')}
                                            </p>
                                            <p style={{ color: lugar.opening_hours && lugar.opening_hours.includes('Aberto') ? 'green' : 'red' }}>
                                                {lugar.opening_hours ? lugar.opening_hours : 'Horário não disponível'}
                                            </p>
                                        </div>
                                        <p>{lugar.formatted_address} - {lugar.distance}km</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>Nenhum estabelecimento encontrado.</p>
            )}

            <div className='share'>
                <button onClick={handleShareItem} className="active-item-button">Compartilhar convite</button>
            </div>

            <div className='other'>
                <button onClick={handleGoToSearch} className="active-item-other">Procurar outro role</button>
            </div>

        </div>
    );
};

export default DetalheEstabelecimento;
