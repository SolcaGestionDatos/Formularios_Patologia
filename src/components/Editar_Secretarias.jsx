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
      usuario_patologo: "",
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
      fecha_recepcion_muestra: new Date(),
      fecha_ihq: new Date(),
      fecha_ihq_ampliacion1: new Date(),
      fecha_ihq_ampliacion2: new Date(),
      fecha_ihq_ampliacion3: new Date(),
      fecha_ihq_ampliacion4: new Date(),
      fecha_ihq_ampliacion5: new Date(),
    },
    error: false,
    errorMsg: "",
  };

  componentDidMount() {
    this.cargarDatos();
    this.startSessionTimeout();
    this.addEventListeners();
  }

  componentWillUnmount() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
    this.removeEventListeners();
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
            usuario_patologo: pacientesData ? pacientesData.usuario_patologo : "", 
            usuario_secretaria: secretariasData ? secretariasData.usuario_secretaria : "",
            fecha_recepcion_muestra: pacientesData
              ? pacientesData.fecha_recepcion_muestra
                ? parseISO(pacientesData.fecha_recepcion_muestra)
                : null
              : null,
            fecha_ihq: pacientesData
              ? pacientesData.fecha_ihq
                ? parseISO(pacientesData.fecha_ihq)
                : null
              : null,
            fecha_ihq_ampliacion1: pacientesData
              ? pacientesData.fecha_ihq_ampliacion1
                ? parseISO(pacientesData.fecha_ihq_ampliacion1)
                : null
              : null,
            fecha_ihq_ampliacion2: pacientesData
              ? pacientesData.fecha_ihq_ampliacion2
                ? parseISO(pacientesData.fecha_ihq_ampliacion2)
                : null
              : null,
            fecha_ihq_ampliacion3: pacientesData
              ? pacientesData.fecha_ihq_ampliacion3
                ? parseISO(pacientesData.fecha_ihq_ampliacion3)
                : null
              : null,
            fecha_ihq_ampliacion4: pacientesData
              ? pacientesData.fecha_ihq_ampliacion4
                ? parseISO(pacientesData.fecha_ihq_ampliacion4)
                : null
              : null,
            fecha_ihq_ampliacion5: pacientesData
              ? pacientesData.fecha_ihq_ampliacion5
                ? parseISO(pacientesData.fecha_ihq_ampliacion5)
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

  startSessionTimeout() {
    this.sessionTimeout = setTimeout(() => {
      localStorage.removeItem("authenticated");
      this.props.history.push("/");
    }, 10 * 60 * 1000); 

    this.warningTimeout = setTimeout(() => {
      toast.error("Tu sesión está a punto de expirar. Por favor, guarda tu trabajo");
    }, 9 * 60 * 1000); 
  };

  resetSessionTimeout = () => {
    clearTimeout(this.sessionTimeout);
    clearTimeout(this.warningTimeout);
    this.startSessionTimeout();
  }

  addEventListeners() {
    window.addEventListener('mousemove', this.resetSessionTimeout);
    window.addEventListener('keydown', this.resetSessionTimeout);
  }

  removeEventListeners() {
    window.removeEventListener('mousemove', this.resetSessionTimeout);
    window.removeEventListener('keydown', this.resetSessionTimeout);
  }

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
      fecha_ihq: this.state.form.fecha_ihq,
      fecha_ihq_ampliacion1: this.state.form.fecha_ihq_ampliacion1,
      fecha_ihq_ampliacion2: this.state.form.fecha_ihq_ampliacion2,
      fecha_ihq_ampliacion3: this.state.form.fecha_ihq_ampliacion3,
      fecha_ihq_ampliacion4: this.state.form.fecha_ihq_ampliacion4,
      fecha_ihq_ampliacion5: this.state.form.fecha_ihq_ampliacion5,
    };

    const dataToInsertSecretarias = {
      codigo_unico_examen: codigo_unico,
      fecha_creacion: new Date(),
      usuario: usuario,
      fecha_recepcion_muestra: this.state.form.fecha_recepcion_muestra,
      fecha_ihq: this.state.form.fecha_ihq,
      fecha_ihq_ampliacion1: this.state.form.fecha_ihq_ampliacion1,
      fecha_ihq_ampliacion2: this.state.form.fecha_ihq_ampliacion2,
      fecha_ihq_ampliacion3: this.state.form.fecha_ihq_ampliacion3,
      fecha_ihq_ampliacion4: this.state.form.fecha_ihq_ampliacion4,
      fecha_ihq_ampliacion5: this.state.form.fecha_ihq_ampliacion5,
    };

    const dataToUpdateHcPatologia = {
      usuario_secretaria: usuario,
      fecha_recepcion_muestra: this.state.form.fecha_recepcion_muestra,
      fecha_ihq: this.state.form.fecha_ihq,
      fecha_ihq_ampliacion1: this.state.form.fecha_ihq_ampliacion1,
      fecha_ihq_ampliacion2: this.state.form.fecha_ihq_ampliacion2,
      fecha_ihq_ampliacion3: this.state.form.fecha_ihq_ampliacion3,
      fecha_ihq_ampliacion4: this.state.form.fecha_ihq_ampliacion4,
      fecha_ihq_ampliacion5: this.state.form.fecha_ihq_ampliacion5,
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
              console.log(this.state.form.usuario_patologo)
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
    const { form } = this.state; // Añadido aquí
    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid" style={{ fontSize: "11pt" }}>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "150px", marginBottom: "10px" }}
              />
              <div className="text-right" style={{ marginTop: '10px', fontSize: '10pt' }}>
                <strong>Usuario: </strong> {localStorage.getItem("usuario")}
              </div>
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
                <strong>Patólogo Asignado</strong>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    name="patologo_asignado"
                    type="text"
                    readOnly
                    value={form.patologo_asignado}
                    style={{ padding: '0.75rem 1.25rem', width: '100%' }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Recepción Muestra</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_recepcion_muestra}
                    readOnly
                    dateFormat="dd/MM/yyyy hh:mm:ss"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Área IHQ</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq: date,
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
                <strong>1ra Fecha Ampliación</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq_ampliacion1}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq_ampliacion1: date,
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
                <strong>2da Fecha Ampliación</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq_ampliacion2}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq_ampliacion2: date,
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
                <strong>3ra Fecha Ampliación</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq_ampliacion3}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq_ampliacion3: date,
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
                <strong>4ta Fecha Ampliación</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq_ampliacion4}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq_ampliacion4: date,
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
                <strong>5ta Fecha Ampliación</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_ihq_ampliacion5}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_ihq_ampliacion5: date,
                        },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
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
        </div>
        <Toaster />
      </React.Fragment>
    );
  }
}
export default Editar;