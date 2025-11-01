import { ObtenerCategoriaDTO } from "./obtener-categoria-dto";

export interface MensajeOpcionalCategoria <T>{
    error: boolean;
    mensaje: ObtenerCategoriaDTO[];
}
