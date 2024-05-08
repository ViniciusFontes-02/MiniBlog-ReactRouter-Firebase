import { useState, useEffect, useReducer } from "react";

import { db } from "../firebase/config";

import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

// aceita o estado e a ação que quero executar
const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };

    case "INSERTED_DOC":
      return { loading: false, error: null };

    case "ERROR":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// vai receber a coleção
export const useInsertDocument = (docCollection) => {
  // vai passar qual a função que vai tratar dos eventos do reducer e qual função inicial
  const [response, dispatch] = useReducer(insertReducer, initialState);

  // para não ter vazamento de memoria
  const [cancelled, setCancelled] = useState(false);

  // olhar se for cancelado ou não, se nao foi cancelado, dou dispacth na action
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      // trazendo documento e a data atual
      const newDocument = { ...document, createdAt: Timestamp.now() };

      // procura a coleção que é passada no argumento da função
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  });

  return { insertDocument, response };
};
