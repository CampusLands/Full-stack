const { ObjectId } = require("mongodb");
const Note = require("../model/noteModel")

/**
 * @method findAllNotes Obtener Todas las Notas
 * @description Obtiene una lista de todas las notas.
*/
exports.findAllNotes= async(req, res)=>{
    try {
        const note = new Note();
        let result = await note.getAllNotes({id_user:req.data._id});  
        return res.status(result.status).json(result);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method findNoteById Obtener Nota Específica
 * @description Obtiene los detalles de una nota específica.
*/
exports.findNoteById= async(req, res)=>{
    try {
        const data = {
            id_user:req.data._id,
            ...req.params
        }
        const note = new Note();
        let result = await note.getOneNotesById(data);
        if(!result.data) return res.status(404).json({status: 404, message: "Note not found"});
        return res.status(result.status).json(result);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method findNotesMatchingTitleOrDescription Buscar Notas
 * @description Busca notas por título o contenido.
*/
exports.findNotesMatchingTitleOrDescription= async(req, res)=>{
    try {
        const data = {
            id_user:req.data._id,
            ...req.query
        }
        const note = new Note();
        let result = await note.searchNoteByTitleDescription(data);
        if(result.data.length == 0) return res.status(404).json({status: 404, message: "Note not found"});
        return res.status(result.status).json(result);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method findNoteChangeHistory Obtener Historial de Cambios de Nota
 * @description Obtiene el historial de cambios de una nota específica.
 * TODO: solo admin
*/
exports.findNoteChangeHistory= async(req, res)=>{
    try {
        
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method save Crear Nota
 * @description Crea una nueva nota.
*/
exports.save= async(req, res)=>{
    try {
        let id_user = req.data._id;
        const data = {
            usuario_id: id_user,
            body: {...req.body}
        };
        data.body.usuario_id = new ObjectId(id_user);
        data.body.changes = [];
        data.body.status = "visible"
        const note = new Note();
        let resultPOST = await note.save(data);
        if(!resultPOST.data.acknowledged) return res.status(406).json({status: 406, message: "Note not saved"});
        let resultGET = await note.getOneNotesById({id_user, id:resultPOST.data.insertedId});
        return res.status(201).json({status: 201, message: "Note created", data: resultGET.data});
        
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method updateNoteById Actualizar Nota
 * @description Actualiza una nota existente.
 * @note: Antes de proceder con la actualización, se verifica si la nota existe y es visible para el usuario autenticado. Si el recurso no se encuentra, la actualización no se realiza; en caso contrario, se procede a actualizarlo.
*/
exports.updateNoteById = async(req, res)=>{
    try {
        const data = {
            id_user:req.data._id,
            body: {...req.body},
            id: req.params.id
        };
        data.body.date = new Date();
        const note = new Note();
        let resultGet = await note.getOneNotesById(data);
        if(!resultGet.data) return res.status(404).json({status: 404, message: "Note not found"});
        let resultPut = await note.updateHistoryNoteById(data);
        return res.status(resultPut.status).json(resultPut);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}
/**
 * @method deleteNoteById Eliminar Nota
 * @description Elimina una nota específica.
*/
exports.deleteNoteById = async(req, res)=>{
    try {
        const data = {
            id_user:req.data._id,
            id: req.params.id
        };
        let note = new Note();
        let resultGet = await note.getOneNotesById(data);
        if(!resultGet.data) return res.status(214).json({status: 214, message: "Note updated"});
        let resultDelete = await note.deleteNotesById(data);
        return res.status(resultDelete.status).json(resultDelete);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}