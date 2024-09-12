const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors()); // Permitir requisições do front-end

// Função para buscar as coordenadas do CEP usando a API do Google Geocoding
const buscarCoordenadasPorCEP = async (cep) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`; // Usando a chave do .env
  console.log(`Requisição para Geocoding API: ${url}`);
  
  const response = await axios.get(url);
  if (response.data.status === 'OK') {
    const location = response.data.results[0].geometry.location;
    return location;
  } else {
    console.error(`Erro ao buscar coordenadas: Status: ${response.data.status}, Mensagem: ${response.data.error_message}`);
    throw new Error('Erro ao buscar coordenadas');
  }
};

// Função para buscar estabelecimentos próximos usando a API do Google Places
const buscarEstabelecimentosPorCoordenadas = async (latitude, longitude, tipo, valorMaximo, raioKm) => {
    if (!raioKm || raioKm <= 0) {
        throw new Error('O raio deve ser maior que 0');
    }

    const raioMetros = raioKm * 1000; // Converte o raio de km para metros
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${raioMetros}&type=${tipo}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;
    console.log(`Fazendo requisição para Google Places: ${url}`);
    
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      const estabelecimentos = response.data.results
        .filter(lugar => lugar.price_level && lugar.price_level <= valorMaximo)
        .map(lugar => ({
          name: lugar.name,
          formatted_address: lugar.vicinity,
          price_level: lugar.price_level || 0,
          rating: lugar.rating || 0,
          opening_hours: lugar.opening_hours ? (lugar.opening_hours.open_now ? 'Aberto agora' : 'Fechado agora') : 'Não disponível',
          place_id: lugar.place_id,
          distance: calcularDistancia(latitude, longitude, lugar.geometry.location.lat, lugar.geometry.location.lng),
          photo_reference: lugar.photos && lugar.photos.length > 0 ? lugar.photos[0].photo_reference : null, // Pega o primeiro photo_reference
        }));
      return estabelecimentos;
    } else {
      console.error(`Erro da API Google Places: ${response.data.status}, Mensagem: ${response.data.error_message}`);
      throw new Error('Erro ao buscar estabelecimentos');
    }
  };
  
// Função para calcular a distância entre dois pontos (em km)
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distância em km
  return distancia.toFixed(2); // Retorna a distância com duas casas decimais
};

// Rota para buscar estabelecimentos com base no CEP, tipo, valor máximo e raio
app.post('/buscar-estabelecimentos', async (req, res) => {
  const { cep, tipo, valorMaximo, raio } = req.body; // Adiciona o parâmetro raio
  try {
    if (!raio || raio <= 0) {
      return res.status(400).json({ error: 'O raio deve ser maior que 0' });
    }

    console.log(`Buscando coordenadas para o CEP: ${cep}`);
    const coordenadas = await buscarCoordenadasPorCEP(cep);
    console.log(`Coordenadas encontradas: Latitude ${coordenadas.lat}, Longitude ${coordenadas.lng}`);

    console.log(`Buscando estabelecimentos próximos ao tipo: ${tipo}, valor máximo: ${valorMaximo}, raio: ${raio} km`);
    const estabelecimentos = await buscarEstabelecimentosPorCoordenadas(coordenadas.lat, coordenadas.lng, tipo, valorMaximo, raio);
    
    console.log(`Estabelecimentos encontrados: ${estabelecimentos.length}`);
    res.status(200).json({ lugares: estabelecimentos });
  } catch (error) {
    console.error(`Erro no processo: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Porta de escuta
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

