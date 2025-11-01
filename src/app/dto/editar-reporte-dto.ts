import { UbicacionDTO } from "./ubicacion-dto";

export interface EditarReporteDTO {
    
    titulo: string,
    categoria: string,
    ciudad: string,
    descripcion: string,
    ubicacion: UbicacionDTO,
    imagen: string[]
}