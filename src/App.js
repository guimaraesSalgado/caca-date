import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuscaEstabelecimento from './components/BuscaEstabelecimento';
import DetalheEstabelecimento from './components/DetalheEstabelecimento';
import Roleta from './components/Roleta';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuscaEstabelecimento />} />
        <Route path="/roleta" element={<Roleta />} /> {/* Adiciona a rota da roleta */}
        <Route path="/detalhes" element={<DetalheEstabelecimento />} />
      </Routes>
    </Router>
  );
}

export default App;
