const { ObjectId } = require("mongodb");
const connect = require("../helpers/connect")
module.exports = class User extends connect {
    constructor() {
        super();
    }
    async save(body) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('User');
            const [resultNickName] = await collection.find({nickName: body.nickName,}).toArray();
            if (resultNickName) return { status: 200, message: "The nickname is not available.", data: undefined };
            const [resultEmail] = await collection.find( {email: body.email }).toArray();
            if (resultEmail) return { status: 200, message: "The email already has an account assigned", data: undefined };
            const result = await collection.insertOne(body);
            return { status: 201, message: "Account created", data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    async login(body) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('User');
            const [resultNickName] = await collection.find({nickName: body.nickName}).toArray();
            if (resultNickName) return { status: 200, message: "User found", data: resultNickName };
            return { status: 404, message: "User not found" };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
}