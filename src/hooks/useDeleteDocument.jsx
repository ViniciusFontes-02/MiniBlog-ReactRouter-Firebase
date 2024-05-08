import { useState, useEffect, useReducer } from "react";

import { db } from "../firebase/config";

import { doc, deleteDoc } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

// aceita o estado e a ação que quero executar
const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };

    case "DELETED_DOC":
      return { loading: false, error: null };

    case "ERROR":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// vai receber a coleção
export const useDeleteDocument = (docCollection) => {
  // vai passar qual a função que vai tratar dos eventos do reducer e qual função inicial
  const [response, dispatch] = useReducer(deleteReducer, initialState);

  // para não ter vazamento de memoria
  const [cancelled, setCancelled] = useState(false);

  // olhar se for cancelado ou não, se nao foi cancelado, dou dispacth na action
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
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

  return { deleteDocument, response };
};
