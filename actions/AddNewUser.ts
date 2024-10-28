"use server"
import { User } from '@/components/AddNewUser';
import db from '../db'
import { MembershipStatus } from "@prisma/client";

export default async function AddNewUserAction(props: User) {
    try {
        await db.user.create({
            data: {
                name: props.username,
                phone: props.phno,
                membershipPlan: props.plan,
                membershipEnd: props.expiryDate,
                profilePhoto: props.photoLink || null, 
                status: MembershipStatus.ACTIVE, 
            },
        });
    } catch (error) {
        console.error("Error adding new user:", error);
        throw new Error("Failed to add new user");
    }
}
