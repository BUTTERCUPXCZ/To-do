import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import AddEmployeeDialog from "@/components/AddEmployeeDialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'



const getAllEmployees = async () => {
    const res = await fetch('http://localhost:3000/api/employees/getAllEmployees', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch employees');
    }
    const result = await res.json();
    return result.employees || result;
}

const deleteEmployee = async (id) => {
    const res = await fetch(`http://localhost:3000/api/employees/deleteEmployee/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to delete employee');
    }
    return res.json();
}

const editEmployee = async (employee) => {
    const res = await fetch(`http://localhost:3000/api/employees/updateEmployee/${employee.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Fullname: employee.Fullname,
            email: employee.email,
            Position: employee.Position,
            Department: employee.Department,
        })
    });
    if (!res.ok) {
        throw new Error('Failed to edit employee');
    }
    return res.json();
}

const Dashboard = () => {

    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { data, isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: getAllEmployees,
        staleTime: 1000 * 60 * 5,
        keepPreviousData: true,
    });
    const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteEmployee,
        onMutate: async (id) => {
            await queryClient.cancelQueries(['employees']);
            const previousEmployees = queryClient.getQueryData(['employees']);
            queryClient.setQueryData(['employees'], old =>
                old.filter(emp => emp.id !== id)
            );
            return { previousEmployees };
        },
        onError: (error) => {
            queryClient.setQueryData(['employees'], context.previousEmployees);
            toast.error('Failed to delete employee: ' + error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries(['employees']);
        }
    });

    const { mutate: editMutate } = useMutation({
        mutationFn: editEmployee,
        onSettled: () => {
            queryClient.invalidateQueries(['employees']);
        }
    });

    //Edit employee
    const handleEdit = (employeeId) => {
        const employee = data.find(emp => emp.id === employeeId);
        setEmployeeToEdit(employee);
        setEditDialogOpen(true);

    }

    const handleSaveEdit = (e) => {
        e.preventDefault(); // Prevent form reload
        setEditDialogOpen(false);
        editMutate(employeeToEdit);
        setEmployeeToEdit(null);
        toast.success('Employee updated successfully!');


    }

    const handleDelete = (employee) => {
        setSelectedEmployee(employee)
        setDeleteDialogOpen(true);
    }

    const confirmDelete = () => {
        if (selectedEmployee) {
            deleteMutate(selectedEmployee.id);
            setDeleteDialogOpen(false);
            setSelectedEmployee(null);
        }
    }

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedEmployee(null);
    }

    const paginatedData = data
        ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : [];
    const totalPages = data ? Math.ceil(data.length / pageSize) : 1;

    // Helper to generate page numbers (handles many pages)
    const getPageNumbers = (current, total) => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }
        if (current - delta > 2) range.unshift('...');
        if (current + delta < total - 1) range.push('...');
        range.unshift(1);
        if (total > 1) range.push(total);
        return range;
    };

    if (isLoading) return (
        <div className="text-center mt-10">
            <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                ))}
            </div>
        </div>
    );
    if (error) return <div className='text-center'><span className='text-2xl text-gray-600'>Error loading employees</span></div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-center">
                <div className="w-full max-w-5xl">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-left">Employee Dashboard</h1>
                        <AddEmployeeDialog />
                    </div>

                    <Table>
                        <TableCaption>A list of employees in the company.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 m-10">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">{employee.Fullname}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.Position}</TableCell>
                                        <TableCell>{employee.Department}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(employee.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(employee)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}

                        </TableBody>
                    </Table>
                    <div className="flex justify-center mt-4 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full"
                        >
                            Previous
                        </Button>
                        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                            page === '...' ? (
                                <span key={idx} className="px-2 py-1 text-gray-400">...</span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={`rounded-full ${page === currentPage ? "bg-blue-600 text-white" : ""}`}
                                >
                                    {page}
                                </Button>
                            )
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>


            {/* Edit Employee Modal */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                            Update the details for this employee.
                        </DialogDescription>
                    </DialogHeader>
                    {employeeToEdit && (
                        <form
                            className="space-y-4"
                            onSubmit={handleSaveEdit}
                        >
                            <Label htmlFor="name" className="mb-2">Full Name</Label>
                            <Input
                                placeholder="Name"
                                value={employeeToEdit.Fullname}
                                onChange={e => setEmployeeToEdit({ ...employeeToEdit, Fullname: e.target.value })}
                                required
                            />
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input
                                placeholder="Email"
                                value={employeeToEdit.email}
                                onChange={e => setEmployeeToEdit({ ...employeeToEdit, email: e.target.value })}
                                required
                            />
                            <Label htmlFor="name" className="mb-2">Position</Label>
                            <Input
                                placeholder="Position"
                                value={employeeToEdit.Position}
                                onChange={e => setEmployeeToEdit({ ...employeeToEdit, Position: e.target.value })}
                                required
                            />

                            <Label htmlFor="name" className="mb-2">Department</Label>
                            <Input
                                placeholder="Department"
                                value={employeeToEdit.Department}
                                onChange={e => setEmployeeToEdit({ ...employeeToEdit, Department: e.target.value })}
                                required
                            />
                            <DialogFooter>
                                <Button type="submit">Save</Button>
                                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>




            {/* Delete Confirmation Modal */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold">{selectedEmployee?.Fullname}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Dashboard