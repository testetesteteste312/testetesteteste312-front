"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, LogOut, CalendarIcon, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { VaccineCalendar } from "@/components/ui/vaccine-calendar"
import { VaccineList } from "@/components/ui/vaccine-list"
import { Sidebar } from "@/components/ui/sidebar"
import { VaccineScheduleForm } from "@/components/ui/vaccine-schedule-form"
import { SettingsModal } from "@/components/ui/settings-modal"
import { historicoService, type Estatisticas } from "@/services/api"
import UserList from "@/components/ui/user-list"

interface User {
  email: string
  name: string
  id: string | number
  isAdmin?: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [stats, setStats] = useState<Estatisticas | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  // Carregar estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        const data = await historicoService.obterEstatisticas(Number(user.id))
        setStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user, refreshKey])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (!user) {
    return null
  }

  const usuarioId = Number(user.id)

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onSettingsOpen={() => setIsSettingsOpen(true)} isAdmin={user.isAdmin} />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-balance">Imunetrack</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Olá, {user.name}!</h2>
                <p className="text-muted-foreground">Acompanhe suas vacinas e mantenha sua saúde em dia.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vacinas Aplicadas</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.doses_aplicadas ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Doses completas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.doses_pendentes ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Agendadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.doses_atrasadas ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Doses atrasadas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Vaccine List */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Suas Vacinas
                      </CardTitle>
                      <CardDescription>Histórico e próximas doses programadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VaccineList usuarioId={usuarioId} key={refreshKey} />
                    </CardContent>
                  </Card>
                </div>

                {/* Calendar */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        Calendário de Vacinação
                      </CardTitle>
                      <CardDescription>Datas programadas para suas vacinas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VaccineCalendar usuarioId={usuarioId}/>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Schedule View */}
          {activeTab === "schedule" && (
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Agendar Vacina</h2>
                <p className="text-muted-foreground">Agende uma nova vacina de forma rápida e fácil.</p>
              </div>
              <VaccineScheduleForm
                usuarioId={usuarioId}
                onSchedule={handleRefresh}
              />
            </div>
          )}

          {/* History View */}
          {activeTab === "history" && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Histórico de Vacinação</h2>
                <p className="text-muted-foreground">Veja todo o seu histórico de vacinação.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Todas as Vacinas</CardTitle>
                  <CardDescription>Histórico completo de doses aplicadas e agendadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <VaccineList usuarioId={usuarioId} key={refreshKey} />
                </CardContent>
              </Card>
            </>
          )}

          {/* Admin View */}
          {activeTab === "admin" && user.isAdmin && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Área do Administrador</h2>
                <p className="text-muted-foreground">Gerencie usuários, vacinas e outras configurações.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento</CardTitle>
                  <CardDescription>Dados cadastrados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserList />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}