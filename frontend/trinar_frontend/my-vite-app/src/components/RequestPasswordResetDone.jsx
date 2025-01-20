// frontend/trinar_frontend/src/components/RequestPasswordResetDone.js

import React from "react";
import { Link } from "react-router-dom";

const RequestPasswordResetDone = () => {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Email Enviado</h2>
      <p>
        Enviamos um email com instruções para redefinir sua senha. Verifique sua
        caixa de entrada.
      </p>
      <p>
        Se você não receber o email, verifique sua pasta de spam ou{" "}
        <Link to="/request-password-reset">tente novamente</Link>.
      </p>
    </div>
  );
};

export default RequestPasswordResetDone;
