import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQuery() {
  // pegando parametros da url quando a pagina é recarregada
  const { search } = useLocation();

  // busca parametro na busca e traz o parametro para mim
  // SO IRA SER EXECUTADA QUANDO SEARCH FOR ALTERADO
  return useMemo(() => new URLSearchParams(search), [search]);
}
