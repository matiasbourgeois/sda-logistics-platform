"use client"; // Esto es necesario para usar hooks de React en Next.js App Router

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    setError(null); // Limpia errores anteriores
    setSuccess(null); // Limpia mensajes de éxito anteriores

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la respuesta no es OK (ej. 401 Unauthorized, 400 Bad Request)
        setError(data.message || 'Error al iniciar sesión.');
        return;
      }

      // Si la respuesta es OK
      setSuccess('¡Inicio de sesión exitoso!');
      // Aquí podrías guardar el token de acceso (data.access_token) en localStorage o un contexto
      console.log('Token de acceso:', data.access_token);
      // Redirigir al usuario a otra página, por ejemplo, el dashboard
      // router.push('/dashboard'); // Necesitarías importar useRouter de 'next/navigation'
    } catch (err) {
      console.error('Error de red o inesperado:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Ingresa tu email y contraseña para acceder.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}> {/* Añadido el manejador onSubmit */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}