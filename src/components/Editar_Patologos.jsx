import React from "react";
import Header from "../template/Header_Editar_Patologos";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster, toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../assetss/img/logo.png";
import { parseISO } from "date-fns";

class Editar extends React.Component {
  state = {
    form: {
      codigo_unico_examen: "",
      codigo_unico_examen_pat: "",
      numero_interno: "",
      numero_de_examen: "",
      pcn_numero_hc: "",
      procedimiento: "",
      complejidad: "", 
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
      fecha_de_solicitud_de_nivel: new Date(),
      tipo_de_tinciones_especiales: [], 
      fecha_de_solicitud_de_tinciones_especiales: new Date(),
      postgradistas_cie_10_negativos: "",
      tipo_inmunohistoquimicas: [],
    },
    opcionesTipoTinciones: [],  
    opcionesTipoInmu: [],
    error: false,
    errorMsg: "",
  };

  opcionesComplejidad = ["BAJA", "MEDIA", "ALTA", "MUY ALTA"];
  opcionesTransoperatorio = ["SI", "NO"];

  manejadorChangeEditar = (e) => {
    const { name, value, options } = e.target;
    const isMultiSelect = e.target.multiple;
    
    if (isMultiSelect) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
  
      this.setState({
        form: {
          ...this.state.form,
          [name]: selectedValues,
        },
      });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }
  };

  actualizar_registros = () => {
    let codigo_unico = this.props.match.params.codigo_unico_examen;
    let url = ApiUrl + "patologos";
    let token = localStorage.getItem("token");
    let usuario = localStorage.getItem("usuario");
    const headers = { Authorization: "Bearer " + token };

    const dataToUpdate = {
      codigo_unico_examen: codigo_unico,
      fecha_modificacion: new Date(),
      usuario: usuario,
      complejidad: this.state.form.complejidad,
      estudio_transoperatorio: this.state.form.estudio_transoperatorio,
      fecha_estudio_transoperatorio: this.state.form.fecha_estudio_transoperatorio,
      fecha_de_solicitud_de_nivel: this.state.form.fecha_de_solicitud_de_nivel,
      tipo_de_tinciones_especiales: this.state.form.tipo_de_tinciones_especiales,
      fecha_de_solicitud_de_tinciones_especiales: this.state.form.fecha_de_solicitud_de_tinciones_especiales,
      postgradistas_cie_10_negativos: this.state.form.postgradistas_cie_10_negativos,
      tipo_inmunohistoquimicas: this.state.form.tipo_inmunohistoquimicas,
    };

    const dataToInsert = {
      codigo_unico_examen: codigo_unico,
      fecha_creacion: new Date(),
      usuario: usuario,
      complejidad: this.state.form.complejidad,
      estudio_transoperatorio: this.state.form.estudio_transoperatorio,
      fecha_estudio_transoperatorio: this.state.form.fecha_estudio_transoperatorio,
      fecha_de_solicitud_de_nivel: this.state.form.fecha_de_solicitud_de_nivel,
      tipo_de_tinciones_especiales: this.state.form.tipo_de_tinciones_especiales,
      fecha_de_solicitud_de_tinciones_especiales: this.state.form
        .fecha_de_solicitud_de_tinciones_especiales,
      postgradistas_cie_10_negativos: this.state.form.postgradistas_cie_10_negativos,
      tipo_inmunohistoquimicas: this.state.form.tipo_inmunohistoquimicas,
    };

    // Verificar si existe el registro en la base de datos
    axios
      .get(ApiUrl + "patologos?codigo_unico_examen=eq." + codigo_unico)
      .then((response) => {
        const isUpdate = response.data.length > 0;
        //console.log(response.data.length);

        if (isUpdate) {
          // Es una actualización
          url += "?codigo_unico_examen=eq." + codigo_unico;

          axios
            .patch(url, dataToUpdate, { headers })
            .then((response) => {
              toast.success("Registros Actualizados");
            })
            .catch((error) => {
              if (error.response) {
                console.error("Error de respuesta del servidor:", error.response.data);
              } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
              } else {
                console.error("Error al configurar la solicitud:", error.message);
              }

              this.setState({
                error: true,
                errorMsg: "Error al actualizar el registro",
              });
            });
        } else {
          // Es una inserción (nuevo registro)
          axios
            .post(url, dataToInsert, { headers })
            .then((response) => {
              toast.success("Registro Creado");
            })
            .catch((error) => {
              if (error.response) {
                console.error("Error de respuesta del servidor:", error.response.data);
              } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
              } else {
                console.error("Error al configurar la solicitud:", error.message);
              }

              this.setState({
                error: true,
                errorMsg: "Error al crear el registro",
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar existencia del registro:", error);
        this.setState({
          error: true,
          errorMsg: "Error al verificar existencia del registro",
        });
      });
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
  };

  componentDidMount() {
    this.cargarDatos();
    this.cargarOpcionesTipoTinciones();
    this.cargarOpcionesTipoInmu();
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

  cargarOpcionesTipoTinciones = () => {
    let urlTipoTinciones = ApiUrl + "catalogo_tipo_tinciones";

    axios
      .get(urlTipoTinciones)
      .then((response) => {
        const opcionesTipoTinciones = response.data.map((tinciones) => ({
          id: tinciones.codigo_tincion,
          nombre: tinciones.tipo_tinciones_especiales,
        }));

        this.setState({
          opcionesTipoTinciones: opcionesTipoTinciones,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tipo de tinciones especiales:", error);
        this.setState({
          error: true,
          errorMsg: "Error al cargar opciones de tipo de tinciones especiales",
        });
      });
  };

  cargarOpcionesTipoInmu = () => {
    let urlTipoInmu = ApiUrl + "catalogo_inmunohistoquimicas";

    axios
      .get(urlTipoInmu)
      .then((response) => {
        const opcionesTipoInmu = response.data.map((tipoInmu) => ({
          id: tipoInmu.codigo_tipo,
          nombre: tipoInmu.tipo_marcador,
        }));

        this.setState({
          opcionesTipoInmu: opcionesTipoInmu,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tipo de marcadores inmunohistoquimicas:", error);
        this.setState({
          error: true,
          errorMsg: "Error al cargar opciones de tipo de marcadores inmunohistoquimicas",
        });
      });
  };

  cargarDatos = () => {
    let codigo_unico = this.props.match.params.codigo_unico_examen;
    let urlPatologia = ApiUrl + "patologos?codigo_unico_examen=eq." + codigo_unico;
    let urlPacientes = ApiUrl + "hc_patologia?codigo_unico_examen=eq." + codigo_unico;

    axios
      .all([axios.get(urlPatologia), axios.get(urlPacientes)])
      .then(
        axios.spread((patologiaResponse, pacientesResponse) => {
          const patologiaData = patologiaResponse.data[0];
          const pacientesData = pacientesResponse.data[0];

          const formValues = {
            codigo_unico_examen: pacientesData ? pacientesData.codigo_unico_examen : "",
            codigo_unico_examen_pat: patologiaData ? patologiaData.codigo_unico_examen : "",
            numero_interno: pacientesData ? pacientesData.numero_interno : "",
            numero_de_examen: pacientesData ? pacientesData.numero_de_examen : "",
            pcn_numero_hc: pacientesData ? pacientesData.pcn_numero_hc : "",
            procedimiento: pacientesData ? pacientesData.procedimiento : "",
            complejidad: patologiaData ? patologiaData.complejidad : "",
            estudio_transoperatorio: patologiaData ? patologiaData.estudio_transoperatorio : "",
            fecha_estudio_transoperatorio: patologiaData
            ? patologiaData.fecha_estudio_transoperatorio
              ? parseISO(patologiaData.fecha_estudio_transoperatorio)
              : null
            : null,
            fecha_de_solicitud_de_nivel: patologiaData
              ? patologiaData.fecha_de_solicitud_de_nivel
                ? parseISO(patologiaData.fecha_de_solicitud_de_nivel)
                : null
              : null,
              tipo_de_tinciones_especiales: patologiaData
              ? patologiaData.tipo_de_tinciones_especiales.split(','): [],
            fecha_de_solicitud_de_tinciones_especiales: patologiaData
              ? patologiaData.fecha_de_solicitud_de_tinciones_especiales
                ? parseISO(patologiaData.fecha_de_solicitud_de_tinciones_especiales)
                : null
              : null,
            postgradistas_cie_10_negativos: patologiaData
              ? patologiaData.postgradistas_cie_10_negativos
              : "",
              tipo_inmunohistoquimicas: patologiaData
              ? patologiaData.tipo_inmunohistoquimicas.split(','): [],
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
  }

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

  render() {
    const { form, opcionesTipoTinciones, opcionesTipoInmu } = this.state;

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
            onSubmit={this.manejadorSubmit}
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
                <strong>Fecha Estudio Transoperatorio</strong>
                <div className="col-md-10">
                    <DatePicker
                      selected={form.fecha_estudio_transoperatorio}
                      onChange={(date) =>
                        this.setState({
                          form: {
                            ...form,
                            fecha_estudio_transoperatorio: date,
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
                <strong>Fecha Solicitud Tinciones Especiales</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_de_solicitud_de_tinciones_especiales}
                    onChange={(date) =>
                      this.setState({
                        form: {
                          ...form,
                          fecha_de_solicitud_de_tinciones_especiales: date,
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
                <strong>Fecha Solicitud Nivel</strong>
                <div className="col-md-10">
                  <DatePicker
                    selected={form.fecha_de_solicitud_de_nivel}
                    onChange={(date) =>
                      this.setState({
                        form: { ...form, fecha_de_solicitud_de_nivel: date },
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    style={{ fontSize: "11pt" }}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Complejidad</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="complejidad"
                    value={form.complejidad}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Complejidad</option>
                    {this.opcionesComplejidad.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Estudio Transoperatorio</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="estudio_transoperatorio"
                    value={form.estudio_transoperatorio}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Estudio Transoperatorio</option>
                    {this.opcionesTransoperatorio.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Posgradistas CIE 10 Negativos</strong>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    name="postgradistas_cie_10_negativos"
                    type="text"
                    value={form.postgradistas_cie_10_negativos}
                    onChange={this.manejadorChangeEditar}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tipo de Tinciones Especiales</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tipo_de_tinciones_especiales"
                    multiple
                    value={form.tipo_de_tinciones_especiales}
                    onChange={this.manejadorChangeEditar}
                    size={8}
                    selected={form.tipo_de_tinciones_especiales}
                  >
                    {opcionesTipoTinciones.map((opcion) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tipo de Marcadores Inmunohistoquimicas</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tipo_inmunohistoquimicas"
                    multiple
                    value={form.tipo_inmunohistoquimicas}
                    onChange={this.manejadorChangeEditar}
                    size={8}
                  >
                    {opcionesTipoInmu.map((opcion) => (
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
                  style={{
                    marginRight: "10px",
                    fontSize: "11pt",
                    backgroundColor: "#0A548B",
                    borderBottom: "1px solid #0A548B",
                  }}
                  onClick={() => this.actualizar_registros()}
                >
                  {form.codigo_unico_examen_pat ? "Actualizar" : "Guardar"}
                </button>
                <a
                  className="btn btn-danger"
                  href="/dashboard_patologos"
                  style={{ fontSize: "11pt" }}
                >
                  Regresar
                </a>
              </div>
            </div>
          </form>
        </div>
        <Toaster/>
      </React.Fragment>
    );
  }
}

export default Editar;