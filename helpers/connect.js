const { MongoClient } = require('mongodb');

module.exports = class Connect {
    constructor() {
        this.url = process.env.MONGO_URI; // URL de conexión
        this.dbName = process.env.MONGO_DB; // Nombre de la base de datos
    }
    async getConnect() {
        try {
            const client = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db(this.dbName);            
            return { 
                status: 200, 
                message: "Connection established", 
                data: db 
            };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Connection error", data: error }));
        }
    }
}


// async function main() {
//     const connect = new Connect();

//     try {
//         // Obtiene la conexión a la base de datos
//         const { status, message, data: db } = await conexion.getConnect();
//         console.log(message); // Muestra el mensaje de éxito

//         // Selecciona la colección en la que quieres trabajar
//         const collection = db.collection('pacientes'); // Ejemplo de colección

//         // Inserta un documento en la colección
//         const nuevoPaciente = { nombre: "Juan Pérez", edad: 30, enfermedad: "Gripe" };
//         const resultado = await collection.insertOne(nuevoPaciente);

//         console.log(`Documento insertado con el ID: ${resultado.insertedId}`);
//     } catch (error) {
//         console.error("Error:", JSON.parse(error.message));
//     }
// }

// main();