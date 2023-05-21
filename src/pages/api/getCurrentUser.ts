import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET"){
        const query = req.query
        
        const user = await prisma.users.findFirst({
            where: {
                email: query.email as string
            },
            select: {
                email: true,
                fullname: true
            }
        })

        return res.status(200).json(user)
    }
}