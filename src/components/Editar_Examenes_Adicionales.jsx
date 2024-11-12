import React from "react";
import Header from "../template/Header_Editar_Examenes_Adicionales";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster, toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../assetss/img/logo.png";
import { parseISO } from "date-fns";
import { format } from 'date-fns';

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
    existingRecords: [], // Para almacenar los registros existentes
    error: false,
    errorMsg: "",
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

  handleDateChange = (date, index) => {
    this.setState((prevState) => {
      const filas = [...prevState.filas];
      filas[index].fecha_soli_tinciones_especiales = date;
      return { filas };
    });
  };

  handleDelete = (index) => {
    this.eliminarFila(index);
  };

  manejadorChangeTipoTinciones = (e, index) => {
    const selectedId = e.target.value;
    const selectedIdAsNumber = Number(selectedId);
    const selectedOption = this.state.opcionesTipoTinciones.find(option => option.id === selectedIdAsNumber);

    this.setState((prevState) => {
      const filas = [...prevState.filas];
      filas[index].tipo_tinciones_especiales = selectedOption ? selectedOption.nombre : '';
      filas[index].cod_tipo_tinciones_especiales = selectedId;
      return { filas };
    });
  };

  manejadorChangeTipoInmu = (e, index) => {
    const selectedId = e.target.value; 
    const selectedIdAsNumber = Number(selectedId);
    const selectedOption = this.state.opcionesTipoInmu.find(option => option.id === selectedIdAsNumber);

    this.setState((prevState) => {
      const filas = [...prevState.filas];
      filas[index].tipo_inmunohistoquimicas = selectedOption ? selectedOption.nombre : '';
      filas[index].cod_tipo_inmunohistoquimicas = selectedId;
      return { filas };
    });
  };
  
  agregarFila = () => {
    const fechaActual = format(new Date(), 'yyyy-MM-dd');

    this.setState((prevState) => ({
      filas: [
        ...prevState.filas,
        {
          secuencial: prevState.filas.length + 1, // Ajustar secuencial
          fecha_soli_tinciones_especiales: fechaActual,
          tipo_tinciones_especiales: '',
          cod_tipo_tinciones_especiales: '',
          tipo_inmunohistoquimicas: '',
          cod_tipo_inmunohistoquimicas: '',
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
          secuencial: i + 1 // Ajustar secuencial después de eliminar
        }))
    }));
  };

  eliminar = (secuencial) => {
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${ApiUrl}det_ampli_examen?codigo_unico_examen=eq.${codigo_unico}&secuencial=eq.${secuencial}`;

    axios
      .delete(url, { headers })
      .then(() => {
        toast.success("Registro eliminado");
        this.cargarDatos();
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        toast.error("Error al eliminar el registro");
      });
  };

  actualizar_registros = () => {
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    const headers = { Authorization: `Bearer ${token}` };

    // Filtrar registros existentes para comparar
    const registrosAActualizar = this.state.filas.filter(fila =>
      this.state.existingRecords.some(record => record.secuencial === fila.secuencial)
    );

    const registrosANuevos = this.state.filas.filter(fila =>
      !this.state.existingRecords.some(record => record.secuencial === fila.secuencial)
    );

    const registrosAEliminar = this.state.existingRecords.filter(record =>
      !this.state.filas.some(fila => fila.secuencial === record.secuencial)
    );

    // Actualizar registros existentes
    const updatePromises = registrosAActualizar.map(fila => {
      const dataToUpdate = {
        fecha_modificacion: new Date(),
        usuario,
        fecha_soli_tinciones_especiales: fila.fecha_soli_tinciones_especiales,
        tipo_tinciones_especiales: fila.tipo_tinciones_especiales,
        cod_tipo_tinciones_especiales: fila.cod_tipo_tinciones_especiales,
        tipo_inmunohistoquimicas: fila.tipo_inmunohistoquimicas,
        cod_tipo_inmunohistoquimicas: fila.cod_tipo_inmunohistoquimicas
      };

      const url = `${ApiUrl}det_ampli_examen?codigo_unico_examen=eq.${codigo_unico}&secuencial=eq.${fila.secuencial}`;
      return axios.patch(url, dataToUpdate, { headers })
        .then(() => toast.success("Registro actualizado"))
        .catch((error) => {
          console.error("Error al actualizar el registro:", error);
          toast.error("Error al actualizar el registro");
        });
    });

    // Insertar registros nuevos
    const insertPromises = registrosANuevos.map(fila => {
      const dataToInsert = {
        codigo_unico_examen: codigo_unico,
        fecha_creacion: new Date(),
        usuario,
        secuencial: fila.secuencial,
        fecha_soli_tinciones_especiales: fila.fecha_soli_tinciones_especiales,
        tipo_tinciones_especiales: fila.tipo_tinciones_especiales,
        cod_tipo_tinciones_especiales: fila.cod_tipo_tinciones_especiales,
        tipo_inmunohistoquimicas: fila.tipo_inmunohistoquimicas,
        cod_tipo_inmunohistoquimicas: fila.cod_tipo_inmunohistoquimicas
      };

      const url = `${ApiUrl}det_ampli_examen`;
      return axios.post(url, dataToInsert, { headers })
        .then(() => toast.success("Registro creado"))
        .catch((error) => {
          console.error("Error al crear el registro:", error);
          toast.error("Error al crear el registro");
        });
    });

    // Eliminar registros
    const deletePromises = registrosAEliminar.map(record => {
      return this.eliminar(record.secuencial);
    });

    Promise.all([...updatePromises, ...insertPromises, ...deletePromises])
      .then(() => this.cargarDatos())
      .catch((error) => {
        console.error("Error al procesar registros:", error);
        this.setState({
          error: true,
          errorMsg: "Error al procesar registros",
        });
      });
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
    this.actualizar_registros();
  };

  cargarDatos = () => {
    const codigo_unico = this.props.match.params.codigo_unico_examen;
    const urlPatologia = `${ApiUrl}det_ampli_examen?order=secuencial.asc&codigo_unico_examen=eq.${codigo_unico}`;
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
            fecha_soli_tinciones_especiales: patologiaData
            ? patologiaData.fecha_soli_tinciones_especiales
              ? parseISO(patologiaData.fecha_soli_tinciones_especiales)
              : null
            : null,
          };

          this.setState({
            formValues,
            filas: patologiaData,
            existingRecords: patologiaData
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
        const opcionesTipoInmu = response.data.map((inmu) => ({
          id: inmu.codigo_tipo,
          nombre: inmu.tipo_marcador,
        }));

        this.setState({
          opcionesTipoInmu: opcionesTipoInmu,
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
    const { formValues, opcionesTipoTinciones, opcionesTipoInmu, filas } = this.state;

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
                        <input
                          className="form-control"
                          name="fecha_soli_tinciones_especiales"
                          type="text"
                          readOnly
                          value={fila.fecha_soli_tinciones_especiales}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="tipo_tinciones_especiales"
                          value={fila.cod_tipo_tinciones_especiales || ''}
                          onChange={e => this.manejadorChangeTipoTinciones(e, index)}
                        >
                          <option value="">Seleccionar</option>
                          {opcionesTipoTinciones.map((opcion) => (
                            <option key={opcion.id} value={opcion.id}>
                              {opcion.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="tipo_inmunohistoquimicas"
                          value={fila.cod_tipo_inmunohistoquimicas || ''}
                          onChange={e => this.manejadorChangeTipoInmu(e, index)}
                        >
                          <option value="">Seleccionar</option>
                          {opcionesTipoInmu.map((opcion) => (
                            <option key={opcion.id} value={opcion.id}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  >
                    {formValues.codigo_unico_examen_pat ? "Actualizar" : "Guardar"}
                  </button>
                  <a
                    className="btn btn-danger"
                    href="/dashboard_patologos"
                    style={{ marginRight: "10px", fontSize: "11pt" }}
                  >
                    Regresar
                  </a>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.agregarFila}
                    style={{ marginRight: "10px", fontSize: "11pt" }}
                  >
                    Agregar Exámen
                  </button>
                </div>
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