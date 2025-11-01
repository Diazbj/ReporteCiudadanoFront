import { ReporteDTO } from "./reporte-dto";

export interface MensajeOpcionalDTO <T>{
    error: boolean;
    mensaje: ReporteDTO[];
}