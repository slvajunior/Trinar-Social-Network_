// Importe 'useNavigate' no lugar de 'useHistory'
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <- Novo hook

const Login = () => {
  const navigate = useNavigate(); // Use navigate agora para navegação
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implemente a lógica para validar o login
    // Se o login for bem-sucedido:
    navigate("/dashboard"); // Redireciona para a página desejada após o login
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <span>
          Não tem uma conta?{" "}
          <a href="/register" onClick={() => navigate("/register")}>Registre-se aqui</a> {/* Redireciona para a tela de registro */}
        </span>
      </div>
    </div>
  );
};

export default Login;
