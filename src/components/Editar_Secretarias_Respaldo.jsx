import React, { Component } from "react";
import Header from "../template/Header_Editar_Secretarias";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster, toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../assetss/img/logo.png";
import { parseISO } from "date-fns";
import { ApiUrl } from "../services/apirest";

class Editar extends Component {
  state = {
    form: {
      codigo_unico_examen: "",
      codigo_unico_examen_pat: "",
      numero_interno: "",
      numero_de_examen: "",
      pcn_numero_hc: "",
      procedimiento: "",
      patologo_asignado: "",
      tecnologo_asignado:"",
      usuario_patologia: "",
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
      fecha_recepcion_muestra: new Date(),
      fecha_entrega_al_area_de_ihq: new Date(),
      fecha_entrega_de_ampliacion_area_de_ihq: new Date(),
    },
    opcionesPatologo: [],
    opcionesTecnologo: [],
    error: false,
    errorMsg: "",
  };

  componentDidMount() {
    this.cargarDatos();
    this.cargarOpcionesPatologo();
    this.cargarOpcionesTecnologo();
  }

  cargarDatos = () => {
    let codigo_unico = this.props.match.params.codigo_unico_examen;
    let urlSecretarias = ApiUrl + "secretarias?codigo_unico_examen=eq." + codigo_unico;
    let urlPacientes = ApiUrl + "hc_patologia?codigo_unico_examen=eq." + codigo_unico;

    axios
      .all([axios.get(urlSecretarias), axios.get(urlPacientes)])
      .then(
        axios.spread((secretariasResponse, pacientesResponse) => {
          const secretariasData = secretariasResponse.data[0];
          const pacientesData = pacientesResponse.data[0];

          const formValues = {
            codigo_unico_examen: pacientesData ? pacientesData.codigo_unico_examen : "",
            codigo_unico_examen_pat: secretariasData ? secretariasData.codigo_unico_examen : "",
            numero_interno: pacientesData ? pacientesData.numero_interno : "",
            numero_de_examen: pacientesData ? pacientesData.numero_de_examen : "",
            pcn_numero_hc: pacientesData ? pacientesData.pcn_numero_hc : "",
            procedimiento: pacientesData ? pacientesData.procedimiento : "",
            patologo_asignado: pacientesData ? pacientesData.patologo_asignado : "", 
            tecnologo_asignado: pacientesData ? pacientesData.tecnologo_asignado : "",
            usuario_patologia: pacientesData ? pacientesData.usuario_patologia : "", 
            usuario_tecnologo: pacientesData ? pacientesData.usuario_tecnologo : "",
            usuario_secretaria: secretariasData ? secretariasData.usuario_secretaria : "",
            fecha_recepcion_muestra: secretariasData
              ? secretariasData.fecha_recepcion_muestra
                ? parseISO(secretariasData.fecha_recepcion_muestra)
                : null
              : null,
            fecha_entrega_al_area_de_ihq: secretariasData
              ? secretariasData.fecha_entrega_al_area_de_ihq
                ? parseISO(secretariasData.fecha_entrega_al_area_de_ihq)
                : null
              : null,
            fecha_entrega_de_ampliacion_area_de_ihq: secretariasData
              ? secretariasData.fecha_entrega_de_ampliacion_area_de_ihq
                ? parseISO(secretariasData.fecha_entrega_de_ampliacion_area_de_ihq)
                : null
              : null,
          };

          this.setState({
            form: formValues,
          });
        })
      )
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
  };

  cargarOpcionesPatologo = () => {
    let urlPatologos = ApiUrl + "homologacion_patologos?tipo_cargo=eq.PATOLOGO";

    axios
      .get(urlPatologos)
      .then((response) => {
        const opcionesPatologo = response.data.map((patologo) => ({
          id: patologo.abreviatura_patologo,
          nombre: patologo.nombre_patologo,
          usuario_patologia: patologo.usuario,
        }));

        //console.log("Opciones de patólogos cargadas:", opcionesPatologo);

        this.setState({
          opcionesPatologo: opcionesPatologo,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de patólogos:", error);
      });
  };

  cargarOpcionesTecnologo = () => {
    let urlTecnologos = ApiUrl + "homologacion_patologos?tipo_cargo=eq.TECNOLOGO";

    axios
      .get(urlTecnologos)
      .then((response) => {
        const opcionesTecnologo = response.data.map((tecnologo) => ({
          id: tecnologo.abreviatura_patologo,
          nombre: tecnologo.nombre_patologo,
          usuario_tecnologo: tecnologo.usuario,
        }));

        //console.log("Opciones de patólogos cargadas:", opcionesTecnologo);

        this.setState({
          opcionesTecnologo: opcionesTecnologo,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tecnólogos:", error);
      });
  };

  manejadorChangeEditar = (e) => {
    const { name, value } = e.target;
    const selectedIndex = e.target.selectedIndex-1;
    const usuario_patologia = this.state.opcionesPatologo[selectedIndex]?.usuario_patologia || '';

    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
        usuario_patologia: usuario_patologia
      },
    }));
  };

  manejadorChangeEditarTecnologo = (e) => {
    const { name, value } = e.target;
    const selectedIndex = e.target.selectedIndex-1;
    const usuario_tecnologo = this.state.opcionesTecnologo[selectedIndex]?.usuario_tecnologo || '';

    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
        usuario_tecnologo: usuario_tecnologo
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let codigo_unico = this.props.match.params.codigo_unico_examen;
    let urlSecretarias = ApiUrl + "secretarias";
    let urlHcPatologia = ApiUrl + "hc_patologia";
    let token = localStorage.getItem("token");
    let usuario = localStorage.getItem("usuario"); 

    const headers = { Authorization: "Bearer " + token };

    const dataToUpdateSecretarias = {
      codigo_unico_examen: codigo_unico,
      fecha_modificacion: new Date(),
      usuario: usuario,
      fecha_recepcion_muestra: this.state.form.fecha_recepcion_muestra,
      fecha_entrega_al_area_de_ihq: this.state.form.fecha_entrega_al_area_de_ihq,
      fecha_entrega_de_ampliacion_area_de_ihq: this.state.form.fecha_entrega_de_ampliacion_area_de_ihq,
    };

    const dataToInsertSecretarias = {
      codigo_unico_examen: codigo_unico,
      fecha_creacion: new Date(),
      usuario: usuario,
      fecha_recepcion_muestra: this.state.form.fecha_recepcion_muestra,
      fecha_entrega_al_area_de_ihq: this.state.form.fecha_entrega_al_area_de_ihq,
      fecha_entrega_de_ampliacion_area_de_ihq: this.state.form.fecha_entrega_de_ampliacion_area_de_ihq,
    };

    const dataToUpdateHcPatologia = {
      patologo_asignado: this.state.form.patologo_asignado,
      usuario_patologo: this.state.form.usuario_patologia,
      tecnologo_asignado: this.state.form.tecnologo_asignado,
      usuario_tecnologo: this.state.form.usuario_tecnologo,
      usuario_secretaria: usuario,
      fecha_carga: new Date(),
    };

    // Verificar si existe un registro en secretarias para este código único
    axios
      .get(ApiUrl + "secretarias?codigo_unico_examen=eq." + codigo_unico)
      .then((secretariasResponse) => {
        const isUpdateSecretarias = secretariasResponse.data.length > 0;

        if (isUpdateSecretarias) {
          urlSecretarias += "?codigo_unico_examen=eq." + codigo_unico;
          axios
            .patch(urlSecretarias, dataToUpdateSecretarias, { headers })
            .then(() => {
              toast.success("Registro de Secretarias Actualizado");
            })
            .catch((error) => {
              console.error("Error al actualizar el registro de Secretarias:", error);
              this.setState({
                error: true,
                errorMsg: "Error al actualizar el registro de Secretarias",
              });
            });
        } else {
          axios
            .post(urlSecretarias, dataToInsertSecretarias, { headers })
            .then(() => {
              toast.success("Registro de Secretarias Creado");
            })
            .catch((error) => {
              console.error("Error al crear el registro de Secretarias:", error);
              this.setState({
                error: true,
                errorMsg: "Error al crear el registro de Secretarias",
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar existencia del registro en Secretarias:", error);
        this.setState({
          error: true,
          errorMsg: "Error al verificar existencia del registro en Secretarias",
        });
      });

    // Verificar si existe un registro en hc_patologia para este código único
    axios
      .get(ApiUrl + "hc_patologia?codigo_unico_examen=eq." + codigo_unico)
      .then((hcPatologiaResponse) => {
        const isUpdateHcPatologia = hcPatologiaResponse.data.length > 0;

        if (isUpdateHcPatologia) {
          urlHcPatologia += "?codigo_unico_examen=eq." + codigo_unico;

          axios
            .patch(urlHcPatologia, dataToUpdateHcPatologia, { headers })
            .then(() => {
              toast.success("Registro de HC Patologia Actualizado");
              console.log(this.state.form.usuario_patologia)
            })
            .catch((error) => {
              console.error("Error al actualizar el registro de HC Patologia:", error);
              this.setState({
                error: true,
                errorMsg: "Error al actualizar el registro de HC Patologia",
              });
            });
        } 
      })
      .catch((error) => {
        console.error("Error al verificar existencia del registro en HC Patologia:", error);
        this.setState({
          error: true,
          errorMsg: "Error al verificar existencia del registro en HC Patologia",
        });
      });
  };

  render() {
    const { form, opcionesPatologo,opcionesTecnologo } = this.state;

    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid" style={{ fontSize: "11pt" }}>
          <div className="row">
            <div className="col-md-12 text-right mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "150px", marginBottom: "10px" }}
              />
            </div>
          </div>
          <form
            className="form-horizontal"
            onSubmit={this.handleSubmit}
            style={{ fontSize: "11pt" }}
          >
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Número Interno</th>
                    <td>
                      <input
                        className="form-control"
                        name="numero_interno"
                        type="text"
                        readOnly
                        value={form.numero_interno}
                      />
                    </td>
                    <th>Número de Exámen</th>
                    <td>
                      <input
                        className="form-control"
                        name="numero_de_examen"
                        type="text"
                        readOnly
                        value={form.numero_de_examen}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Número de HC</th>
                    <td>
                      <input
                        className="form-control"
                        name="pcn_numero_hc"
                        type="text"
                        readOnly
                        value={form.pcn_numero_hc}
                      />
                    </td>
                    <th>Procedimiento</th>
                    <td>
                      <input
                        className="form-control"
                        name="procedimiento"
                        type="text"
                        readOnly
                        value={form.procedimiento}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <strong>Fecha Recepción Muestra</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_recepcion_muestra}
                    onChange={(date) =>
                      this.setState({
                        form: { ...form, fecha_recepcion_muestra: date },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Área IHQ</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_entrega_al_area_de_ihq}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_entrega_al_area_de_ihq: date,
                        },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Ampliación Área IHQ</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_entrega_de_ampliacion_area_de_ihq}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_entrega_de_ampliacion_area_de_ihq: date,
                        },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Asignación Patólogo</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="patologo_asignado"
                    value={form.patologo_asignado}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Patólogo</option>
                    {opcionesPatologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Asignación Tecnólogo</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_asignado"
                    value={form.tecnologo_asignado}
                    onChange={this.manejadorChangeEditarTecnologo}
                  >
                    <option value="">Seleccionar Tecnólogo</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

             
            </div>
                    
            <br />
            <br />
            <div className="row">
              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginRight: "10px", fontSize: "11pt", backgroundColor: "#0A548B", borderBottom: "1px solid #0A548B" }}
                >
                  {form.codigo_unico_examen_pat ? "Actualizar" : "Guardar"}
                </button>
                <a
                  className="btn btn-danger"
                  href="/dashboard_secretarias"
                  style={{ fontSize: "11pt" }}
                >
                  Regresar
                </a>
              </div>
            </div>
          </form>
          <Toaster position="top-right" />
        </div>
      </React.Fragment>
    );
  }
}

export default Editar;