const { Client } = require('pg');

// Configuración de la conexión
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'PostGresFerremas',
  password: 'Szx90312863',
  port: 5432,
});

const insertarDatos = async () => {
  try {
    await client.connect();
    console.log('Conexión exitosa a PostgreSQL');

    const query = `
      INSERT INTO public."PRODUCTOS" 
      ("ID", "TIPO PRODUCTO", "MODELO", "MARCA", "STOCK", "FECHA UPDATE") 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const valores = [2, 'Electr', 'PodeloX', 'MarcaY', 50, '2023-10-05'];

    const res = await client.query(query, valores);
    console.log('Datos insertados:', res.rowCount);
  } catch (err) {
    console.error('Error en la conexión o consulta:', err);
  } finally {
    await client.end();
  }
};

insertarDatos();