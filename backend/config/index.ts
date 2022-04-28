import mongoose from 'mongoose'

export async function connectDB() {
  await mongoose.connect('mongodb+srv://Sgadmer:PTuLbNg03gscizhE@udm-attr-cluster.jew94.mongodb.net/udmAttr?retryWrites=true&w=majority');
}

connectDB().catch(err => console.log(err));
