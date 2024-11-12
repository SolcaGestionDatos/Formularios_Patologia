import React from "react";
import Header from "../template/Header_Editar_Tecnologos";
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
      fecha_de_macroscopia: new Date(),
      numero_placas_congelacion: "",
      responsable_de_macroscopia: "",
      dias_de_fijacion: "",
      dias_de_decalcificacion: "",
      tecnologo_responsable_de_tecnicas_histologicas: "",
      tecnologo_responsable_de_entrega_de_laminillas: "",
      fecha_de_entrega_de_laminillas_al_patologo: new Date(),
      placas_de_hematoxilina: "",
      placas_de_cortes_adicionales: "",
      fecha_de_entrega_de_placas_de_cortes_adicionales: new Date(),
      tecnologo_responsable_de_niveles: "",
      fecha_de_entrega_de_nivel: new Date(),
      numero_de_placas_de_niveles: "",
      tecnologo_responsable_de_entrega_de_tinciones_especiales: "",
      fecha_de_entrega_de_tinciones_especiales: new Date(),
      numero_tinciones_especiales: "",
      tecnologo_responsable_de_entrega_ihq: "",
      fecha_de_entrega_de_ihq: new Date(),
      fecha_entrega_ampliacion_ihq: new Date(),
      numero_ihq: "",
      numero_de_placas_ampliacion_ihq: "",
    },
    opcionesTecnologo: [],
    opcionesTecnologoMacros: [],
    error: false,
    errorMsg: "",
  };

  manejadorChangeEditar = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  manejadorChangeTexto = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) ) {  
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }
    else {
      toast.error("Solo se permiten valores numéricos");
    }
  };
  
  actualizar_registros = () => {
    let codigo_unico = this.props.match.params.codigo_unico_examen;
    let url = ApiUrl + "tecnologos";
    let token = localStorage.getItem("token");
    let usuario = localStorage.getItem("usuario");
    const headers = { Authorization: "Bearer " + token };

    const dataToUpdate = {
      codigo_unico_examen: codigo_unico,
      fecha_modificacion: new Date(),
      usuario: usuario,
      fecha_de_macroscopia: this.state.form.fecha_de_macroscopia,
      numero_placas_congelacion: this.state.form.numero_placas_congelacion,
      responsable_de_macroscopia: this.state.form.responsable_de_macroscopia,
      dias_de_fijacion: this.state.form.dias_de_fijacion,
      dias_de_decalcificacion: this.state.form.dias_de_decalcificacion,
      tecnologo_responsable_de_tecnicas_histologicas: this.state.form.tecnologo_responsable_de_tecnicas_histologicas,
      tecnologo_responsable_de_entrega_de_laminillas: this.state.form.tecnologo_responsable_de_entrega_de_laminillas,
      fecha_de_entrega_de_laminillas_al_patologo: this.state.form.fecha_de_entrega_de_laminillas_al_patologo,
      placas_de_hematoxilina: this.state.form.placas_de_hematoxilina,
      placas_de_cortes_adicionales: this.state.form.placas_de_cortes_adicionales,
      fecha_de_entrega_de_placas_de_cortes_adicionales: this.state.form.fecha_de_entrega_de_placas_de_cortes_adicionales,
      tecnologo_responsable_de_niveles: this.state.form.tecnologo_responsable_de_niveles,
      fecha_de_entrega_de_nivel: this.state.form.fecha_de_entrega_de_nivel,
      numero_de_placas_de_niveles: this.state.form.numero_de_placas_de_niveles,
      tecnologo_responsable_de_entrega_de_tinciones_especiales: this.state.form.tecnologo_responsable_de_entrega_de_tinciones_especiales,
      fecha_de_entrega_de_tinciones_especiales: this.state.form.fecha_de_entrega_de_tinciones_especiales,
      numero_tinciones_especiales: this.state.form.numero_tinciones_especiales,
      tecnologo_responsable_de_entrega_ihq: this.state.form.tecnologo_responsable_de_entrega_ihq,
      fecha_de_entrega_de_ihq: this.state.form.fecha_de_entrega_de_ihq,
      fecha_entrega_ampliacion_ihq: this.state.form.fecha_entrega_ampliacion_ihq,
      numero_ihq: this.state.form.numero_ihq,
      numero_de_placas_ampliacion_ihq: this.state.form.numero_de_placas_ampliacion_ihq,
    };

    const dataToInsert = {
      codigo_unico_examen: codigo_unico,
      fecha_creacion: new Date(),
      usuario: usuario,
      fecha_de_macroscopia: this.state.form.fecha_de_macroscopia,
      numero_placas_congelacion: this.state.form.numero_placas_congelacion,
      responsable_de_macroscopia: this.state.form.responsable_de_macroscopia,
      dias_de_fijacion: this.state.form.dias_de_fijacion,
      dias_de_decalcificacion: this.state.form.dias_de_decalcificacion,
      tecnologo_responsable_de_tecnicas_histologicas: this.state.form.tecnologo_responsable_de_tecnicas_histologicas,
      tecnologo_responsable_de_entrega_de_laminillas: this.state.form.tecnologo_responsable_de_entrega_de_laminillas,
      fecha_de_entrega_de_laminillas_al_patologo: this.state.form.fecha_de_entrega_de_laminillas_al_patologo,
      placas_de_hematoxilina: this.state.form.placas_de_hematoxilina,
      placas_de_cortes_adicionales: this.state.form.placas_de_cortes_adicionales,
      fecha_de_entrega_de_placas_de_cortes_adicionales: this.state.form.fecha_de_entrega_de_placas_de_cortes_adicionales,
      tecnologo_responsable_de_niveles: this.state.form.tecnologo_responsable_de_niveles,
      fecha_de_entrega_de_nivel: this.state.form.fecha_de_entrega_de_nivel,
      numero_de_placas_de_niveles: this.state.form.numero_de_placas_de_niveles,
      tecnologo_responsable_de_entrega_de_tinciones_especiales: this.state.form.tecnologo_responsable_de_entrega_de_tinciones_especiales,
      fecha_de_entrega_de_tinciones_especiales: this.state.form.fecha_de_entrega_de_tinciones_especiales,
      numero_tinciones_especiales: this.state.form.numero_tinciones_especiales,
      tecnologo_responsable_de_entrega_ihq: this.state.form.tecnologo_responsable_de_entrega_ihq,
      fecha_de_entrega_de_ihq: this.state.form.fecha_de_entrega_de_ihq,
      fecha_entrega_ampliacion_ihq: this.state.form.fecha_entrega_ampliacion_ihq,
      numero_ihq: this.state.form.numero_ihq,
      numero_de_placas_ampliacion_ihq: this.state.form.numero_de_placas_ampliacion_ihq,
    };

    // Verificar si existe el registro en la base de datos
    axios
      .get(ApiUrl + "tecnologos?codigo_unico_examen=eq." + codigo_unico)
      .then((response) => {
        const isUpdate = response.data.length > 0;

        if (isUpdate) {
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
    this.cargarOpcionesTecnologo();
    this.cargarOpcionesTecMacroscopia();
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
    let urlTecnologos = ApiUrl + "tecnologos?codigo_unico_examen=eq." + codigo_unico;
    let urlPacientes = ApiUrl + "hc_patologia?codigo_unico_examen=eq." + codigo_unico;

    axios
      .all([axios.get(urlTecnologos), axios.get(urlPacientes)])
      .then(
        axios.spread((tecnologosResponse, pacientesResponse) => {
          const tecnologosData = tecnologosResponse.data[0];
          const pacientesData = pacientesResponse.data[0];
          const formValues = {
            codigo_unico_examen: pacientesData ? pacientesData.codigo_unico_examen : "",
            codigo_unico_examen_pat: tecnologosData ? tecnologosData.codigo_unico_examen : "",
            numero_interno: pacientesData ? pacientesData.numero_interno : "",
            numero_de_examen: pacientesData ? pacientesData.numero_de_examen : "",
            pcn_numero_hc: pacientesData ? pacientesData.pcn_numero_hc : "",
            procedimiento: pacientesData ? pacientesData.procedimiento : "",
            fecha_de_macroscopia: tecnologosData
            ? tecnologosData.fecha_de_macroscopia
              ? parseISO(tecnologosData.fecha_de_macroscopia)
              : null
            : null,
            numero_placas_congelacion: tecnologosData ? tecnologosData.numero_placas_congelacion : "",
            responsable_de_macroscopia: tecnologosData ? tecnologosData.responsable_de_macroscopia : "",
            dias_de_fijacion: tecnologosData ? tecnologosData.dias_de_fijacion : "",
            dias_de_decalcificacion: tecnologosData ? tecnologosData.dias_de_decalcificacion : "",
            tecnologo_responsable_de_tecnicas_histologicas: tecnologosData ? tecnologosData.tecnologo_responsable_de_tecnicas_histologicas : "",
            tecnologo_responsable_de_entrega_de_laminillas: tecnologosData ? tecnologosData.tecnologo_responsable_de_entrega_de_laminillas : "",
            fecha_de_entrega_de_laminillas_al_patologo: tecnologosData
            ? tecnologosData.fecha_de_entrega_de_laminillas_al_patologo
              ? parseISO(tecnologosData.fecha_de_entrega_de_laminillas_al_patologo)
              : null
            : null,
            placas_de_hematoxilina: tecnologosData ? tecnologosData.placas_de_hematoxilina : "",
            placas_de_cortes_adicionales: tecnologosData ? tecnologosData.placas_de_cortes_adicionales : "",
            fecha_de_entrega_de_placas_de_cortes_adicionales: tecnologosData
            ? tecnologosData.fecha_de_entrega_de_placas_de_cortes_adicionales
              ? parseISO(tecnologosData.fecha_de_entrega_de_placas_de_cortes_adicionales)
              : null
            : null,
            tecnologo_responsable_de_niveles: tecnologosData ? tecnologosData.tecnologo_responsable_de_niveles : "",
            fecha_de_entrega_de_nivel: tecnologosData
            ? tecnologosData.fecha_de_entrega_de_nivel
              ? parseISO(tecnologosData.fecha_de_entrega_de_nivel)
              : null
            : null,
            numero_de_placas_de_niveles: tecnologosData ? tecnologosData.numero_de_placas_de_niveles : "",
            tecnologo_responsable_de_entrega_de_tinciones_especiales: tecnologosData ? tecnologosData.tecnologo_responsable_de_entrega_de_tinciones_especiales : "",
            fecha_de_entrega_de_tinciones_especiales: tecnologosData
            ? tecnologosData.fecha_de_entrega_de_tinciones_especiales
              ? parseISO(tecnologosData.fecha_de_entrega_de_tinciones_especiales)
              : null
            : null,
            numero_tinciones_especiales: tecnologosData ? tecnologosData.numero_tinciones_especiales : "",
            tecnologo_responsable_de_entrega_ihq: tecnologosData ? tecnologosData.tecnologo_responsable_de_entrega_ihq : "",
            fecha_de_entrega_de_ihq: tecnologosData
            ? tecnologosData.fecha_de_entrega_de_ihq
              ? parseISO(tecnologosData.fecha_de_entrega_de_ihq)
              : null
            : null,
            fecha_entrega_ampliacion_ihq: tecnologosData
            ? tecnologosData.fecha_entrega_ampliacion_ihq
              ? parseISO(tecnologosData.fecha_entrega_ampliacion_ihq)
              : null
            : null,
            numero_ihq: tecnologosData ? tecnologosData.numero_ihq : "",
            numero_de_placas_ampliacion_ihq: tecnologosData ? tecnologosData.numero_de_placas_ampliacion_ihq : "",
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
        this.setState({
          opcionesTecnologo: opcionesTecnologo,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tecnólogos:", error);
      });
  };

  cargarOpcionesTecMacroscopia = () => {
    let urlTecnologos = ApiUrl + "homologacion_patologos?tipo_cargo=neq.PATOLOGO";

    axios
      .get(urlTecnologos)
      .then((response) => {
        const opcionesTecnologoMacros = response.data.map((tecnologo) => ({
          id: tecnologo.abreviatura_patologo,
          nombre: tecnologo.nombre_patologo,
          usuario_tecnologo: tecnologo.usuario,
        }));
        this.setState({
          opcionesTecnologoMacros: opcionesTecnologoMacros,
        });
      })
      .catch((error) => {
        console.error("Error al cargar opciones de tecnólogoS, residentes y posgradistas:", error);
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
    const { form,opcionesTecnologo,opcionesTecnologoMacros } = this.state;

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
                <strong>Número Placas Congelación</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="numero_placas_congelacion"
                    value={form.numero_placas_congelacion}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número Placas de Hematoxilina</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="placas_de_hematoxilina"
                    value={form.placas_de_hematoxilina}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número Placas de Cortes Adicionales</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="placas_de_cortes_adicionales"
                    value={form.placas_de_cortes_adicionales}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número de IHQ</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="numero_ihq"
                    value={form.numero_ihq}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número de Placas Ampliación IHQ</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="numero_de_placas_ampliacion_ihq"
                    value={form.numero_de_placas_ampliacion_ihq}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número de Placas de Niveles</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="numero_de_placas_de_niveles"
                    value={form.numero_de_placas_de_niveles}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Número de Tinciones Especiales</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="numero_tinciones_especiales"
                    value={form.numero_tinciones_especiales}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Días de Fijación</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="dias_de_fijacion"
                    value={form.dias_de_fijacion}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Días de Decalcificación</strong>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    name="dias_de_decalcificacion"
                    value={form.dias_de_decalcificacion}
                    onChange={this.manejadorChangeTexto}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Macroscopía</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="responsable_de_macroscopia"
                    value={form.responsable_de_macroscopia}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologoMacros.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Técnicas Histológicas</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_responsable_de_tecnicas_histologicas"
                    value={form.tecnologo_responsable_de_tecnicas_histologicas}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Entrega de Laminillas</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_responsable_de_entrega_de_laminillas"
                    value={form.tecnologo_responsable_de_entrega_de_laminillas}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Niveles</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_responsable_de_niveles"
                    value={form.tecnologo_responsable_de_niveles}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Entrega de Tinciones Especiales</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_responsable_de_entrega_de_tinciones_especiales"
                    value={form.tecnologo_responsable_de_entrega_de_tinciones_especiales}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Tecnólogo Responsable de Entrega IHQ</strong>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    name="tecnologo_responsable_de_entrega_ihq"
                    value={form.tecnologo_responsable_de_entrega_ihq}
                    onChange={this.manejadorChangeEditar}
                  >
                    <option value="">Seleccionar Responsable</option>
                    {opcionesTecnologo.map((opcion,index) => (
                      <option key={opcion.id} value={opcion.nombre}>
                        {opcion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <strong>Fecha Macroscopia</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_macroscopia}
                  onChange={(date) =>
                    this.setState({
                      form: {
                        ...form,
                        fecha_de_macroscopia: date,
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
                <strong>Fecha Entrega Laminillas Patólogo</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_entrega_de_laminillas_al_patologo}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_de_entrega_de_laminillas_al_patologo: date },
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ fontSize: "11pt" }}
                />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Placas Cortes Adic.</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_entrega_de_placas_de_cortes_adicionales}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_de_entrega_de_placas_de_cortes_adicionales: date },
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ fontSize: "11pt" }}
                />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Nivel</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_entrega_de_nivel}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_de_entrega_de_nivel: date },
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ fontSize: "11pt" }}
                />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Tinciones Especiales</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_entrega_de_tinciones_especiales}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_de_entrega_de_tinciones_especiales: date },
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ fontSize: "11pt" }}
                />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega IHQ</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_de_entrega_de_ihq}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_de_entrega_de_ihq: date },
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  style={{ fontSize: "11pt" }}
                />
                </div>
              </div>
              <div className="col-md-4">
                <strong>Fecha Entrega Ampliacion IHQ</strong>
                <div className="col-md-10">
                <DatePicker
                  selected={form.fecha_entrega_ampliacion_ihq}
                  onChange={(date) =>
                    this.setState({
                      form: { ...form, fecha_entrega_ampliacion_ihq: date },
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
                  style={{ marginRight: "10px", fontSize: "11pt", backgroundColor: '#0A548B',borderBottom: "1px solid #0A548B" }}
                  onClick={() => this.actualizar_registros()}
                >
                  {form.codigo_unico_examen_pat ? "Actualizar" : "Guardar"}
                </button>
                <a
                  className="btn btn-danger"
                  href="/dashboard_tecnologos"
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
