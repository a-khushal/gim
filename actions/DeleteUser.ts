"use server"

import db from '../db'

export default async function DeleteUser(id: number) {
    try {
        await db.user.deleteMany({
            where: {
                id
            }
        })

        return {
            message: "User deleted successfully"
        }
    } catch(e) {
        console.log(e);

        return {
            error: "An error occured while deleting"
        }
    }
}