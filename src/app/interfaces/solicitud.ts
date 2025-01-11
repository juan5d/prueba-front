export interface Solicitud {
    id?:string
    nombre: string,
    apellido: string,
    correo: string,
    fecha_ingres?: string | null | undefined,
    solicitud: string
}

