// CSS
import styles from "./Login.module.css";

// hooks
import { useState, useEffect } from "react";

import { useAuthentication } from "../../hooks/useAuthentication";

const Login = () => {
  // formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // erro
  const [error, setError] = useState("");

  // importando recursos, como error ja esta usado, troca o nome
  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // quando envia o formulario eu zero os erros
    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);

    console.log(res);
  };

  // mapeia se o authError mudou, se mudae vai substituir o erro atual pelo erro vindo da autenticação
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça o login e compartilhe suas historias</p>

      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail:</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* se estiver em loading nao vai exibir o botão */}
        {!loading && <button className="btn">Entrar</button>}

        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
