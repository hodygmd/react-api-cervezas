import React, {useEffect, useState} from "react";
import {Cerveza, Contenido, Marca} from "../Interfaces/Cerveza";
import axios from "axios";
import {AddCerveza} from "../Classes/AddCerveza";
import {EditCerveza} from "../Classes/EditCerveza";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
export default function Cervezas(){
    const baseUrl: string = "http://localhost:8081/cerveza"
    const baseUrlAux: string = "http://localhost:8081"
    const [data, setData] = useState<Cerveza[]>([]);
    const [getMarc, setGetMarc] = useState<Marca[]>([]);
    const [getCont, setGetCont] = useState<Contenido[]>([]);

    useEffect(() => {
        axios.get<Cerveza[]>(`${baseUrl}`)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        axios.get<Marca[]>(`${baseUrlAux}/marca`)
            .then(response => {
                console.log(response.data)
                setGetMarc(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        axios.get<Contenido[]>(`${baseUrlAux}/contenido`)
            .then(response => {
                console.log(response.data)
                setGetCont(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [nombre,setNombre]=useState('')
    const [desc,setDesc]=useState('')
    const [idMarc, setIdMarc] = useState(0)
    const [idCont, setIdCont] = useState(0)
    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(event.target.value)
    }
    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(event.target.value)
    }
    const handleIdMarcChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdMarc(parseInt(event.target.value))
    }
    const handleIdContChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdCont(parseInt(event.target.value))
    }
    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setNull()
    }
    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        if(!edit){
            axios.post<Cerveza>(`${baseUrl}/create`,new AddCerveza(nombre,desc,idMarc,idCont,1))
                .then(reponse=>{
                    console.log(reponse.data)
                    const newData:Cerveza[]=[
                        ...data,
                        {
                            id:reponse.data.id,
                            nombre:reponse.data.nombre,
                            descripcion:reponse.data.descripcion,
                            id_marca:reponse.data.id_marca,
                            id_contenido:reponse.data.id_contenido,
                            status:reponse.data.status
                        }
                    ]
                    setData(newData)
                }).catch(error=>{
                console.log(error)
            })
        }else {
            axios.put<Cerveza>(`${baseUrl}/update/${data[indexToEdit].id}`,new EditCerveza(data[indexToEdit].id,nombre,desc,idMarc,idCont,1))
                .then(reponse=>{
                    const updatedData=data.map(item=>{
                        if(item.id===data[indexToEdit].id){
                            return {
                                ...item,
                                nombre:nombre,
                                descripcion:desc,
                                id_marca:{
                                    id:idMarc,
                                    nombre:getMarc[idMarc].nombre,
                                    descripcion:getMarc[idMarc].descripcion,
                                    status:getMarc[idMarc].status
                                },
                                id_contenido:{
                                    id:idCont,
                                    cantidad:getCont[idCont].cantidad,
                                    status:getCont[idCont].status
                                }}
                        }
                        return item;
                    })
                    setData(updatedData)
                }).catch(error=>{
                console.log(error)
            })
            setButtonSubmitText('Add')
            setEdit(false)
        }
        setNull()
        setShowModal(false)
    }
    const editElement = (index: number) => {
        setEdit(true)
        setButtonSubmitText('Edit')
        setNombre(data[index].nombre)
        setDesc(data[index].descripcion)
        setIdMarc(data[index].id_marca.id)
        setIdCont(data[index].id_contenido.id)
        setIndexToEdit(index)
        handleShowModal()
    }
    const deleteElement=(id:number,nom:string,descrip:string,id_marc:number,id_cont:number)=>{
        axios.put<Cerveza>(`${baseUrl}/delete/${id}`,new EditCerveza(id,nom,descrip,id_marc,id_cont,0))
            .then(response=>{
                setData(data.filter(obj=>obj.id!==id))
            }).catch(error=>{
            console.log(error)
        })
    }
    const setNull = () => {
        setNombre('')
        setDesc('')
        setIdMarc(0)
        setIdCont(0)
    }
    return(
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Agregar Cerveza
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.nombre}<br/></p>
                            Descripcion: {item.descripcion} M☉<br/>
                            Marca: {item.id_marca.nombre}<br/>
                            Contenido: {item.id_contenido.cantidad} ml
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id,item.nombre,item.descripcion,item.id_marca.id,item.id_contenido.id)}>Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                {showModal &&
                    <Modal isOpen={showModal} toggle={() => handleShowModal()}>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader style={{backgroundColor: "#347094"}}>Cerveza</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Nombre:<input className={"ms-2"} type={"text"} value={nombre} required
                                                onChange={handleNombreChange}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Descripcion:<br/>
                                    <textarea value={desc} onChange={handleDescChange} required
                                              style={{width: "29rem", height: "10rem"}}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Marca:
                                    <select className={"ms-3"} value={idMarc} onChange={handleIdMarcChange}>
                                        <option value={0} selected>--Selecciona--</option>
                                        {getMarc.map((item) => (
                                            <option value={item.id}>{item.nombre}</option>
                                        ))}
                                    </select>
                                </label>
                                <br/><br/>
                                <label>
                                    Contenido:
                                    <select className={"ms-3"} value={idCont} onChange={handleIdContChange}>
                                        <option value={0} selected>--Selecciona--</option>
                                        {getCont.map((item) => (
                                            <option value={item.id}>{item.cantidad} ml</option>
                                        ))}
                                    </select>
                                </label>
                            </ModalBody>
                            <ModalFooter style={{backgroundColor: "#347094"}}>
                                <Button color={"success"} type={"submit"}>{buttonSubmitText}</Button>
                                <Button color={"danger"} onClick={() => handleCloseModal()}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </Modal>
                }
            </div>
        </>
    )
}