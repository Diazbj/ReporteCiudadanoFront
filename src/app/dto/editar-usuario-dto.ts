import { UbicacionDTO } from './ubicacion-dto';

export interface EditarUsuarioDTO {
    nombre: string,
    telefono: string,
    ciudad: string,
    direccion: string,
    ubicacion?: UbicacionDTO
}