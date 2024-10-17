const axios = require('axios');

// Função para buscar as coordenadas do CEP usando a API do Google Geocoding
const buscarCoordenadasPorCEP = async (cep) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;
  const response = await axios.get(url);

  if (response.data.status === 'OK') {
    const location = response.data.results[0].geometry.location;
    return location;
  } else {
    throw new Error('Erro ao buscar coordenadas');
  }
};

// Função para buscar estabelecimentos próximos usando a API do Google Places
const buscarEstabelecimentosPorCoordenadas = async (latitude, longitude, tipo, valorMaximo, raioKm) => {
  const raioMetros = raioKm * 1000; // Converte o raio de km para metros
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${raioMetros}&type=${tipo}&key=AIzaSyA-k29mFBaCGACDuPXy9rqOalw0fPXXgEQ`;

  const response = await axios.get(url);

  if (response.data.status === 'OK') {
    return response.data.results.map((lugar) => ({
      name: lugar.name,
      formatted_address: lugar.vicinity,
      price_level: lugar.price_level || 0,
      rating: lugar.rating || 0,
      opening_hours: lugar.opening_hours
        ? lugar.opening_hours.open_now
          ? 'Aberto agora'
          : 'Fechado agora'
        : 'Não disponível',
      place_id: lugar.place_id,
      photo_reference: lugar.photos?.[0]?.photo_reference || null,
      types: lugar.types // Incluindo as categorias (tags) do local
    }));
  } else {
    throw new Error('Erro ao buscar estabelecimentos');
  }
};

// Handler para lidar com a requisição POST
module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { cep, tipo, valorMaximo, raio } = req.body;
    try {
      // Buscar as coordenadas com base no CEP fornecido
      const coordenadas = await buscarCoordenadasPorCEP(cep);
      
      // Buscar estabelecimentos próximos com base nas coordenadas, tipo e valor máximo
      const estabelecimentos = await buscarEstabelecimentosPorCoordenadas(
        coordenadas.lat,
        coordenadas.lng,
        tipo,
        valorMaximo,
        raio
      );
      
      // Retornar os estabelecimentos encontrados
      res.status(200).json({ lugares: estabelecimentos });
    } catch (error) {
      // Em caso de erro, retornar status 500 com a mensagem de erro
      res.status(500).json({ error: error.message });
    }
  } else {
    // Se o método HTTP não for POST, retornar status 405 (método não permitido)
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
};
