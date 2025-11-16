"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, User } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user?: { name: string; email: string }
  currentTheme?: "light" | "dark" | "auto"
  onThemeChange?: (theme: "light" | "dark" | "auto") => void
  currentFontSize?: "sm" | "base" | "lg"
  onFontSizeChange?: (size: "sm" | "base" | "lg") => void
}

export function SettingsModal({
  isOpen,
  onClose,
  user,
  currentTheme = "auto",
  currentFontSize = "base",
  onThemeChange,
  onFontSizeChange,
}: SettingsModalProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto")
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    birthDate: "",
  })

  const applyFontSize = (size: "sm" | "base" | "lg") => {
    // Remove classes anteriores
    document.documentElement.classList.remove("font-sm", "font-base", "font-lg")
    // Adiciona a nova classe
    document.documentElement.classList.add(`font-${size}`)
  }

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") as "sm" | "base" | "lg"
    if (savedFontSize) {
      setFontSize(savedFontSize)
      applyFontSize(savedFontSize)
    }
  }, [])

  useEffect(() => {
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "auto"
  if (savedTheme) {
    setTheme(savedTheme)
    handleThemeChange(savedTheme)
  }
}, [])

  useEffect(() => {
    setFontSize(currentFontSize)
  }, [currentFontSize])

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    
    // Aplicar o tema no documento
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // Automático - detectar preferência do sistema
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", isDark)
    }
    
    onThemeChange?.(newTheme)
  }

  const handleFontChange = (size: "sm" | "base" | "lg") => {
    setFontSize(size)
    localStorage.setItem("fontSize", size)
    applyFontSize(size)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tema</CardTitle>
                <CardDescription>Escolha o tema da aplicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === "light"}
                      onChange={(e) => handleThemeChange("light")}
                      className="cursor-pointer"
                    />
                    <span>Claro</span>
                  </Label>
                  <Label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === "dark"}
                      onChange={(e) => handleThemeChange("dark")}
                      className="cursor-pointer"
                    />
                    <span>Escuro</span>
                  </Label>
                  <Label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={theme === "auto"}
                      onChange={(e) => handleThemeChange("auto")}
                      className="cursor-pointer"
                    />
                    <span>Automático (conforme sistema)</span>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fonte</CardTitle>
                <CardDescription>Tamanho de fonte padrão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={fontSize === "sm" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontChange("sm")}
                  >
                    A
                  </Button>
                  <Button
                    variant={fontSize === "base" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontChange("base")}
                  >
                    A
                  </Button>
                  <Button
                    variant={fontSize === "lg" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFontChange("lg")}
                  >
                    A
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleProfileSave} className="flex-1">
                Salvar Alterações
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
