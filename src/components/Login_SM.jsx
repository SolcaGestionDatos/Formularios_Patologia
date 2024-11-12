import React from 'react';
import { useQuery } from 'select * from SMS.PERSONAL';

const App = () => { 
    console.log("oli");

    const { data, isLoading, isError } = useQuery('datosOracle', async () => {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json();
    });

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al obtener datos desde el backend</p>;

    return (
        <div>
            <h1>Datos desde Oracle:</h1>
            <ul>
                {data.map(item => (
                    <li key={item.id}>{item.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
