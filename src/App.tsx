import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Marcas from "./Pages/Marcas";
import Contenidos from "./Pages/Contenidos";
import Cervezas from "./Pages/Cervezas";

function App() {
  return (
    <>
        <div className={"d-flex"}>
            <Router>
                <div className="border-right p-3" id="sidebar">
                    <div>
                        <p>
                            <h3 className="text-light">
                                Menu
                                {/*<img className="float-end" id="imgPerfil"
                                     src="https://cdn.pixabay.com/photo/2023/03/06/13/58/logo-7833521_1280.png" alt={"menu"}/>*/}
                            </h3>
                        </p>
                    </div>
                    <hr/>
                    <div className="list-group list-reset">
                        <Link to="/"><button className="btn btn-primary text-dark button mb-4"><span>Cerveza</span></button></Link>
                        <Link to="/marcas"><button className="btn btn-primary text-dark button mb-4"><span>Marcas</span></button></Link>
                        <Link to="/contenidos"><button className="btn btn-primary text-dark button mb-4"><span>Contenidos</span></button></Link>
                    </div>
                </div>
                <Routes>
                    <Route path='/' element={<Cervezas/>}/>
                    <Route path='/marcas' element={<Marcas/>}/>
                    <Route path='/contenidos' element={<Contenidos/>}/>
                    <Route path="*" element={<Cervezas/>}/>
                </Routes>
            </Router>
        </div>
    </>
  );
}

export default App;
