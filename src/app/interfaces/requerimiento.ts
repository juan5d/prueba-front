export interface Requerimiento {
    solicitud_id: string,
    soporte_id: string,
    comentario: string,
    estado: string,
    fecha_solucion?: string | null | undefined,
    tecnico?: string
}
