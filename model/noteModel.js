const { ObjectId } = require("mongodb");
const connect = require("../helpers/connect")
module.exports = class Note extends connect {
    constructor() {
        super();
    }
    async getAllNotes({id_user}) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const result = await collection.aggregate([
                {
                    $match: {
                        status: "visible",
                        usuario_id: new ObjectId(id_user) // id del token del usuario logeado
                    }
                },
                {
                    $project: {
                        _id: 0,
                        result: {
                            $cond: {
                                if: { $gte: [{ $size: "$changes" }, 1] }, // Verifica si el tamaño del array 'changes' es mayor que 1
                                then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$changes", -1] }] },// Si es mayor que 1, muestra el último elemento del array 'changes'
                                else: "$$ROOT" // Si no, muestra la colección completa
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$result" } // Reemplaza el documento raíz con el contenido del campo 'result'
                },
                {
                    $project: {
                        usuario_id: 0,
                        changes: 0,
                        status: 0
                    }
                },
                {
                    $addFields: {
                        date: {
                            $cond: {
                                if: { $not: ["$date"] }, // Verifica si el campo 'date' no existe
                                then: { $toDate: "$_id" }, // Si no existe, convierte el '_id' en una fecha
                                else: "$date" // Si ya existe, conserva el valor original de 'date'
                            }
                        }
                    }
                }
            ]).toArray();
            return { status: 200, message: "List of notes obtained", data: result }
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async getOneNotesById({id_user,id}) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const [result] = await collection.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id), // id de la nota a buscar
                        status: "visible",
                        usuario_id: new ObjectId(id_user) // id del token del usuario logeado
                    }
                },
                {
                    $project: {
                        _id: 0,
                        result: {
                            $cond: {
                                if: { $gte: [{ $size: "$changes" }, 1] }, // Verifica si el tamaño del array 'changes' es mayor que 1
                                then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$changes", -1] }] },// Si es mayor que 1, muestra el último elemento del array 'changes'
                                else: "$$ROOT" // Si no, muestra la colección completa
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$result" } // Reemplaza el documento raíz con el contenido del campo 'result'
                },
                {
                    $project: {
                        usuario_id: 0,
                        changes: 0,
                        status: 0
                    }
                },
                {
                    $addFields: {
                        date: {
                            $cond: {
                                if: { $not: ["$date"] }, // Verifica si el campo 'date' no existe
                                then: { $toDate: "$_id" }, // Si no existe, convierte el '_id' en una fecha
                                else: "$date" // Si ya existe, conserva el valor original de 'date'
                            }
                        }
                    }
                }
            ]).toArray();
            return { status: 200, message: "Note found", data: result }
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async searchNoteByTitleDescription({id_user, q}) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const result = await collection.aggregate([
                {
                    $match: {
                        status: "visible",
                        usuario_id: new ObjectId(id_user) // id del token del usuario logeado
                    }
                },
                {
                    $project: {
                        _id: 0,
                        result: {
                            $cond: {
                                if: { $gte: [{ $size: "$changes" }, 1] }, // Verifica si el tamaño del array 'changes' es mayor que 1
                                then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$changes", -1] }] },// Si es mayor que 1, muestra el último elemento del array 'changes'
                                else: "$$ROOT" // Si no, muestra la colección completa
                            }
                        }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$result" } // Reemplaza el documento raíz con el contenido del campo 'result'
                },
                {
                    $project: {
                        usuario_id: 0,
                        changes: 0,
                        status: 0
                    }
                },
                {
                    $addFields: {
                        date: {
                            $cond: {
                                if: { $not: ["$date"] }, // Verifica si el campo 'date' no existe
                                then: { $toDate: "$_id" }, // Si no existe, convierte el '_id' en una fecha
                                else: "$date" // Si ya existe, conserva el valor original de 'date'
                            }
                        }
                    }
                }
            ]).toArray();

            // Convertimos el texto a buscar a minúsculas para hacer una búsqueda insensible a mayúsculas
            const text = q.toLowerCase();

            // Filtramos el arreglo para encontrar coincidencias
            const resultCoincidence = result.filter(item => 
                item.title.toLowerCase().includes(text) || 
                item.descripción.toLowerCase().includes(text)
            );
         
            
            return { status: 200, message: "List of notes obtained", data: resultCoincidence }
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async updateHistoryNoteById({id, body, id_user}) {
        try {       
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const result = await collection.updateOne(
                { 
                    _id: new ObjectId(id),
                    usuario_id: new ObjectId(id_user)
                },
                { $push: { changes: body } }     
              );
            return { status: 214, message: "Note updated", data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async deleteNotesById({id_user,id}) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const result = await collection.updateOne(
                { 
                    _id: new ObjectId(id),
                    usuario_id: new ObjectId(id_user)
                },
                { $set: { status: "not visible" } }
              );
            return { status: 200, message: "Note deleted", data: result }
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async save({usuario_id,body}) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('Notes');
            const result = await collection.insertOne(body);
            return { status: 201, message: "Note saved", data: result }
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
}