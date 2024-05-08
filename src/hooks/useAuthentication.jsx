import { db } from "../firebase/config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // use state que vai cancelar as açoes futuras dos componentes

  const [cancelled, setCancelled] = useState(false);

  // pegando a autenticação
  const auth = getAuth();

  function checkIfIsCancelled() {
    // se estiver cancelado, retorna
    if (cancelled) {
      return; // cleanup => lidar com vazamento de memória
    }
  }

  // REGISTER
  // função assincrona pq pode demorar muito
  const createUser = async (data) => {
    checkIfIsCancelled(); //checar se foi cancelado

    // se noa estiver cancelado
    setLoading(true);

    // limpando erro
    setError(null);

    try {
      // criando usuario. await=> esperando dados do user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // atualizando usuario com nome enviado
      await updateProfile(user, {
        displayName: data.displayName,
      });

      setLoading(false);

      return user;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      // se na mensagem incluir password, é erro de senha
      let systemErrorMessage;

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa ter pelo menos 6 caracteres";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado";
      } else {
        systemErrorMessage = "Ocorreu um erro, tente mais tarde.";
      }

      setLoading(false);
      setError(systemErrorMessage);
    }
  };

  // LOGOUT - SIGN OUT
  const logout = () => {
    checkIfIsCancelled();

    // para sair é so invocar a função do firebase e passar a autenticação
    signOut(auth);
  };

  // função async para esperar as informções chegar dps de logar
  const login = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    // zerando todos os erros
    setError(false);

    try {
      // tentar logar usuario
      await signInWithEmailAndPassword(auth, data.email, data.password);

      setLoading(false);
    } catch (error) {
      // se na mensagem incluir password, é erro de senha
      let systemErrorMessage;

      console.log(error);
      // se o usuario não existir

      if (error.message.includes("invalid-credential")) {
        systemErrorMessage =
          "Preencha as suas informações corretamente ou Faça seu cadastro";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []); //ira executar apenas uma vez

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
  };
};
