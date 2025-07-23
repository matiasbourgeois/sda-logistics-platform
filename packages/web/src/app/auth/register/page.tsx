"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el usuario.");
      }

      const data = await response.json();
      console.log("Usuario registrado con éxito:", data);
      alert("¡Usuario registrado con éxito!");
      
    } catch (error) {
      // ESTE ES EL BLOQUE CORREGIDO
      console.error("Hubo un error en el registro:", error);
      if (error instanceof Error) {
        // Si 'error' es una instancia de Error, sabemos que tiene .message
        alert(`Error en el registro: ${error.message}`);
      } else {
        // Si no, es un error inesperado, lo convertimos a string
        alert(`Error en el registro: ${String(error)}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* 2. ENVOLVEMOS LA CARD EN UN FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Crear una cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para registrarte en Sol del Amanecer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... (el contenido de CardContent no cambia) ... */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    placeholder="Pérez"
                    required
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">Registrarse</Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}