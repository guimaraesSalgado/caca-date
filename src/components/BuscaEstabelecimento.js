    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import CircularProgress from '@mui/material/CircularProgress';
    import Snackbar from '@mui/material/Snackbar';
    import Alert from '@mui/material/Alert';
    import Slide from '@mui/material/Slide';

    import bannerImage from '../assets/title-caca-date.svg';

    import Header from './shared/Header';
    import FormInput from './shared/FormInput';
    import FormSelect from './shared/FormSelect';

    import './BuscaEstabelecimento.css';

    const BuscaEstabelecimento = () => {
        const navigate = useNavigate();
        const [convidado, setConvidado] = useState('');
        const [data, setData] = useState('');
        const [hora, setHora] = useState('');
        const [local, setLocal] = useState('');
        const [isSpinning] = useState(false);
        const [error, setError] = useState(null);
        const [snackbarOpen, setSnackbarOpen] = useState(false);

        const handleCloseSnackbar = () => setSnackbarOpen(false);

        const handleSubmit = () => {
            const today = new Date(); // Data atual com hora
            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Meia-noite de hoje
            const selectedDate = new Date(data);
            const selectedHour = parseInt(hora.split(':')[0], 10);

            // Verifica se a data é passada ou se é hoje, mas o horário já passou
            if (
                selectedDate < todayMidnight ||
                (selectedDate.getTime() === todayMidnight.getTime() && selectedHour <= today.getHours())
            ) {
                setError("Selecione um horário futuro.");
                setSnackbarOpen(true);
                return;
            }

            navigate("/wheel");
        };


        const generateHourOptions = (selectedDate) => {
            const now = new Date();
            const todayISO = now.toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
            const currentHour = now.getHours();
        
            if (selectedDate === todayISO) {
                // Para hoje, mostre apenas horas futuras
                return Array.from({ length: 24 - currentHour - 1 }, (_, i) => {
                    const hour = currentHour + 1 + i;
                    const formattedHour = String(hour).padStart(2, '0');
                    return `${formattedHour}:00`;
                });
            }
        
            // Para outras datas, mostre todas as horas
            return Array.from({ length: 24 }, (_, i) => {
                const formattedHour = String(i).padStart(2, '0');
                return `${formattedHour}:00`;
            });
        };
        

        return (
            <div className="container busca-container">
                <Header />
                <div className="hero-section">
                    <img src={bannerImage} alt="Título Caca Date" className="hero-image" />
                </div>

                <form
                    className="form-container"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <FormInput
                        id="convidado"
                        label="Qual é o nome da pessoa convidada?"
                        value={convidado}
                        onChange={(e) => setConvidado(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                        placeholder="O nome irá aparecer no convite"
                        required
                    />

                    <div className="date-time-row">
                        <FormInput
                            id="data"
                            label="Data do encontro"
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            onBlur={(e) => {
                                const inputDate = new Date(e.target.value); // Data selecionada no campo
                                const today = new Date(); // Data atual com hora
                                const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Meia-noite de hoje
                            
                                // Verifique se a data é anterior ao dia atual
                                if (inputDate < todayMidnight) {
                                    alert("Selecione uma data atual ou futura.");
                                    setData(''); // Reseta o valor do campo se inválido
                                }
                            }}                            
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <FormSelect
                            id="hora"
                            label="Hora do encontro"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            options={data ? generateHourOptions(data) : []}
                            placeholder="Selecione a hora"
                            disabled={!data}
                            required
                        />
                    </div>

                    <FormInput
                        id="local"
                        label="Local do encontro"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        placeholder="Digite o local do encontro"
                        required
                    />

                    <div className="cta-section">
                        <button
                            className="cta-button"
                            type="submit"
                            disabled={!convidado.trim() || !local.trim() || isSpinning}
                        >
                            {isSpinning ? <CircularProgress size={24} color="inherit" /> : 'Encontrar date'}
                        </button>
                    </div>

                </form>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    TransitionComponent={(props) => <Slide {...props} direction="down" />}
                >
                    <Alert severity="error" onClose={handleCloseSnackbar}>
                        {error}
                    </Alert>
                </Snackbar>
            </div>
        );
    };

    export default BuscaEstabelecimento;
