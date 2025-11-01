import { UbicacionDTO } from "./ubicacion-dto";

export interface CrearReporteDTO {
    titulo: string,
    descripcion: string,
    ubicacion: UbicacionDTO,
    ciudad: string,
    imagenes: string[],
    categoria: string
}
