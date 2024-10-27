"use server"

import db from '../db'

export default async function FetchAllUsers() {
    try {
        const users = await db.user.findMany({
            where: {},
            select: {
                id: true,
                name: true,
                phone: true,
                membershipEnd: true,
                membershipPlan: true,
                status: true,
            }
        })

        return users
    } catch(e) {
        console.log(e)
        return {
            error: "Error while fetching the data"
        }
    }
}