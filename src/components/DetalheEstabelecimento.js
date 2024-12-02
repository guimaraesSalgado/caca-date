import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { IconButton, Button, Box, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Header from './shared/Header';
import './DetalheEstabelecimento.css';

const DetalheEstabelecimento = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dados mockados
    const lugares = [
        {
            place_id: '1',
            name: 'Café da Esquina',
            description: 'Um ótimo café para relaxar e conversar.',
            rating: 4.5,
            price_level: 2,
            formatted_address: 'Rua das Flores, 123',
            distance: 2.5,
            photo_reference: 'https://media.istockphoto.com/id/1503385646/pt/foto/portrait-funny-and-happy-shiba-inu-puppy-dog-peeking-out-from-behind-a-blue-banner-isolated-on.jpg?s=612x612&w=0&k=20&c=svp3fKo9okQL-AsBZbBXRx5TC5deE7jDbUKQAQl2hOc='
        },
        {
            place_id: '2',
            name: 'Parque Central',
            description: 'Ideal para um passeio ao ar livre.',
            rating: 4.7,
            price_level: 1,
            formatted_address: 'Av. Central, 456',
            distance: 1.2,
            photo_reference: 'https://media.istockphoto.com/id/1503385646/pt/foto/portrait-funny-and-happy-shiba-inu-puppy-dog-peeking-out-from-behind-a-blue-banner-isolated-on.jpg?s=612x612&w=0&k=20&c=svp3fKo9okQL-AsBZbBXRx5TC5deE7jDbUKQAQl2hOc='
        },
        {
            place_id: '3',
            name: 'Cinema City',
            description: 'Experiência incrível de cinema.',
            rating: 4.3,
            price_level: 3,
            formatted_address: 'Rua das Estrelas, 789',
            distance: 3.4,
            photo_reference: 'https://media.istockphoto.com/id/1503385646/pt/foto/portrait-funny-and-happy-shiba-inu-puppy-dog-peeking-out-from-behind-a-blue-banner-isolated-on.jpg?s=612x612&w=0&k=20&c=svp3fKo9okQL-AsBZbBXRx5TC5deE7jDbUKQAQl2hOc='
        },
    ];

    const handleShareItem = () => {
        const lugarAtual = lugares[currentIndex];
        if (navigator.share && lugarAtual) {
            navigator.share({
                title: `Convite para ${lugarAtual.name}`,
                text: `Encontre-se em ${lugarAtual.name}, localizado em ${lugarAtual.formatted_address}. Avaliação: ${lugarAtual.rating} estrelas.`,
                url: window.location.href,
            })
                .then(() => console.log('Compartilhamento realizado com sucesso!'))
                .catch((error) => console.log('Erro ao compartilhar', error));
        } else {
            console.log('Compartilhamento não suportado ou item não encontrado.');
        }
    };

    const handleGoToSearch = () => {
        navigate('/');
    };

    const handleChangeIndex = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="container">
            <Header />
            <div className='description'>
                <h3>Trouxemos o melhor para você!</h3>
            </div>

            {lugares.length > 0 ? (
                <Box position="relative" width="100%">
                    <SwipeableViews
                        index={currentIndex}
                        onChangeIndex={handleChangeIndex}
                        enableMouseEvents
                        style={{ padding: '0 40px' }}
                    >
                        {lugares.map((lugar, index) => (
                            <Box key={lugar.place_id || index} className="detail">
                                <Box className="list-item" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                                    <Box className="item-box">
                                        <Box className="item-box-image">
                                            <img
                                                src={lugar.photo_reference}
                                                alt={`Imagem do date ${lugar.name}`}
                                                className="date-imagem"
                                            />
                                        </Box>
                                        <Box className="item-box-info" sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" className="nome">
                                                <b>{lugar.name}</b>
                                            </Typography>
                                            <Typography className="description">
                                                <b>{lugar.description}</b>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </SwipeableViews>

                    <IconButton
                        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentIndex === 0}
                        sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 1 }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, lugares.length - 1))}
                        disabled={currentIndex === lugares.length - 1}
                        sx={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: 1 }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            ) : (
                <Typography variant="body2" align="center">Nenhum date encontrado.</Typography>
            )}

            <Box display="flex" justifyContent="center" my={2}>
                <Button
                    onClick={handleShareItem}
                    variant="contained"
                    color="primary"
                    startIcon={<ShareIcon />}
                    aria-label="Compartilhar convite"
                >
                    Compartilhar convite
                </Button>
            </Box>

            <Box display="flex" justifyContent="center" mb={2}>
                <Button
                    onClick={handleGoToSearch}
                    variant="outlined"
                    color="secondary"
                    aria-label="Trocar Date"
                >
                    Trocar date
                </Button>
            </Box>
        </div>
    );
};

export default DetalheEstabelecimento;
