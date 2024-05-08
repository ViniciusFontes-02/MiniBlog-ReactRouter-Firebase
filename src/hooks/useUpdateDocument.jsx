import { useState, useEffect, useReducer } from "react";

import { db } from "../firebase/config";

import { updateDoc, doc } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

// aceita o estado e a ação que quero executar
const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };

    case "UPDATED_DOC":
      return { loading: false, error: null };

    case "ERROR":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// vai receber a coleção
export const useUpdateDocument = (docCollection) => {
  // vai passar qual a função que vai tratar dos eventos do reducer e qual função inicial
  const [response, dispatch] = useReducer(updateReducer, initialState);

  // para não ter vazamento de memoria
  const [cancelled, setCancelled] = useState(false);

  // olhar se for cancelado ou não, se nao foi cancelado, dou dispacth na action
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const updateDocument = async (id, data) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      const docRef = await doc(db, docCollection, id);
      const updatedDocument = await updateDoc(docRef, data);

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updatedDocument,
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

  return { updateDocument, response };
};
