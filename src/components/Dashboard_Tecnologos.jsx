import React from "react";
import Header from "../template/Header_Tecnologos";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from "react-hot-toast";
import { Tooltip } from 'react-tooltip';
import logo from "../assetss/img/logo.png";

class Dashboard_Tecnologos extends React.Component {
  state = {
    pacientes: [],
    hcPatologiaData: [],
    secretarias: [],
    currentPage: 1,
    postsPerPage: 20,
    searchQuery: "",
    searchNumeroExamen: "",
    searchNumeroHC: "",
    searchNumeroInt: "",
    opcionesTecnologo: [],
    tecnologo_asignado: {},
    usuario_tecnologo: ""
  };

  componentDidMount() {
    this.cargarDatos();
    this.cargarOpcionesTecnologo();
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

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (localStorage.getItem("authenticated") === "true") {
        this.cargarDatos();
        this.cargarOpcionesTecnologo();
      }
    }
  }

  cargarOpcionesTecnologo = () => {
    const urlTecnologos = `${ApiUrl}homologacion_patologos?tipo_cargo=eq.TECNOLOGO`;
    axios.get(urlTecnologos)
      .then(response => {
        const opcionesTecnologo = response.data.map(tecnologo => ({
          id: tecnologo.abreviatura_patologo,
          nombre: tecnologo.nombre_patologo,
          usuario_tecnologo: tecnologo.usuario
        }));
        this.setState({ opcionesTecnologo });
      })
      .catch(error => {
        console.error("Error al cargar opciones de tecnólogos:", error);
      });
  };

  manejadorChangeEditarTecnologo = (codigoUnicoExamen, e) => {
    const selectedTecnologo = e.target.value;
    
    const tecnologo = this.state.opcionesTecnologo.find(t => t.nombre === selectedTecnologo);
    
    if (tecnologo) {
      this.setState(prevState => ({
        tecnologo_asignado: {
          ...prevState.tecnologo_asignado,
          [codigoUnicoExamen]: tecnologo.nombre
        },
        usuario_tecnologo: {
          ...prevState.usuario_tecnologo,
          [codigoUnicoExamen]: tecnologo.usuario_tecnologo
        }
      }));
    }
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    const urlHcPatologia = `${ApiUrl}hc_patologia`;
    const urlTecnologos = `${ApiUrl}tecnologos`;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
  
    axios.get(urlTecnologos)
      .then(response => {
        const existingTecnologos = response.data.reduce((acc, item) => {
          acc[item.codigo_unico_examen] = item;
          return acc;
        }, {});
  
        const updates = Object.keys(this.state.tecnologo_asignado).map(codigo_unico => {
          const dataToUpdateHcPatologia = {
            tecnologo_asignado: this.state.tecnologo_asignado[codigo_unico],
            usuario_tecnologo: this.state.usuario_tecnologo[codigo_unico]
          };
  
          const dataToInsertTecnologos = {
            codigo_unico_examen: codigo_unico,
            fecha_creacion: new Date(),
            usuario: this.state.usuario_tecnologo[codigo_unico],
          };
  
          const dataToUpdateTecnologos = {
            fecha_modificacion: new Date(),
            usuario: this.state.usuario_tecnologo[codigo_unico],
          };
  
          const updateHcPatologia = axios.patch(`${urlHcPatologia}?codigo_unico_examen=eq.${codigo_unico}`, dataToUpdateHcPatologia, { headers });
  
          let updateTecnologos;
          if (existingTecnologos[codigo_unico]) {
            updateTecnologos = axios.patch(`${urlTecnologos}?codigo_unico_examen=eq.${codigo_unico}`, dataToUpdateTecnologos, { headers });
          } else {
            updateTecnologos = axios.post(urlTecnologos, dataToInsertTecnologos, { headers });
          }
  
          return axios.all([updateHcPatologia, updateTecnologos])
            .then(() => {
              this.setState(prevState => ({
                hcPatologiaData: prevState.hcPatologiaData.map(paciente =>
                  paciente.codigo_unico_examen === codigo_unico
                    ? { ...paciente, tecnologo_asignado: this.state.tecnologo_asignado[codigo_unico] }
                    : paciente
                )
              }));
            });
        });
  
        axios.all(updates)
          .then(() => {
            toast.success("Registros de HC Patología y Tecnólogos Actualizados");
          })
          .catch((error) => {
            console.error("Error al actualizar los registros:", error);
            this.setState({
              error: true,
              errorMsg: "Error al actualizar los registros",
            });
          });
      })
      .catch(error => {
        console.error('Error fetching existing technologos:', error);
      });
  };  
  
  cargarDatos = () => {
    const urlPacientes = `${ApiUrl}tecnologos?order=fecha_creacion.desc`;
    const urlHcPatologia = `${ApiUrl}hc_patologia?order=codigo_unico_examen.asc`;
    const urlTecnologos = `${ApiUrl}tecnologos?order=codigo_unico_examen.asc`;
    
    axios.all([
      axios.get(urlPacientes),
      axios.get(urlHcPatologia),
      axios.get(urlTecnologos)
    ])
    .then(axios.spread((pacientesResponse, hcPatologiaResponse, tecnologosResponse) => {
      this.setState({
        pacientes: pacientesResponse.data,
        hcPatologiaData: hcPatologiaResponse.data,
        tecnologos: tecnologosResponse.data
      });
    }))
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  clickPaciente = (id) => {
    this.props.history.push(`/editar_tecnologos/${id}`);
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  filterPacientes = () => {
    const { searchQuery, searchNumeroExamen, searchNumeroHC, searchNumeroInt, hcPatologiaData } = this.state;
    
    return hcPatologiaData.filter(paciente => {
      const matchNombre = paciente.paciente.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNumeroExamen = paciente.numero_de_examen && paciente.numero_de_examen.toString().includes(searchNumeroExamen);
      const matchNumeroHC = paciente.pcn_numero_hc && paciente.pcn_numero_hc.toString().includes(searchNumeroHC);
      const matchNumeroInt = paciente.numero_interno && paciente.numero_interno.toString().includes(searchNumeroInt);

      return matchNombre && matchNumeroExamen && matchNumeroHC && matchNumeroInt;
    });
  }

  changePage = (pageNumber) => {
    this.setState({
      currentPage: pageNumber,
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
    const { currentPage, postsPerPage, searchQuery, searchNumeroExamen, searchNumeroHC, searchNumeroInt, opcionesTecnologo, tecnologos } = this.state;

    const filteredPacientes = this.filterPacientes();
    const totalPages = Math.ceil(filteredPacientes.length / postsPerPage);

    const maxPagesToShow = 15;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pageNumbers = [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);

    return (
      <React.Fragment>
        <Header />
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
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="searchQuery" style={{ fontSize: '8pt' }}><strong>FILTROS DE BÚSQUEDA</strong></label>
            <br />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-2">
            <label htmlFor="searchQuery" style={{ fontSize: '8pt' }}><strong>Nombre Paciente</strong></label>
            <input
              type="text"
              className="form-control"
              id="searchQuery"
              placeholder="Ingrese el nombre"
              name="searchQuery"
              value={searchQuery}
              onChange={this.handleInputChange}
              style={{ fontSize: "8pt" }}
            />
          </div>
          
          <div className="col-md-2">
            <label htmlFor="searchNumeroInt" style={{ fontSize: '8pt' }}><strong>Número Interno</strong></label>
            <input
              type="text"
              className="form-control"
              id="searchNumeroInt"
              placeholder="Ingrese el número interno"
              name="searchNumeroInt"
              value={searchNumeroInt}
              onChange={this.handleInputChange}
              style={{ fontSize: "8pt" }}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="searchNumeroExamen" style={{ fontSize: '8pt' }}><strong>Número de Exámen</strong></label>
            <input
              type="text"
              className="form-control"
              id="searchNumeroExamen"
              placeholder="Ingrese el número de exámen"
              name="searchNumeroExamen"
              value={searchNumeroExamen}
              onChange={this.handleInputChange}
              style={{ fontSize: "8pt" }}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="searchNumeroHC" style={{ fontSize: '8pt' }}><strong>Número de HC</strong></label>
            <input
              type="text"
              className="form-control"
              id="searchNumeroHC"
              placeholder="Ingrese el número de HC"
              name="searchNumeroHC"
              value={searchNumeroHC}
              onChange={this.handleInputChange}
              style={{ fontSize: "8pt" }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover" style={{ fontSize: "8pt" }}>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Num. Interno</th>
                  <th scope="col">Num. Exámen</th>
                  <th scope="col">Num. HC</th>
                  <th scope="col" style={{ minWidth: "200px", maxWidth: "500px" }}>Diagnóstico Patología</th>
                  <th scope="col">Paciente</th>
                  <th scope="col">Tecnólogo Asignado</th>
                  <th scope="col">Cambiar Tecnólogo</th>
                  <th scope="col">Fecha Recepción Muestra</th>
                  <th scope="col">Tec. Macroscopia</th>
                  <th scope="col">Tec. Técnicas Histológicas</th>
                  <th scope="col">Tec. Entrega Laminillas</th>
                  <th scope="col">Tec. Niveles</th>
                  <th scope="col">Tec. Entrega Tinciones Especiales</th>
                  <th scope="col">Tec. Entrega IHQ</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map(paciente => {
                  const tecnologosData = tecnologos.find(p => p.codigo_unico_examen === paciente.codigo_unico_examen) || {};
                  return (
                    <tr key={paciente.codigo_unico_examen}>
                      <td>{paciente.numero_interno}</td>
                      <td>{paciente.numero_de_examen}</td>
                      <td>{paciente.pcn_numero_hc}</td>
                      <td>{paciente.diagnostico_patologia}</td>
                      <td>{paciente.paciente}</td>
                      <td>{paciente.tecnologo_asignado}</td>
                      <td>
                        <select
                          className="form-control form-control-sm"
                          value={this.state.tecnologo_asignado[paciente.codigo_unico_examen] || ""}
                          onChange={e => this.manejadorChangeEditarTecnologo(paciente.codigo_unico_examen, e)}
                          style={{ fontSize: '8pt' }}
                        >
                          <option>Seleccionar Tecnólogo</option>
                          {opcionesTecnologo.map(tecnologo => (
                            <option key={tecnologo.id} value={tecnologo.nombre}>
                              {tecnologo.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{paciente.fecha_recepcion_muestra}</td>
                      <td>{tecnologosData.responsable_de_macroscopia}</td>
                      <td>{tecnologosData.tecnologo_responsable_de_tecnicas_histologicas}</td>
                      <td>{tecnologosData.tecnologo_responsable_de_entrega_de_laminillas}</td>
                      <td>{tecnologosData.tecnologo_responsable_de_niveles}</td>
                      <td>{tecnologosData.tecnologo_responsable_de_entrega_de_tinciones_especiales}</td>
                      <td>{tecnologosData.tecnologo_responsable_de_entrega_ihq}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          data-tooltip-id="editar-examen-tooltip" 
                          style={{ backgroundColor: '#0A548B', borderBottom: "1px solid #0A548B" }}
                          onClick={() => this.clickPaciente(paciente.codigo_unico_examen)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>{"   "}
                              <Tooltip id="editar-examen-tooltip" place="top" type="dark" effect="solid">
                                    Editar Exámen Principal
                              </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-12">
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" style={{ fontSize: "8pt" }} onClick={() => this.changePage(currentPage - 1)}>Anterior</button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                    <button className="page-link" style={{ fontSize: "8pt" }} onClick={() => this.changePage(number)}>{number}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" style={{ fontSize: "8pt" }} onClick={() => this.changePage(currentPage + 1)}>Siguiente</button>
                </li>
              </ul>
            </nav>
            <div
              className="text-center"
              style={{ marginTop: "10px", fontSize: "8pt" }}
            >
              Página {currentPage} de {totalPages}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.handleSubmit}
              style={{ marginRight: "10px", fontSize: "11pt", backgroundColor: "#0A548B", borderBottom: "1px solid #0A548B" }}
            >
              Guardar
            </button>
            <a
              className="btn btn-danger"
              href="/"
              style={{ fontSize: "11pt" }}
            >
              Log Out
            </a>
          </div>
        </div>
        <Toaster />
      </React.Fragment>
    );
  }
}

export default Dashboard_Tecnologos;