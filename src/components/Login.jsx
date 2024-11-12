import React from "react";
import { jwtDecode } from "jwt-decode";
import '../assetss/css/Login.css';
import logo from '../assetss/img/logo.png';
import { ApiUrl } from '../services/apirest';
//import { ApiUrl } from '../services/apirest_sistema_medico';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: "",
                password: ""
            },
            error: false,
            errorMsg: ""
        };
    }

    manejadorSubmit = e => {
        e.preventDefault();
    };

    manejadorChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    };

    manejadorBoton = () => {
        let url = ApiUrl + "rpc/login";
        axios.post(url, this.state.form)
            .then(response => {
                
                if (response.statusText === "OK") {
                    // Guardar en variable local el token
                    localStorage.setItem("token", response.data.token);

                    // Guardar en variable local el email del usuario
                    localStorage.setItem("usuario",this.state.form.email); 
                    
                    // Decodificar el token y obtener la información necesaria
                    const decodedToken = jwtDecode(response.data.token);
                    localStorage.setItem("rol", decodedToken.role);

                    localStorage.setItem("es_visualizacion", "si");
                    localStorage.setItem("modulo_padre", null);

                    // Redirigir según el rol del usuario
                    switch (decodedToken.role) {
                        case "webpatologos":
                            this.props.history.push("/dashboard_patologos");
                            break;
                        case "websecretaria":
                            this.props.history.push("/dashboard_secretarias");
                            break;
                        case "webtecnologos":
                            this.props.history.push("/dashboard_tecnologos");
                            break;
                        default:
                            this.setState({
                                error: true,
                                errorMsg: "Error: el usuario no se encuentra registrado"
                            });
                            break;
                    }
                } else {
                    this.setState({
                        error: true,
                        errorMsg: "Error: usuario o contraseña inválidos"
                    });
                }
            })
            .catch(error => {
                console.error("Error al conectar al API", error);
                console.log(error);
                this.setState({
                    error: true,
                    errorMsg: "Error: usuario o contraseña inválidos"
                });
            });
    };

    render() {
        return (
            <React.Fragment>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                            <br/><br/>
                            <img src={logo} width="300px" alt="User Icon" />
                            <br/><br/>
                        </div>
                        <form onSubmit={this.manejadorSubmit}>
                            <input type="text" className="fadeIn second" name="email" placeholder="Email" onChange={this.manejadorChange} />
                            <input type="password" className="fadeIn third" name="password" placeholder="Contraseña" onChange={this.manejadorChange} />
                            <input type="submit" className="fadeIn fourth" value="Log In" onClick={this.manejadorBoton} />
                        </form>
                        {this.state.error === true &&
                            <div className="alert alert-danger" role="alert">
                                {this.state.errorMsg}
                            </div>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Login;
