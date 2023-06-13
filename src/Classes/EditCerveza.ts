export class EditCerveza{
    constructor(
        id:number,
        public nombre:string,
        public descripcion:string,
        public id_marca:number,
        public id_contenido:number,
        public status:number
    ) {
    }
}