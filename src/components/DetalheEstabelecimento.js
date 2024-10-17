import React, { useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import Header from './Header';
import './DetalheEstabelecimento.css';

const Arrow = ({ className, style, onClick, direction }) => (
    <div
        className={className}
        style={{
            ...style,
            display: 'block',
            background: '#f7c325',
            [direction]: '-10px'
        }}
        onClick={onClick}
    />
);

const DetalheEstabelecimento = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { lugares = [] } = location.state || { lugares: [] };  // Usa valor padrão para evitar undefined

    const sliderRef = useRef(null); 

    const getPhotoUrl = (photo_reference) =>
        photo_reference && `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;

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
        nextArrow: <Arrow />, 
        prevArrow: null,
    };

    const handleShareItem = () => {
        if (sliderRef.current && sliderRef.current.innerSlider) {
            const currentSlide = sliderRef.current.innerSlider.state.currentSlide;
            const lugarAtual = lugares[currentSlide];
            if (navigator.share && lugarAtual) {
                navigator.share({
                    title: `Convite para ${lugarAtual.name}`,
                    text: `Encontre-se em ${lugarAtual.name}, localizado em ${lugarAtual.formatted_address}. Avaliação: ${lugarAtual.rating} estrelas.`,
                    url: window.location.href,
                })
                    .then(() => console.log('Compartilhamento realizado com sucesso!'))
                    .catch((error) => console.log('Erro ao compartilhar', error));
            }
        } else {
            console.log('Não foi possível encontrar o item atual para compartilhar.');
        }
    };

    const handleGoToSearch = () => {
        navigate('/');
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
                        <div key={lugar.place_id || index} className="detail">  {/* Adicionei um fallback para key */}
                            <div className="list-item">
                                <div className="rating-box">
                                    <FaStar color="#fff" />
                                    <p>{lugar.rating}</p>
                                </div>
                                <div className="item-box">
                                    <div className="item-box-image">
                                        {lugar.photo_reference && (
                                            <img
                                                src={getPhotoUrl(lugar.photo_reference)}
                                                alt={`Imagem do estabelecimento ${lugar.name}`}
                                                className="estabelecimento-imagem"
                                            />
                                        )}
                                    </div>
                                    <div className="item-box-info">
                                        <p className="nome"><b>{lugar.name}</b></p>
                                        <div className="price-status">
                                            <p style={{ color: '#f7c325', fontWeight: '600' }}>
                                                {Array(lugar.price_level).fill('$').join('')}
                                            </p>
                                            <p style={{ color: lugar.opening_hours && lugar.opening_hours.includes('Aberto') ? 'green' : 'gray', fontWeight: 600 }}>
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
                <button onClick={handleShareItem} className="active-item-button" aria-label="Compartilhar convite">
                    Compartilhar convite
                </button>
            </div>

            <div className='other'>
                <button onClick={handleGoToSearch} className="active-item-other" aria-label="Trocar Date">Trocar date</button>
            </div>
        </div>
    );
};

export default DetalheEstabelecimento;
