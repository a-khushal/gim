'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader, Plus } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DatePicker } from "./ui/date-picket"
import GenerateUrl from "@/actions/PresignedUrl"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { PLAN } from "@prisma/client"
import AddNewUserAction from "@/actions/AddNewUser"

const formSchema = z.object({
    username: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    phno: z.string().min(10, {
    message: "Phone number must be exactly 10 digits.",
    }).max(10, {
    message: "Phone number must be exactly 10 digits.",
    }),
    plan: z.enum(["MONTHLY", "QUATERLY", "HALFYEARLY", "YEARLY"], {
        required_error: "Membership plan is required.",
        invalid_type_error: "Invalid membership plan selected."
    }),
    expiryDate: z.date({
        required_error: "Expiry date is required.",
        invalid_type_error: "Invalid date format.",
    }),
    photoLink: z
        .instanceof(File)
        .refine(file => {
            if (!file) return true; 
            return file.size > 0 && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        }, {
            message: "A valid image file (JPEG, PNG, GIF) is required if provided.",
        })
        .optional()
})

export interface User {
    username: string;
    phno: string;
    plan: PLAN;
    expiryDate: Date;
    photoLink: string | null;
}

export function AddNewUser() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            phno: "",
            plan: undefined,
            expiryDate: undefined,
        },
    })

    const handleFileUpload = async (file: File) => {
        if(!file) return null

        try {
            const { key, url } = await GenerateUrl()
            await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-type": file.type
                }, 
                body: file
            })

            return key
        } catch(e) {
            console.error("File upload failed:", e);
            toast({
                title: "Upload Failed",
                description: "Could not upload the image. Please try again.",
                variant: "destructive"
              });
            return null;
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true)

        const fileKey = values.photoLink ? await handleFileUpload(values.photoLink) : null

        const submissionData: User = {
            username: values.username,
            phno: values.phno,
            plan: values.plan, 
            expiryDate: values.expiryDate,
            photoLink: fileKey,
        };
        
        try {
            await AddNewUserAction(submissionData);
            toast({
                title: "Member Added",
                description: "The new gym member has been successfully added.",
            });
        } catch (error) {
            console.error("Error adding user:", error);
            toast({
                title: "Error",
                description: "Failed to add new member. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false); 
            window.location.reload()
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="default"><Plus/>Add New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Gym Member</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Add new member. Click submit when done
            </DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phno"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                            <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Membership plan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="MONTHLY">1 month</SelectItem>
                            <SelectItem value="QUATERLY">3 months</SelectItem>
                            <SelectItem value="HALFYEARLY">6 months</SelectItem>
                            <SelectItem value="YEARLY">1 year</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Membership Expiry date</FormLabel>
                        <FormControl>
                            <div>
                                <DatePicker value={field.value} onChange={field.onChange}/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name="photoLink"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                            <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            onChange={(e) => {
                                if (e.target.files) {
                                    field.onChange(e.target.files[0]);
                                }
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={loading} className="flex items-center justify-center w-full">
                        {loading ? <Loader className="animate-spin" /> : "Submit"}
                    </Button>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}
