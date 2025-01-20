import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Modal } from '@mui/material';

const EmailConfirmed = () => {
    const navigate = useNavigate();

    // Estilo do modal
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        outline: 'none', // Remove o outline
    };

    // Estilo do fundo
    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://source.unsplash.com/random)', // Imagem de fundo moderna
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(5px)', // Desfoque no fundo
        zIndex: -1,
    };

    // Estilo do logo "Trinar"
    const logoStyle = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#111', // Cor primária do Material-UI
        marginBottom: '0.5rem',
        marginTop: '0', // Remove o espaçamento acima do logo
    };

    // Estilo do divisor
    const dividerStyle = {
        border: '0', // Remove a borda padrão
        height: '1px', // Altura da linha
        backgroundColor: '#ccc', // Cor da linha
        margin: '0 auto', // Centraliza o divisor
        width: '100%', // Largura da linha (ajuste conforme necessário)
        marginBottom: '1.5rem', // Espaçamento abaixo do divisor
    };

    return (
        <div>
            {/* Fundo moderno e desfocado */}
            <div style={backgroundStyle}></div>

            {/* Modal centralizado */}
            <Modal
                open={true} // O modal está sempre aberto nesta página
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    {/* Logo "Trinar" */}
                    <h1 style={logoStyle}>trinar</h1>

                    {/* Divisor estilizado */}
                    <hr style={dividerStyle} />

                    {/* Mensagem de confirmação */}
                    <Typography variant="h5" id="modal-title" gutterBottom>
                        E-mail confirmado com sucesso!
                    </Typography>
                    <Typography variant="body1" id="modal-description" sx={{ mb: 3 }}>
                        Você já pode fazer login na sua conta.
                    </Typography>

                    {/* Botão para login */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/login')}
                        sx={{ outline: 'none' }} // Remove o outline do botão
                    >
                        Logue-se
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default EmailConfirmed;