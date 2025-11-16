"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoricoVacinal {
  id: number
  vacina_nome: string
  status: "pendente" | "aplicada" | "atrasada" | "cancelada"
  numero_dose: number
  data_prevista?: string
  data_aplicacao?: string
  local_aplicacao?: string
  profissional?: string
}

export function VaccineCalendar({ usuarioId }: { usuarioId: number }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [historico, setHistorico] = useState<HistoricoVacinal[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedVaccines, setSelectedVaccines] = useState<HistoricoVacinal[]>([])

  // Buscar dados da API
  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await fetch(`http://localhost:8000/usuarios/${usuarioId}/historico`)
        if (!res.ok) {
          console.error("Erro ao buscar histórico:", res.status)
          return
        }

        const data = await res.json()
        console.log("📦 Dados recebidos do backend:", data)

        // Garante que historico sempre seja array
        if (Array.isArray(data)) {
          setHistorico(data)
        } else if (data) {
          setHistorico([data])
        } else {
          setHistorico([])
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error)
        setHistorico([])
      }
    }

    fetchHistorico()
  }, [usuarioId])

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDay = firstDay.getDay()
    const daysArray = []

    // Adiciona dias anteriores
    const prevMonthLast = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      daysArray.push({ date: prevMonthLast - i, current: false })
    }

    // Adiciona dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push({ date: i, current: true })
    }

    // Adiciona dias seguintes para completar 6 linhas
    let nextMonthDay = 1
    while (daysArray.length < 42) {
      daysArray.push({ date: nextMonthDay, current: false })
      nextMonthDay++
    }

    return daysArray
  }

  const handleDayClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDay(selected)

    const vaccinesOnDay = historico.filter((v) => {
      const compareDate = v.data_aplicacao || v.data_prevista
      return compareDate && new Date(compareDate).toDateString() === selected.toDateString()
    })
    setSelectedVaccines(vaccinesOnDay)
  }

  const days = daysInMonth(currentDate)

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
          const isTransparent = !day.current

          const vaccines = day.current
            ? historico.filter((v) => {
                const compareDate = v.data_aplicacao || v.data_prevista
                return (
                  compareDate &&
                  new Date(compareDate).toDateString() === date.toDateString()
                )
              })
            : []

          return (
            <div
              key={idx}
              onClick={() => {
                if (!isTransparent) handleDayClick(day.date)
              }}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-md relative transition",
                isTransparent
                  ? "text-muted-foreground/40 cursor-default"
                  : "text-foreground cursor-pointer hover:bg-accent/10"
              )}
            >
              {day.date}
              {vaccines.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {vaccines.map((v, i) => {
                      const today = new Date()
                      const dataPrevista = v.data_prevista ? new Date(v.data_prevista) : null

                      let colorClass = ""

                      if (v.status === "aplicada") {
                        colorClass = "bg-green-500"
                      } else if (v.status === "pendente" && dataPrevista) {
                        colorClass = dataPrevista < today ? "bg-red-500" : "bg-primary"
                      }

                      return (
                        <span
                          key={i}
                          className={cn("w-1.5 h-1.5 rounded-full", colorClass)}
                        />
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal de detalhes */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? selectedDay.toLocaleDateString() : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedVaccines.length === 0 ? (
              <p>Nenhuma vacina neste dia.</p>
            ) : (
              selectedVaccines.map((v) => (
                <div key={v.id} className="border rounded-md p-2">
                  <p><strong>{v.vacina_nome}</strong> — Dose {v.numero_dose}</p>
                  <p>Status: {v.status}</p>
                  {v.local_aplicacao && <p>Local: {v.local_aplicacao}</p>}
                  {v.profissional && <p>Profissional: {v.profissional}</p>}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-xs pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Agendada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Aplicada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Atrasada</span>
        </div>
      </div>
    </div>
  )
}
