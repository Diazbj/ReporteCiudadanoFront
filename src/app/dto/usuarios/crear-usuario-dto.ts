import { UbicacionDTO } from '../ubicacion-dto';

export interface CrearUsuarioDTO {
    nombre: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    email: string;
    password: string;
    ubicacion?: UbicacionDTO;
}