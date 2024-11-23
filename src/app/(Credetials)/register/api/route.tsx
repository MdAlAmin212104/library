
import { connect } from "@/app/lib/ConnectDB";
import { NextRequest } from "next/server";

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

export const POST = async (req: NextRequest) => {
    const newUser = await req.json();
    try {
        const db = await connect();
        const userCollection = db?.collection('users');
        const exist = await userCollection?.findOne({roll: newUser.roll})
        if(exist) {
            return Response.json({massage: 'user exists'});
        }
        const user = await userCollection?.insertOne(newUser);
        return Response.json({massage: 'user registered successfully', user});
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json({massage: 'Error registering user'});
    }
}


