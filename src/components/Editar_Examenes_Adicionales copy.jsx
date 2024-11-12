import React from "react";
import Header from "../template/Header_Editar_Examenes_Adicionales";
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
    formValues: {
      codigo_unico_examen: "",
      codigo_unico_examen_pat: "",
      numero_interno: "",
      numero_de_examen: "",
      pcn_numero_hc: "",
      procedimiento: "",
    },
    opcionesTipoTinciones: [],
    opcionesTipoInmu: [],
    filas: [],
    error: false,
    errorMsg: "",
  };

  componentDidMount() {
    this.cargarDatos();
    this.cargarOpcionesTipoTinciones();
    this.cargarOpcionesTipoInmu();
  }

  handleDateChange = (date, index) => {
    this.setState((prevState) => {
      const filas = [...prevState.filas];
      filas[index].fecha_soli_tinciones_especiales = date;
      return { filas };
    });
  };

  handleDelete = (index) => {
    this.eliminarFila(index);
    this.eliminar(index);
  };

  manejadorChangeEditar = (e, index) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      const filas = [...prevState.filas];
      filas[index][name] = value;
      return { filas };
    });
  };

  agregarFila = () => {
    this.setState((prevState) => ({
      filas: [
        ...prevState.filas,
        {
          secuencial: prevState.filas.length,
          fecha_soli_tinciones_especiales: new Date(),
          tipo_tinciones_especiales: '',
          tipo_inmunohistoquimicas: '',
        }
      ]
    }));
  };

  eliminarFila = (index) => {
    this.setState((prevState) => ({
      filas: prevState.filas
        .filter((_, i) => i !== index)
        .map((fila, i) => ({
          ...fila,
          secuencial: i
        }))
    }));
  };

  eliminar = (index) => {
    const { registros } = this.state.formValues;
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${ApiUrl}det_ampli_examen?codigo_unico_examen=eq.${codigo_unico}`;

    axios
      .delete(url, { headers })
      .then(() => {
        toast.success("Registro eliminado");
        this.cargarDatos();
        this.setState((prevState) => ({
          formValues: {
            ...prevState.formValues,
            registros: prevState.formValues.registros.filter((_, i) => i !== index)
          }
        }));
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        toast.error("Error al eliminar el registro");
      });
  };

  actualizar_registros = () => {
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const url = `${ApiUrl}det_ampli_examen`;
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    const headers = { Authorization: `Bearer ${token}` };
    const data = this.state.filas.map(fila => ({
      codigo_unico_examen: codigo_unico,
      fecha_creacion: fila.fecha_creacion || new Date(),
      usuario: usuario,
      secuencial: fila.secuencial,
      fecha_soli_tinciones_especiales: fila.fecha_soli_tinciones_especiales,
      tipo_tinciones_especiales: fila.tipo_tinciones_especiales,
      tipo_inmunohistoquimicas: fila.tipo_inmunohistoquimicas,
    }));

    axios
      .get(ApiUrl + "det_ampli_examen?codigo_unico_examen=eq." + codigo_unico+"?secuencial=eq." + data.secuencial)
      .then((response) => {
        const isUpdate = response.data.length > 0;
        if (isUpdate) {
          axios
            .patch(url, data, { headers })
            .then(() => {
              toast.success("Registros Actualizados");
            })
            .catch((error) => {
              console.error("Error al actualizar el registro:", error);
              this.setState({
                error: true,
                errorMsg: "Error al actualizar el registro",
              });
            });
        } else {
          axios
            .post(url, data, { headers })
            .then(() => {
              toast.success("Registro Creado");
            })
            .catch((error) => {
              console.error("Error al crear el registro:", error);
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
    this.actualizar_registros();
  };

  cargarDatos = () => {
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const urlPatologia = `${ApiUrl}det_ampli_examen?codigo_unico_examen=eq.${codigo_unico}`;
    const urlPacientes = `${ApiUrl}hc_patologia?codigo_unico_examen=eq.${codigo_unico}`;

    axios
      .all([axios.get(urlPatologia), axios.get(urlPacientes)])
      .then(
        axios.spread((patologiaResponse, pacientesResponse) => {
          const patologiaData = patologiaResponse.data || [];
          const pacientesData = pacientesResponse.data[0] || {};
          
          const formValues = {
            codigo_unico_examen: pacientesData.codigo_unico_examen || "",
            codigo_unico_examen_pat: patologiaData.codigo_unico_examen || "",
            numero_interno: pacientesData.numero_interno || "",
            numero_de_examen: pacientesData.numero_de_examen || "",
            pcn_numero_hc: pacientesData.pcn_numero_hc || "",
            procedimiento: pacientesData.procedimiento || "",
            registros: patologiaData.registros || [],
          };

          this.setState({
            formValues,
            filas: patologiaData,
          });
        })
      )
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
  };

  cargarOpcionesTipoTinciones = () => {
    const urlTipoTinciones = `${ApiUrl}catalogo_tipo_tinciones`;

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
    const urlTipoInmu = `${ApiUrl}catalogo_inmunohistoquimicas`;

    axios
      .get(urlTipoInmu)
      .then((response) => {
        const opcionesTipoInmu = response.data.map((tipoInmu) => ({
          id: tipoInmu.codigo_tipo,
          nombre: tipoInmu.tipo_marcador,
        }));

        this.setState({
          opcionesTipoInmu,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tipo de marcadores inmunohistoquímicas:", error);
        this.setState({
          error: true,
          errorMsg: "Error al cargar opciones de tipo de marcadores inmunohistoquímicas",
        });
      });
  };

  render() {
    const { formValues, opcionesTipoTinciones, opcionesTipoInmu, filas } = this.state;

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
                        value={formValues.numero_interno}
                      />
                    </td>
                    <th>Número de Exámen</th>
                    <td>
                      <input
                        className="form-control"
                        name="numero_de_examen"
                        type="text"
                        readOnly
                        value={formValues.numero_de_examen}
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
                        value={formValues.pcn_numero_hc}
                      />
                    </td>
                    <th>Procedimiento</th>
                    <td>
                      <input
                        className="form-control"
                        name="procedimiento"
                        type="text"
                        readOnly
                        value={formValues.procedimiento}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Fecha Solicitud Tinciones Especiales</th>
                    <th>Tipo de Tinciones Especiales</th>
                    <th>Tipo de Marcadores Inmunohistoquímicas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila, index) => (
                    <tr key={index}>
                      <td>
                        <DatePicker
                          selected={fila.fecha_soli_tinciones_especiales}
                          onChange={date => this.handleDateChange(date, index)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="tipo_tinciones_especiales"
                          value={fila.tipo_tinciones_especiales}
                          onChange={e => this.manejadorChangeEditar(e, index)}
                        >
                          <option value="">Seleccionar</option>
                          {opcionesTipoTinciones.map((opcion) => (
                            <option key={opcion.id} value={opcion.nombre}>
                              {opcion.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="tipo_inmunohistoquimicas"
                          value={fila.tipo_inmunohistoquimicas}
                          onChange={e => this.manejadorChangeEditar(e, index)}
                        >
                          <option value="">Seleccionar</option>
                          {opcionesTipoInmu.map((opcion) => (
                            <option key={opcion.id} value={opcion.nombre}>
                              {opcion.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{
                            marginRight: "10px",
                            fontSize: "11pt",
                          }}
                          onClick={() => this.handleDelete(index)}
                        >
                          Eliminar
                        </button>
                        <td></td>
                        <div className="col-md-12 text-right">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              marginRight: "10px",
                              fontSize: "11pt",
                              backgroundColor: "#0A548B",
                              borderBottom: "1px solid #0A548B",
                            }}
                          >
                            {index ? "Guardar" : "Actualizar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-success"
                onClick={this.agregarFila}
              >
                Agregar Exámen
              </button>
            </div>

            <br />
            <div className="row">
              <div className="col-md-12">
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
          <Toaster position="top-right" />
        </div>
      </React.Fragment>
    );
  }
}

export default Editar;
