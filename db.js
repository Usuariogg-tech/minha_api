import pg from 'pg';

const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'minha_api',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
    
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL com sucesso!');
});

export default pool;