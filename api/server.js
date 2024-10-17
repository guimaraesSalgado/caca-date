const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors()); // Permitir requisições do front-end

// Função para buscar as coordenadas do CEP usando a API do Google Geocoding
const buscarCoordenadasPorCEP = async (cep) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;
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

// Função para buscar estabelecimentos próximos usando a API do Google Places com keywords
const buscarEstabelecimentosPorCoordenadas = async (latitude, longitude, tipo, valorMaximo, raioKm, keyword) => {
  if (!raioKm || raioKm <= 0) {
      throw new Error('O raio deve ser maior que 0');
  }

  const raioMetros = raioKm * 1000; // Converte o raio de km para metros
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${raioMetros}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;
  
  if (tipo) {
    url += `&type=${tipo}`;
  }

  if (keyword) {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }

  console.log(`Fazendo requisição para Google Places: ${url}`);
  
  const response = await axios.get(url);
  if (response.data.status === 'OK') {
    const estabelecimentos = response.data.results
      // Filtrar apenas estabelecimentos com rating >= 3.0
      .filter(lugar => lugar.rating && lugar.rating >= 3.0)
      // Mapear os estabelecimentos para pegar as informações necessárias
      .map(lugar => ({
        name: lugar.name,
        formatted_address: lugar.vicinity,
        price_level: lugar.price_level || 0,
        rating: lugar.rating || 0,
        opening_hours: lugar.opening_hours ? (lugar.opening_hours.open_now ? 'Aberto agora' : 'Fechado agora') : 'Não disponível',
        place_id: lugar.place_id,
        types: lugar.types || [], // Inclui os tipos do estabelecimento
        distance: calcularDistancia(latitude, longitude, lugar.geometry.location.lat, lugar.geometry.location.lng),
        photo_reference: lugar.photos && lugar.photos.length > 0 ? lugar.photos[0].photo_reference : null, // Pega o primeiro photo_reference
    }))
    // Ordenar os estabelecimentos
    .sort((a, b) => {
        // Ordenar primeiramente pelos estabelecimentos com price_level <= valorMaximo
        if (a.price_level <= valorMaximo && b.price_level > valorMaximo) {
            return -1;
        }
        if (a.price_level > valorMaximo && b.price_level <= valorMaximo) {
            return 1;
        }
        // Se os dois estabelecimentos estão no mesmo nível de preço, ordenar por rating de forma decrescente
        return b.rating - a.rating;
    });

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

// Função para gerar dados aleatórios para o encontro aleatório
const gerarDadosAleatorios = () => {
  const keywords = ['date', 'animado', 'jogos', 'bebidas', 'relaxante', 'pet friendly', 'vegano'];
  const tipos = ['restaurant', 'cafe', 'bar', 'gym', 'movie_theater', 'shopping_mall', 'park'];
  const raios = [5, 10, 15, 20];
  const valorMaximos = [1, 2, 3, 4, 5];

  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const raio = raios[Math.floor(Math.random() * raios.length)];
  const valorMaximo = valorMaximos[Math.floor(Math.random() * valorMaximos.length)];

  return { keyword, tipo, raio, valorMaximo };
};

// Rota para buscar estabelecimentos com base no CEP, tipo, valor máximo, raio e keywords
app.post('/buscar-estabelecimentos', async (req, res) => {
  const { cep, tipo, valorMaximo, raio, keyword } = req.body;
  try {
    if (!raio || raio <= 0) {
      return res.status(400).json({ error: 'O raio deve ser maior que 0' });
    }

    console.log(`Buscando coordenadas para o CEP: ${cep}`);
    const coordenadas = await buscarCoordenadasPorCEP(cep);
    console.log(`Coordenadas encontradas: Latitude ${coordenadas.lat}, Longitude ${coordenadas.lng}`);

    console.log(`Buscando estabelecimentos próximos ao tipo: ${tipo}, valor máximo: ${valorMaximo}, raio: ${raio} km, keyword: ${keyword}`);
    const estabelecimentos = await buscarEstabelecimentosPorCoordenadas(coordenadas.lat, coordenadas.lng, tipo, valorMaximo, raio, keyword);
    
    res.status(200).json({ lugares: estabelecimentos });
  } catch (error) {
    console.error(`Erro no processo: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Rota para "Encontro Aleatório" - Gera dados aleatórios e busca estabelecimentos com base nesses dados
app.post('/buscar-aleatorio', async (req, res) => {
  const { cep } = req.body;

  try {
    // Gera dados aleatórios
    const { keyword, tipo, raio, valorMaximo } = gerarDadosAleatorios();
    
    // Busca as coordenadas do CEP fornecido
    const coordenadas = await buscarCoordenadasPorCEP(cep);

    // Faz a busca de estabelecimentos próximos usando os valores aleatórios
    const estabelecimentos = await buscarEstabelecimentosPorCoordenadas(
      coordenadas.lat,
      coordenadas.lng,
      tipo,
      valorMaximo,
      raio,
      keyword
    );
    
    res.status(200).json({
      keyword,
      tipo,
      raio,
      valorMaximo,
      lugares: estabelecimentos
    });
  } catch (error) {
    console.error(`Erro ao realizar busca aleatória: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Porta de escuta
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
