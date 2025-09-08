import React, { useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '../components/ui/dialog'
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import config from '../utils/api';


const addEmployee = async (userData) => {
    const res = await fetch(`${config.apiUrl}/api/employees/addEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        throw new Error('Failed to create account');
    }
    return res.json();
};

const addModal = () => {

    // Form state for the Add Employee dialog
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");

    const { mutate, isLoading, isError, isSuccess, error, data } = useMutation({
        mutationFn: addEmployee,
        onSuccess: (data) => {
            toast.success('Employee added successfully!');
            navigate('/');
        },
        onError: (data) => {
            toast.error('Employee creation failed');
        }

    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !position || !department) {
            toast.error("All fields are required");
            return;
        }

        mutate({ name, email, position, department });
    }

    return (
        <Dialog>
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
                        <Label htmlFor="name" className='mb-2'>Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="email" className='mb-2'>Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="position" className='mb-2'>Position</Label>
                        <Input id="position" value={position} onChange={e => setPosition(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="department" className='mb-2'>Department</Label>
                        <Input id="department" value={department} onChange={e => setDepartment(e.target.value)} required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default addModal