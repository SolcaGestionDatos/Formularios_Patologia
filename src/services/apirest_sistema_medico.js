  const oracledb = require('oracledb');

  // Configuración de la conexión a Oracle
  const dbConfig = {
    user: 'smsread',
    password: '$m$.dsBCr34d',
    connectString: '192.168.10.15:1521/SOLCA' // Cambia esto según tu configuración de Oracle
  };
  
  // Función para conectar y consultar la base de datos
  async function conectarOracle() {
    let connection;
  
    try {
      // Inicializar el cliente de Oracle si es necesario (opcional)
       oracledb.initOracleClient({ configDir: 'C:\\app\\leandro.vizuete\\product\\11.2.0\\client\\network\\admin' });
  
      // Obtener una conexión de la base de datos
      connection = await oracledb.getConnection(dbConfig);
      console.log('Conectado a Oracle');
  
      // Realizar una consulta (ejemplo)
      const result = await connection.execute(
        `SELECT * FROM SMS.PERSONAL`, // Consulta SQL
        [], // Parámetros de consulta
        { outFormat: oracledb.OUT_FORMAT_OBJECT } // Opcional: Formato de salida
      );
  
      console.log('Consulta realizada:', result.rows);
  
    } catch (error) {
      console.error('Error al conectar a Oracle:', error);
    } finally {
      if (connection) {
        try {
          // Cerrar la conexión
          await connection.close();
          console.log('Conexión cerrada');
        } catch (error) {
          console.error('Error al cerrar la conexión:', error);
        }
      }
    }
  }
  
  // Llamar a la función para conectar a Oracle
  conectarOracle();
  