import React from "react";
import Header from "../template/Header_Patologos";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
//import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logo from '../assetss/img/logo.png';// Ruta de la imagen del logo

class Dashboard extends React.Component{
    state={
        pacientes:[]
    }

    clickPaciente(id){
        this.props.history.push("/editar/"+id);
    }

//    componentDidMount(){
//        let url = ApiUrl + "author";
//        axios.get(url)
//        .then(response =>{
//            this.setState({
//                pacientes: response.data
//            })
//        })
//    }

componentDidMount() {
    this.cargarPacientes();
  }

  componentDidUpdate(prevProps) {
    // Verifica si la ruta ha cambiado
    if (this.props.location.pathname !== prevProps.location.pathname) {
      // Verifica si el usuario está autenticado
      if (localStorage.getItem("authenticated") === "true") {
        // Si el usuario está autenticado, vuelve a cargar los pacientes
        this.cargarPacientes();
      }
    }
  }

  cargarPacientes() {
    let url = ApiUrl + "author?order=id.asc";
    axios.get(url).then((response) => {
      this.setState({
        pacientes: response.data
      });
    });
  }

    render(){
        return(
            <React.Fragment>
                <Header></Header>
                    <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-right mb-3">
                            <img src={logo} alt="Logo" style={{ maxWidth: "150px" }} />
                        </div>
                    </div>
                    <br />
                        <br/><br/>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.pacientes.map((value,index) =>{
                                    return(
                                        <tr key={index} onClick={()=>this.clickPaciente(value.id)}>
                                            <td>{value.id}</td>
                                            <td>{value.firstname}</td>
                                            <td>{value.lastname}</td>
                                            <td>
                                              <button className="btn btn-primary" ><FontAwesomeIcon icon={faEdit}/></button>{"   "}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <br/><br/>
                    <a className="btn btn-danger" style={{marginLeft: "850px" }} href="/">Log Out</a>
            </React.Fragment>
        );
    }
}

export default Dashboard