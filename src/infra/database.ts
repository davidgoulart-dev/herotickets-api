import mongoose from "mongoose"

export async function connect() {
    try{
        await mongoose.connect('mongodb+srv://davidgoulartdev:22456328@cluster0.elhsxfg.mongodb.net/hero-tickets')
        console.log('conectado ao banco de dados com sucesso!');
        
    }catch(error){
        console.log('erro', error)
    }
}