import { UbicacionDTO } from "./ubicacion-dto";

export interface ReporteDTO {
    id:string,
    usuario: string,
    titulo: string,
    categoria: string,
    ciudad: string, // Added missing property
    descripcion: string,
    ubicacion: UbicacionDTO,
    estadoActual: string,
    imagenes: string[],
    fechaCreacion: string,
    cantidadImportante: number
}