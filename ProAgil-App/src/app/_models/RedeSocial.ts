import { Palestrante } from "./Palestrante";

export interface RedeSocial {

  id: Number ;
  nome: string ;
  URL: string ;
  eventoId?: Number;
  palestranteId?: Number;
}
