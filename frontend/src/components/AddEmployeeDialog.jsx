import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function AddEmployeeDialog() {

    // Form state for the Add Employee dialog
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [position, setPosition] = useState("")
    const [department, setDepartment] = useState("")
    const [open, setOpen] = useState(false)

    const queryClient = useQueryClient()

    const addEmployee = async (userData) => {
        const res = await fetch('http://localhost:3000/api/employees/addEmployee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            throw new Error('Failed to create employee');
        }
        return res.json();
    };

    const { mutate, isLoading, isError, isSuccess, error, data } = useMutation({
        mutationFn: addEmployee,
        onSuccess: (data) => {
            toast.success('Employee added successfully!');
            // Reset form
            setName("")
            setEmail("")
            setPosition("")
            setDepartment("")
            setOpen(false)
            // Invalidate and refetch employee data if you have it
            queryClient.invalidateQueries(['employees'])
        },
        onError: (error) => {
            toast.error('Employee creation failed: ' + error.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !position || !department) {
            toast.error("All fields are required");
            return;
        }

        mutate({
            Fullname: name,
            email,
            Position: position,
            Department: department
        });
    }

    // Render based on mutation states
    if (isLoading) return <span>Creating user...</span>;
    if (isError) return <span>Error: {error.message}</span>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogDescription>Fill in the details below to add a new employee.</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="name" className="mb-2">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div>
                        <Label htmlFor="email" className="mb-2">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div>
                        <Label htmlFor="position" className="mb-2">Position</Label>
                        <Input id="position" value={position} onChange={e => setPosition(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div>
                        <Label htmlFor="department" className="mb-2">Department</Label>
                        <Input id="department" value={department} onChange={e => setDepartment(e.target.value)} required disabled={isLoading} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add'}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
