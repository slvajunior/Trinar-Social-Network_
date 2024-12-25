import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <- Novo hook

const Register = () => {
  const navigate = useNavigate(); // Usando 'navigate' aqui também
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de registro (salvamento no banco de dados, por exemplo)
    navigate("/login"); // Redireciona para o login após o registro
  };

  return (
    <div>
      <h2>Registre-se</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome"
        />
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
          placeholder="Senha" 
        />
        <button type="submit">Registrar</button>
      </form>
      <div>
        <span>
          Já tem uma conta?{" "}
          <a href="/login" onClick={() => navigate("/login")}>Faça login aqui</a> {/* Link para login */}
        </span>
      </div>
    </div>
  );
};

export default Register;
