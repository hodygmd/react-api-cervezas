import React, {useEffect, useState} from "react";
import {Contenido} from "../Interfaces/Cerveza"
import axios from "axios";
import {AddContenido} from "../Classes/AddContenido";
import {EditContenido} from "../Classes/EditContenido";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
export default function Contenidos(){
    const baseUrl: string = "http://localhost:8081/contenido"
    const [data, setData] = useState<Contenido[]>([]);

    useEffect(() => {
        axios.get<Contenido[]>(`${baseUrl}`)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [cantidad,setCantidad]=useState(0)
    const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCantidad(parseInt(event.target.value))
    }

    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setCantidad(0)
    }

    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)

    const handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        if(!edit){
            axios.post<Contenido>(`${baseUrl}/create`,new AddContenido(cantidad,1))
                .then(reponse=>{
                    console.log(reponse.data)
                    const newData:Contenido[]=[
                        ...data,
                        {
                            id:reponse.data.id,
                            cantidad:reponse.data.cantidad,
                            status:reponse.data.status
                        }
                    ]
                    setData(newData)
                }).catch(error=>{
                console.log(error)
            })
        }else {
            axios.put<Contenido>(`${baseUrl}/update/${data[indexToEdit].id}`,new EditContenido(data[indexToEdit].id,cantidad,1))
                .then(reponse=>{
                    const updatedData=data.map(item=>{
                        if(item.id===data[indexToEdit].id){
                            return {...item,cantidad:cantidad}
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
        setCantidad(0)
        setShowModal(false)
    }
    const editElement=(index:number)=>{
        setEdit(true)
        setButtonSubmitText('Edit')
        setCantidad(data[index].cantidad)
        setIndexToEdit(index)
        handleShowModal()
    }
    const deleteElement=(id:number,cant:number)=>{
        axios.put<Contenido>(`${baseUrl}/delete/${id}`,new EditContenido(id,cant,0))
            .then(response=>{
                setData(data.filter(obj=>obj.id!==id))
            }).catch(error=>{
            console.log(error)
        })
    }
    return(
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Agregar Contenido
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.cantidad}<br/></p>
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id,item.cantidad)}>Delete
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
                            <ModalHeader style={{backgroundColor: "#347094"}}>Contenido</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Cantidad:<br/>
                                    <input type={"number"} value={cantidad} onChange={handleCantidadChange} required
                                           style={{width: "18rem"}}/>
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