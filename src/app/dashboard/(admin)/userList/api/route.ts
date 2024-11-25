import { connect } from "@/app/lib/ConnectDB";

export const GET = async () => {
    try {
        const db = await connect();
        const userCollection = db?.collection('users');
        const users = await userCollection?.find().toArray();
        return Response.json(users);
    } catch (error) {
        console.error('Error user list not found:', error);
        return Response.json({massage: 'Error get user list'});
    }
    
}