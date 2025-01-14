import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Certifique-se de ter o react-router-dom instalado

const ResetPassword = () => {
  const { uid, token } = useParams(); // Captura os parâmetros da URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/api/password-reset/confirm/`, {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError('Erro ao redefinir a senha. Tente novamente.');
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
          Nova Senha:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar Nova Senha:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Redefinir Senha</button>
      </form>
    </div>
  );
};

export default ResetPassword;