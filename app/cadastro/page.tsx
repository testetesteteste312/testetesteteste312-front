"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { authService } from "@/services/api"

export default function CadastroPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    // Validação do nome
    if (!name.trim()) {
      newErrors.push("Nome é obrigatório")
    } else if (name.trim().length < 3) {
      newErrors.push("Nome deve ter pelo menos 3 caracteres")
    }

    // Validação do email
    if (!email) {
      newErrors.push("Email é obrigatório")
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.push("Email inválido")
    }

    // Validação da senha
    if (!password) {
      newErrors.push("Senha é obrigatória")
    } else if (password.length < 6) {
      newErrors.push("Senha deve ter no mínimo 6 caracteres")
    } else if (password.length > 72) {
      newErrors.push("Senha deve ter no máximo 72 caracteres")
    } else {
      // Verificar se tem letra e número
      const hasLetter = /[a-zA-Z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      
      if (!hasLetter || !hasNumber) {
        newErrors.push("Senha deve conter letras e números")
      }
    }

    // Validação da confirmação de senha
    if (!confirmPassword) {
      newErrors.push("Confirmação de senha é obrigatória")
    } else if (password !== confirmPassword) {
      newErrors.push("As senhas não coincidem")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors([])

    // Valida o formulário
    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Registra na API - chama POST /usuarios/
      await authService.register(name.trim(), email.toLowerCase(), password)

      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      // Redireciona após 1 segundo
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      
      let errorMessage = "Erro ao criar conta. Tente novamente."
      
      // Trata erros específicos da API
      if (error.message.includes('já existe')) {
        errorMessage = "Este email já está cadastrado. Tente fazer login."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setErrors([errorMessage])
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors([])
  }

  // Validações em tempo real - indicador de força da senha
  const getPasswordStrength = () => {
    if (!password) return null
    
    const strength = {
      weak: password.length < 6,
      medium: password.length >= 6 && password.length < 10,
      strong: password.length >= 10 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
    }

    if (strength.strong) return { label: "Forte", color: "text-accent" }
    if (strength.medium) return { label: "Média", color: "text-primary" }
    if (strength.weak) return { label: "Fraca", color: "text-destructive" }
    return null
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md space-y-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Voltar para início
        </Link>

        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Criar sua conta</CardTitle>
            <CardDescription>Preencha os dados abaixo para começar a usar o Imunetrack</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Mensagens de erro */}
              {errors.length > 0 && (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearErrors()
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearErrors()
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearErrors()
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={72}
                />
                {passwordStrength && (
                  <p className={`text-xs ${passwordStrength.color}`}>
                    Força da senha: {passwordStrength.label}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres, com letras e números
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    clearErrors()
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={72}
                />
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                    As senhas coincidem
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Fazer login
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Requisitos da senha */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-xs font-medium mb-2">Requisitos da senha:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Mínimo de 6 caracteres</li>
              <li>✓ Pelo menos uma letra</li>
              <li>✓ Pelo menos um número</li>
              <li>✓ Máximo de 72 caracteres</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}