import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

const EditEmployeeDialog = ({ open, onOpenChange, employee, onSave }) => {
    const [form, setForm] = useState({
        Fullname: '',
        email: '',
        Position: '',
        Department: ''
    });

    useEffect(() => {
        if (employee) setForm(employee);
    }, [employee]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>
                        Update the details for this employee.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="Fullname"
                        value={form.Fullname}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <Input
                        name="Position"
                        value={form.Position}
                        onChange={handleChange}
                        placeholder="Position"
                        required
                    />
                    <Input
                        name="Department"
                        value={form.Department}
                        onChange={handleChange}
                        placeholder="Department"
                        required
                    />
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEmployeeDialog;