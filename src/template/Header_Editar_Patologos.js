import React from "react";

class Header extends React.Component {
    render() {
        const headerStyle = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px", // Ajusta la altura según sea necesario
            backgroundColor: "#0A548B", // Color de fondo oscuro, similar a bg-dark
            borderBottom: "1px solid #0A548B", // Borde inferior similar a border-bottom
            color: "#fff", // Color de texto blanco
            fontSize: "1.5rem" // Tamaño de fuente
        };

        return (
            <nav style={headerStyle}>
                <span>Editar Historias Clínicas de Patología - Patólogos</span>
            </nav>
        );
    }
}

export default Header;

