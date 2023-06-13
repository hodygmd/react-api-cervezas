import React,{useState,useEffect} from "react";
import {Marca} from "../Interfaces/Cerveza";
import axios from "axios";
import {AddMarca} from "../Classes/AddMarca";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {EditMarca} from "../Classes/EditMarca";


export default function Marcas() {
    const baseUrl: string = "http://localhost:8081/marca"
    const [data, setData] = useState<Marca[]>([]);

    useEffect(() => {
        axios.get<Marca[]>(`${baseUrl}`)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [nombre,setNombre]=useState('')
    const [desc,setDesc]=useState('')
    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(event.target.value)
    }
    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(event.target.value)
    }

    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setNombre('')
        setDesc('')
    }
    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        if(!edit){
            axios.post<Marca>(`${baseUrl}/create`,new AddMarca(nombre,desc,1))
                .then(reponse=>{
                    console.log(reponse.data)
                    const newData:Marca[]=[
                        ...data,
                        {
                            id:reponse.data.id,
                            nombre:reponse.data.nombre,
                            descripcion:reponse.data.descripcion,
                            status:reponse.data.status
                        }
                    ]
                    setData(newData)
                }).catch(error=>{
                    console.log(error)
            })
        }else {
            axios.put<Marca>(`${baseUrl}/update/${data[indexToEdit].id}`,new EditMarca(data[indexToEdit].id,nombre,desc,1))
                .then(reponse=>{
                    const updatedData=data.map(item=>{
                        if(item.id===data[indexToEdit].id){
                            return {...item,nombre:nombre,descripcion:desc}
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
        setNombre('')
        setDesc('')
        setShowModal(false)
    }
    const editElement=(index:number)=>{
        setEdit(true)
        setButtonSubmitText('Edit')
        setNombre(data[index].nombre)
        setDesc(data[index].descripcion)
        setIndexToEdit(index)
        handleShowModal()
    }
    const deleteElement=(id:number,nom:string,descrip:string)=>{
        axios.put<Marca>(`${baseUrl}/delete/${id}`,new EditMarca(id,nom,descrip,0))
            .then(response=>{
                setData(data.filter(obj=>obj.id!==id))
            }).catch(error=>{
                console.log(error)
        })
    }
    return (
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Agregar Marca
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.nombre}<br/></p>
                            {item.descripcion}
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id,item.nombre,item.descripcion)}>Delete
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
                            <ModalHeader style={{backgroundColor: "#347094"}}>Marca</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Marca:<br/>
                                    <input type={"text"} value={nombre} onChange={handleNombreChange} required
                                           style={{width: "18rem"}}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Descripcion:<br/>
                                    <textarea value={desc} onChange={handleDescChange} required
                                              style={{width: "29rem", height: "10rem"}}/>
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