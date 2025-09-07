import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'



const registerUser = async (userData) => {
    const res = await fetch('http://localhost:3000/api/employees/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        throw new Error('Failed to create account');
    }
    return res.json();
};

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate();

    const { mutate, isLoading, isError, isSuccess, error, data } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data, variables, context) => {
            toast.success('User created Succesfully!');
            navigate('/');
        },
        onError: (data, error, variables, context) => {
            toast.error('User creation failed');
        }

    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        mutate({ Fullname: name, email, password });

    }

    // Render based on mutation states
    if (isLoading) return <span>Creating user...</span>;
    if (isError) return <span>Error: {error.message}</span>;
    if (isSuccess) return <span>User created!</span>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to register
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Fullname</Label>
                            <Input
                                id="Fullname"
                                type="text"
                                placeholder="Enter your fullname"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-5">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" disabled={isLoading}>
                                GitHub
                            </Button>
                            <Button variant="outline" disabled={isLoading}>
                                Google
                            </Button>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to='/'>
                                <Button variant="link" className="px-0 font-normal">
                                    Sign in
                                </Button>
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Register