import React from "react";
import { ApiUrl } from "../services/apirest";
//librerias
import axios from 'axios';
//template
import Header from '../template/Header_Editar';
import {Toaster, toast} from  'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Editar extends React.Component{

    state = {
        form:{
            "id": "",
            "firstname":new Date(),
            "lastname":"",
        },
        error:false,
        errorMsg:""
    }

    manejadorChangeEditar = async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    actualizar_registros =()=>{
        let pacienteId = this.props.match.params.id;
        let url = ApiUrl + "author?id=eq." + pacienteId;
        let token = localStorage.getItem('token');
        const headers = { 'Authorization': 'Bearer ' + token };
        axios.patch(url,this.state.form, { headers })
        .then(response=>{
            //console.log(response)
            toast.success('Registros Actualizados')
        }).catch(error =>{
            console.log(error);
            this.setState({
                error: true,
                errorMsg: "Error: al actualizar el registro"
            });
    })
    }

    manejadorSubmit = e =>{
        e.preventDefault();
    }

    componentDidMount(){
        let pacienteId = this.props.match.params.id;
        let url = ApiUrl + "author?id=eq." + pacienteId;
        axios.get(url)
        .then(response => {
            this.setState({
                form:{
                    id: response.data[0].id,
                    firstname: new Date(response.data[0].firstname),
                    lastname: response.data[0].lastname
                }
            })
        });
    }

    render(){const form=this.state.form
        return(
            <React.Fragment>
                <Header/>
                <div className="container">
                        <br/>
                        <form className="form-horizontal" onSubmit={this.manejadorSubmit}>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="col-md-2 control-label">Id</label>
                                        <div className="col-md-10">
                                            <input className="form-control" style={{marginRight: "10px" }} name="id" placeholder="ID" type="text" readOnly
                                            value={form.id}
                                            onChange={this.manejadorChangeEditar}
                                            />
                                        </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="col-md-2 control-label">Nombre</label>
                                        <div className="col-md-10">
                                            

                                            <DatePicker
                                               selected={form.firstname}
                                               onChange={date => this.setState({ form: { ...form, firstname: date } })}
                                               dateFormat="dd/MM/yyyy" // Puedes ajustar el formato de fecha según tus necesidades
                                            />
                                        </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="col-md-2 control-label">Apellido</label>
                                        <div className="col-md-10">
                                            <input className="form-control" style={{marginRight: "10px" }} name="lastname" placeholder="Apellido" type="text"
                                            value={form.lastname}
                                            onChange={this.manejadorChangeEditar}
                                            />
                                        </div>
                                </div>
                            </div>

                            <br/><br/>
                                <button type="submit" className="btn btn-primary" style={{marginRight: "10px" }} onClick={()=>this.actualizar_registros()} >Actualizar</button>
                                <a className="btn btn-danger" href="/dashboard">Salir</a>
                        </form>
                        <Toaster
                        position="top-right"
                        />
                    </div>
            </React.Fragment>
        );
    }
}

export default Editar