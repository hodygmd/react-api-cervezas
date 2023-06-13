export interface Cerveza {
    id: number;
    nombre: string;
    descripcion: string;
    id_marca: Marca;
    id_contenido: Contenido;
    status: number;
}
export interface Marca {
    id: number;
    nombre: string;
    descripcion: string;
    status: number;
}
1
export interface Contenido {
    id: number;
    cantidad: number;
    status: number;
}