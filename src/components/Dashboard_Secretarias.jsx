import React from "react";
import Header from "../template/Header_Secretarias";
import { ApiUrl } from "../services/apirest";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import logo from "../assetss/img/logo.png";
import { Tooltip } from 'react-tooltip';

class Dashboard_Secretarias extends React.Component {
  state = {
    pacientes: [],
    hcPatologiaData: [], 
    currentPage: 1,
    postsPerPage: 20,
    searchQuery: "",
    searchNumeroExamen: "",
    searchNumeroHC: "",
    searchNumeroInt: "",
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

  cargarDatos() {
    // Cargar pacientes y hc_patologia simultáneamente
    let urlPacientes = ApiUrl + "secretarias?order=codigo_unico_examen.asc";
    let urlHcPatologia = ApiUrl + "hc_patologia?order=codigo_unico_examen.asc";
    
    axios.all([
      axios.get(urlPacientes),
      axios.get(urlHcPatologia)
    ]).then(axios.spread((pacientesResponse, hcPatologiaResponse) => {
      this.setState({
        pacientes: pacientesResponse.data,
        hcPatologiaData: hcPatologiaResponse.data
      });
    })).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  clickPaciente(id) {
    this.props.history.push("/editar_secretarias/" + id);
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

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
    const {
      //pacientes,
      currentPage,
      postsPerPage,
      searchQuery,
      searchNumeroExamen,
      searchNumeroHC,
      searchNumeroInt,
    } = this.state;

    // Filtrar pacientes según la búsqueda
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
        <div className="row mb-3 d-flex justify-content-between align-items-center">
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
            <div className="col-md-4">
              <label htmlFor="searchQuery" style={{ fontSize: '8pt' }}>
                <strong>FILTROS DE BÚSQUEDA</strong>
              </label>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-2">
              <label htmlFor="searchQuery" style={{ fontSize: '8pt' }}>
                <strong>Nombre Paciente</strong>
              </label>
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
              <label htmlFor="searchNumeroInt" style={{ fontSize: '8pt' }}>
                <strong>Número Interno</strong>
              </label>
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
              <label htmlFor="searchNumeroExamen" style={{ fontSize: '8pt' }}>
                <strong>Número de Exámen</strong>
              </label>
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
              <label htmlFor="searchNumeroHC" style={{ fontSize: '8pt' }}>
                <strong>Número de HC</strong>
              </label>
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
                    <th scope="col">Patólogo Asignado</th>
                    <th scope="col">Tecnólogo Asignado</th>
                    <th scope="col">Estado Exámen</th>
                    <th scope="col">Fecha Recepción Muestra</th>
                    <th scope="col">Fecha Entrega Área IHQ</th>
                    <th scope="col">1ra Fecha Ampliación</th>
                    <th scope="col">2da Fecha Ampliación</th>
                    <th scope="col">3ra Fecha Ampliación</th>
                    <th scope="col">4ta Fecha Ampliación</th>
                    <th scope="col">5ta Fecha Ampliación</th>
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
                      return (
                        <tr key={index}>
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
                          <td>{value.tecnologo_asignado}</td>
                          <td>{value.estado_examen}</td>
                          <td>{value.fecha_recepcion_muestra}</td> 
                          <td>{value.fecha_ihq}</td> 
                          <td>{value.fecha_ihq_ampliacion1}</td>
                          <td>{value.fecha_ihq_ampliacion2}</td>
                          <td>{value.fecha_ihq_ampliacion3}</td>
                          <td>{value.fecha_ihq_ampliacion4}</td>
                          <td>{value.fecha_ihq_ampliacion5}</td> 
                          <td>
                            <div>
                            <button
                              className="btn btn-primary"
                              style={{ backgroundColor: '#0A548B',borderBottom: "1px solid #0A548B" }}
                              data-tooltip-id="editar-examen-tooltip" 
                              onClick={(e) => {
                                e.stopPropagation();
                                this.clickPaciente(
                                  value.codigo_unico_examen
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>{"   "}
                            <Tooltip id="editar-examen-tooltip" place="top" type="dark" effect="solid">
                                    Editar Exámen Principal
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
     
        <a
          className="btn btn-danger ml-3"
          href="/"
          style={{ fontSize: "10pt", marginTop: "10px" }}
        >
          Log Out
        </a>
        <Toaster />
      </React.Fragment>
    );    
  }
}

export default Dashboard_Secretarias;