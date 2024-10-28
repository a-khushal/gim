'use client'

import { useEffect, useState } from 'react'
import { Users, CreditCard, Loader } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import AppBar from './Appbar'
import FetchAllUsers from '@/actions/FetchAllUsers'
import { MembershipStatus, PLAN } from '@prisma/client'
import { Input } from './ui/input'
import { AddNewUser } from './AddNewUser'


interface User {
    id: number,
    name: string,
    phone: string,
    membershipPlan: PLAN;
    membershipEnd: Date;
    status: MembershipStatus;
}

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState<User[] | { error: string }>()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function main() {
        const users = await FetchAllUsers()
        setUsers(users)
        setLoading(false)
    }

    main()
  }, [])

  const filteredUsers = Array.isArray(users)
  ? users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  const activeUsersCount = Array.isArray(users) 
  ? users.reduce((count, user) => 
      user.status === MembershipStatus.ACTIVE ? count + 1 : count
    , 0) 
  : 0;

  const expiredUsersCount = Array.isArray(users) 
  ? users.reduce((count, user) => 
      user.status === MembershipStatus.EXPIRED ? count + 1 : count
    , 0) 
  : 0;

  const metrics = [
    { title: 'Active Memberships', value: activeUsersCount.toString(), icon: Users },
    { title: 'Expired Memberships', value: expiredUsersCount.toString(), icon: Users },
    { title: 'Total Revenue', value: '₹10,000', icon: CreditCard },
  ]

  return (
    <div>
        <AppBar/>
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <main className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Owner Dashboard </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric, index) => (
                    <Card key={index} className="dark:bg-zinc-900 dark:border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium dark:text-gray-200">
                        {metric.title}
                        </CardTitle>
                        <metric.icon className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-white">{metric.value}</div>
                    </CardContent>
                    </Card>
                ))}
                </div>

                <Card className="mt-6 dark:bg-zinc-900 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="dark:text-white flex justify-between items-center">
                            <div className='flex justify-center items-center space-x-8'>
                                <span>All users</span>
                                <AddNewUser/>
                            </div>
                            <Input type="text" placeholder="search"  className="w-1/3 md:w-2/3 ml-auto" onChange={(e) => setSearch(e.target.value)}/>
                        </CardTitle>
                    </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-300">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-4 py-3">Name</th>
                            <th scope="col" className="px-4 py-3">Plan</th>
                            <th scope="col" className="px-4 py-3">Expiry Date</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* TODO: fix loader here */}
                        {loading ? (
                            <tr>
                            <td colSpan={5} className="flex justify-center items-center py-4 w-full">
                                <Loader />
                            </td>
                            </tr>
                        ) : (
                            filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800">
                                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-4 py-4">{user.membershipPlan}</td>
                                <td className="px-4 py-4">{new Date(user.membershipEnd).toLocaleDateString()}</td>
                                <td className="px-4 py-4">{user.status}</td>
                                <td className="px-4 py-4">
                                    <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                        View Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] dark:bg-zinc-900 dark:border-zinc-800">
                                        <DialogHeader>
                                        <DialogTitle className="dark:text-white">Renew Membership</DialogTitle>
                                        <DialogDescription className="dark:text-gray-400">
                                            Review and confirm the membership renewal for this user.
                                        </DialogDescription>
                                        </DialogHeader>
                                        {selectedUser && (
                                        <div className="grid gap-4 py-4">
                                            <div className="flex items-center gap-4">
                                            <Image
                                                src={selectedUser.photo || '/default-avatar.jpg'}
                                                alt={selectedUser.name}
                                                width={64}
                                                height={64}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <h3 className="font-semibold dark:text-white">{selectedUser.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email || 'No email provided'}</p>
                                            </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                                <p className="dark:text-white">{selectedUser.phone}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</label>
                                                <p className="dark:text-white">{selectedUser.membershipPlan}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</label>
                                                <p className="dark:text-white">{new Date(selectedUser.membershipEnd).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">New Expiry Date</label>
                                                <p className="dark:text-white">
                                                {new Date(new Date(selectedUser.membershipEnd).setFullYear(new Date(selectedUser.membershipEnd).getFullYear() + 1))
                                                    .toISOString()
                                                    .split('T')[0]}
                                                </p>
                                            </div>
                                            </div>
                                            <Button className="w-full">Confirm Renewal</Button>
                                        </div>
                                        )}
                                    </DialogContent>
                                    </Dialog>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-4 text-center">No users found</td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    </div>
                </CardContent>
                </Card>
            </main>
        </div>
    </div>
  )
}