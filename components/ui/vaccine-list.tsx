"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Calendar, Loader2 } from "lucide-react"
import { historicoService, type HistoricoVacinal } from "@/services/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VaccineListProps {
  usuarioId: number;
  onRefresh?: () => void; // opcional, se quiser avisar o dashboard
}

export function VaccineList({ usuarioId, onRefresh }: VaccineListProps) {
  const [vacinas, setVacinas] = useState<HistoricoVacinal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vacinaSelecionada, setVacinaSelecionada] = useState<HistoricoVacinal | null>(null)
  const [aplicada, setAplicada] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchVacinas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await historicoService.listarPorUsuario(usuarioId)
        setVacinas(data)
      } catch (err) {
        console.error('Erro ao buscar vacinas:', err)
        setError('Erro ao carregar vacinas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (usuarioId) {
      fetchVacinas()
    }
  }, [usuarioId])

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aplicada':
        return { label: 'Aplicada', variant: 'secondary' as const, className: 'bg-accent/10 text-accent hover:bg-accent/20' }
      case 'pendente':
        return { label: 'Pendente', variant: 'default' as const, className: 'bg-primary/10 text-primary hover:bg-primary/20' }
      case 'atrasada':
        return { label: 'Atrasada', variant: 'destructive' as const, className: '' }
      case 'cancelada':
        return { label: 'Cancelada', variant: 'outline' as const, className: '' }
      default:
        return { label: status, variant: 'default' as const, className: '' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aplicada':
        return <CheckCircle2 className="h-5 w-5 text-accent" />
      case 'pendente':
        return <Clock className="h-5 w-5 text-primary" />
      case 'atrasada':
        return <Calendar className="h-5 w-5 text-destructive" />
      default:
        return <Calendar className="h-5 w-5 text-muted-foreground" />
    }
  }

  const handleMarcarAplicada = async () => {
    if (!vacinaSelecionada) return
    try {
      setSaving(true)

      const payload = {
        data_aplicacao: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        lote: "N/A",            // opcional, pode personalizar
        local_aplicacao: "N/A", // opcional
        profissional: "N/A"     // opcional
      }

      // PATCH para o endpoint correto do FastAPI
      await historicoService.marcarComoAplicada(usuarioId, vacinaSelecionada.id, payload)

      // Atualiza o estado local
      setVacinas((prev: HistoricoVacinal[]) =>
        prev.map((v) =>
          v.id === vacinaSelecionada.id
            ? { ...v, status: "aplicada", data_aplicacao: payload.data_aplicacao }
            : v
        )
      )

      setVacinaSelecionada(null)
      setAplicada(false)
      onRefresh?.()
    } catch (error: any) {
      console.error("Erro ao atualizar vacina:", error.response?.data || error)
      alert("Erro ao marcar como aplicada: " + JSON.stringify(error.response?.data))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando vacinas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {error}
      </div>
    )
  }

  if (vacinas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma vacina registrada ainda.</p>
        <p className="text-sm mt-2">Adicione vacinas ao seu histórico para começar.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {vacinas.map((vacina) => {
          const statusInfo = getStatusBadge(vacina.status)
          const displayDate = vacina.data_aplicacao || vacina.data_prevista

          return (
            <div
              key={vacina.id}
              onClick={() => vacina.status === "pendente" && setVacinaSelecionada(vacina)}
              className={`flex items-start gap-3 p-3 rounded-lg border bg-card transition-colors ${
                vacina.status === "pendente" ? "cursor-pointer hover:bg-accent/5" : ""
              }`}
            >
              <div className="mt-0.5">
                {getStatusIcon(vacina.status)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium leading-tight text-sm">
                      {vacina.vacina_nome} - Dose {vacina.numero_dose}
                    </h4>
                    {displayDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {vacina.data_aplicacao ? 'Aplicada em' : 'Prevista para'}: {formatDate(displayDate)}
                      </p>
                    )}
                    {vacina.local_aplicacao && (
                      <p className="text-xs text-muted-foreground">
                        Local: {vacina.local_aplicacao}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={statusInfo.variant}
                    className={statusInfo.className}
                  >
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Marcar como Aplicada */}
      <Dialog open={!!vacinaSelecionada} onOpenChange={() => setVacinaSelecionada(null)}>
        <DialogContent>
          {vacinaSelecionada && (
            <>
              <DialogHeader>
                <DialogTitle>{vacinaSelecionada.vacina_nome}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Dose {vacinaSelecionada.numero_dose} — Prevista para {formatDate(vacinaSelecionada.data_prevista)}
                </p>

                {/* checkbox nativo sem componente externo */}
                <div className="flex items-center space-x-2">
                  <input
                    id="aplicada"
                    type="checkbox"
                    checked={aplicada}
                    onChange={(e) => setAplicada(e.target.checked)}
                    className="h-4 w-4 rounded border-muted-foreground"
                  />
                  <label htmlFor="aplicada" className="text-sm">Confirmar que esta dose foi aplicada</label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setVacinaSelecionada(null)}>Cancelar</Button>
                <Button
                  onClick={handleMarcarAplicada}
                  disabled={!aplicada || saving}
                >
                  {saving ? "Salvando..." : "Confirmar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
