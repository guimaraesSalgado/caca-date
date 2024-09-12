import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuscaEstabelecimento from './components/BuscaEstabelecimento';
import DetalheEstabelecimento from './components/DetalheEstabelecimento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuscaEstabelecimento />} />
        <Route path="/detalhes" element={<DetalheEstabelecimento />} />
      </Routes>
    </Router>
  );
}

export default App;
