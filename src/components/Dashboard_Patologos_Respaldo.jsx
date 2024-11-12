import React from "react";
import Header from "../template/Header_Patologos";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

class Dashboard_Patologos extends React.Component {
  state = {
    pacientes: [],
    hcPatologiaData: [],
    secretarias: [],
    currentPage: 1,
    postsPerPage: 20,
    searchQuery: "",
    searchNumeroExamen: "",
    searchNumeroHC: "",
    searchNumeroInt: ""
  };

  componentDidMount() {
    this.cargarDatos();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (localStorage.getItem("authenticated") === "true") {
        this.cargarDatos();
      }
    }
  }

  cargarDatos() {
    let usuario = localStorage.getItem("usuario");
    let urlPacientes = `${ApiUrl}patologos?order=fecha_creacion.desc&usuario=eq.${usuario}`;
    let urlHcPatologia = `${ApiUrl}hc_patologia?order=codigo_unico_examen.asc&usuario_patologo=eq.${usuario}`;
    let urlSecretarias = `${ApiUrl}secretarias?order=codigo_unico_examen.asc`;

    axios.all([
      axios.get(urlPacientes),
      axios.get(urlHcPatologia),
      axios.get(urlSecretarias)
    ]).then(axios.spread((pacientesResponse, hcPatologiaResponse, secretariasResponse) => {
      this.setState({
        pacientes: pacientesResponse.data,
        hcPatologiaData: hcPatologiaResponse.data,
        secretarias: secretariasResponse.data
      });
    })).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  clickPaciente(id) {
    this.props.history.push("/editar_patologos/" + id);
  }

  clickExamenesAdicionales(id) {
    this.props.history.push("/editar_examenes_adicionales/" + id);
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

  render() {
    const { pacientes, secretarias, currentPage, postsPerPage, searchQuery, searchNumeroExamen, searchNumeroHC, searchNumeroInt } = this.state;

    // Filtrar pacientes según la búsqueda y paginar los resultados
    const filteredPacientes = this.filterPacientes();

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredPacientes.length / postsPerPage);

    // Calcular el rango de páginas a mostrar en el menú
    const maxPagesToShow = 15;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Generar números de página para mostrar en el menú
    const pageNumbers = [...Array(endPage - startPage + 1).keys()].map(
      (i) => startPage + i
    );

    return (
      <React.Fragment>
        <Header />
        <div className="container-fluid mt-4" style={{ fontSize: "8pt" }}>
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="searchQuery"><strong>FILTROS DE BÚSQUEDA</strong></label>
              <br />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-2">
              <label htmlFor="searchQuery"><strong>Nombre Paciente</strong></label>
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
              <label htmlFor="searchNumeroInt"><strong>Número Interno</strong></label>
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
              <label htmlFor="searchNumeroExamen"><strong>Número de Exámen</strong></label>
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
              <label htmlFor="searchNumeroHC"><strong>Número de HC</strong></label>
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
                    <th scope="col">Edad</th>
                    <th scope="col">Resultado</th>
                    <th scope="col">Tipo Exámen</th>
                    <th scope="col">Procedimiento</th>
                    <th scope="col">Patologo Asignado</th>
                    <th scope="col">Estado Exámen</th>
                    <th scope="col">Fecha Creación</th>
                    <th scope="col">Fecha Recepción Muestra</th>
                    <th scope="col">Fecha Entrega Área IHQ</th>
                    <th scope="col">Fecha Entrega Ampliación Área IHQ</th>
                    <th scope="col">Complejidad</th>
                    <th scope="col">Estudio Transoperatorio</th>
                    <th scope="col">Fecha Estudio Transoperatorio</th>
                    <th scope="col">Fecha Solicitud Nivel</th>
                    <th scope="col">Tipo Tinciones Especiales</th>
                    <th scope="col">Fecha Solicitud Tinciones Especiales</th>
                    <th scope="col">Postgradistas CIE 10 Negativos</th>
                    <th scope="col">Tipos Inmunohistoquimicas</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPacientes
                    .slice(
                      (currentPage - 1) * postsPerPage,
                      currentPage * postsPerPage
                    )
                    .map((value, index) => {
                      // Buscar el paciente correspondiente en pacientes[]
                      const paciente = pacientes.find(p => p.codigo_unico_examen === value.codigo_unico_examen);
                      const secretariaData = secretarias.find(p => p.codigo_unico_examen === value.codigo_unico_examen);

                      return (
                        <tr
                          key={index}
                          onClick={() =>
                            this.clickPaciente(value.codigo_unico_examen)
                          }
                        >
                          <td>{value.numero_interno}</td>
                          <td>{value.numero_de_examen}</td>
                          <td>{value.pcn_numero_hc}</td>
                          <td className="fixed-width-column">{value.diagnostico_patologia}</td>
                          <td>{value.paciente}</td>
                          <td>{value.edad}</td>
                          <td>{value.resultado}</td>
                          <td>{value.tipo_examen}</td>
                          <td>{value.procedimiento}</td>
                          <td>{value.patologo_asignado}</td>
                          <td>{value.estado_examen}</td>
                          <td>{value.fecha_creacion}</td>
                          <td>{secretariaData ? secretariaData.fecha_recepcion_muestra : '-'}</td> 
                          <td>{secretariaData ? secretariaData.fecha_entrega_al_area_de_ihq : '-'}</td> 
                          <td>{secretariaData ? secretariaData.fecha_entrega_de_ampliacion_area_de_ihq : '-'}</td> 
                          <td>{paciente ? paciente.complejidad : '-'}</td> 
                          <td>{paciente ? paciente.estudio_transoperatorio : '-'}</td> 
                          <td>{paciente ? paciente.fecha_estudio_transoperatorio : '-'}</td> 
                          <td>{paciente ? paciente.fecha_de_solicitud_de_nivel : '-'}</td> 
                          <td>{paciente ? paciente.tipo_de_tinciones_especiales : '-'}</td> 
                          <td>{paciente ? paciente.fecha_de_solicitud_de_tinciones_especiales : '-'}</td> 
                          <td>{paciente ? paciente.postgradistas_cie_10_negativos : '-'}</td> 
                          <td>{paciente ? paciente.tipo_inmunohistoquimicas : '-'}</td> 
                          <td>
                            <button
                              className="btn btn-primary"
                              style={{ backgroundColor: '#0A548B', borderBottom: "1px solid #0A548B" }}
                              data-tooltip-id="editar-examen-tooltip" 
                              onClick={(e) => {
                                e.stopPropagation();
                                this.clickPaciente(value.codigo_unico_examen);
                              }}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>{"   "}
                              <Tooltip id="editar-examen-tooltip" place="top" type="dark" effect="solid">
                                    Editar Exámen
                              </Tooltip>
                            <td></td>
                            <td></td>
                            <td></td>
                                <div>
                                  <button
                                    className="btn btn-primary"
                                    style={{ backgroundColor: '#0A548B', borderBottom: "1px solid #0A548B" }}
                                    data-tooltip-id="add-examen-tooltip" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.clickExamenesAdicionales(value.codigo_unico_examen); 
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </button>{"   "}
                                  <Tooltip id="add-examen-tooltip" place="top" type="dark" effect="solid">
                                    Agregar Exámen Adicional
                                  </Tooltip>
                                </div>
                              
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => this.changePage(currentPage - 1)}
                  style={{ fontSize: "8pt" }}
                >
                  &lt; Anterior
                </button>
              </li>
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => this.changePage(number)}
                    style={{ fontSize: "8pt" }}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => this.changePage(currentPage + 1)}
                  style={{ fontSize: "8pt" }}
                >
                  Siguiente &gt;
                </button>
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
        <div className="row">
              <div className="col-md-12">
                
                <a className="btn btn-danger" href="/" style={{ fontSize: "11pt" }}>Log Out</a>
              </div>
            </div>
      </React.Fragment>
    );
  }
}

export default Dashboard_Patologos;