import React, { useState } from 'react';
import axios from 'axios'; // Certifique-se de ter o axios instalado

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/password-reset/',
        { email },
        {
          headers: {
            'Content-Type': 'application/json', // Adicione este cabeçalho
          },
        }
      );
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError('Erro ao solicitar redefinição de senha. Verifique o email e tente novamente.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Redefinir Senha</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Solicitar Redefinição</button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;