import {Contenido, Marca} from "../Interfaces/Cerveza";

export class AddCerveza{
    constructor(
        public nombre:string,
        public descripcion:string,
        public id_marca:number,
        public id_contenido:number,
        public status:number
    ) {
    }
}