import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'


const BASE_URL = import.meta.env.MODE === 'production' ? "http://localhost:3000" : "";

const loginUser = async (userData) => {
    const res = await fetch(`${BASE_URL}/api/employees/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        throw new Error('Failed to login');
    }
    return res.json();
};

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    const { login } = useAuth();

    const { mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // Store authentication data
            login(data.token, data.user);
            toast.success('Login successful!');
            navigate('/dashboard');
        },
        onError: (error) => {
            toast.error('Login failed');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error("Invalid credentials");
            return;
        }
        mutate({ email, password });
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
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to sign in to your account
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="remember" className="text-sm">
                                    Remember me
                                </Label>
                            </div>
                            <Button variant="link" className="px-0 font-normal">
                                Forgot password?
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
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
                            Don't have an account?{" "}
                            <Link to='/signup'>
                                <Button variant="link" className="px-0 font-normal">
                                    Sign up
                                </Button>
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Login