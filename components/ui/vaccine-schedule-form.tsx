"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, AlertCircle, Loader2 } from "lucide-react"
import { vacinaService, historicoService, type Vacina } from "@/services/api"

interface VaccineScheduleFormProps {
  usuarioId: number;
  onSchedule?: () => void;
}

export function VaccineScheduleForm({ usuarioId, onSchedule }: VaccineScheduleFormProps) {
  const [vaccines, setVaccines] = useState<Vacina[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    vacina_id: '',
    numero_dose: '1',
    data_prevista: '',
    local_aplicacao: '',
    observacoes: '',
  })

  // Carregar vacinas disponíveis
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true)
        const data = await vacinaService.listarTodas()
        setVaccines(data)
      } catch (err) {
        console.error('Erro ao buscar vacinas:', err)
        setError('Erro ao carregar vacinas disponíveis')
      } finally {
        setLoading(false)
      }
    }

    fetchVaccines()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.vacina_id || !formData.data_prevista) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await historicoService.criar(usuarioId, {
        vacina_id: parseInt(formData.vacina_id),
        numero_dose: parseInt(formData.numero_dose),
        status: 'pendente',
        data_prevista: formData.data_prevista || undefined,
        local_aplicacao: formData.local_aplicacao || undefined,
        observacoes: formData.observacoes || undefined,
      })

      setSubmitted(true)
      onSchedule?.()

      // Reset form após 2 segundos
      setTimeout(() => {
        setFormData({
          vacina_id: '',
          numero_dose: '1',
          data_prevista: '',
          local_aplicacao: '',
          observacoes: '',
        })
        setSubmitted(false)
      }, 2000)
    } catch (err: any) {
      console.error('Erro ao agendar vacina:', err)
      setError(err.response?.data?.detail || 'Erro ao agendar vacina. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const selectedVaccine = vaccines.find(v => v.id === parseInt(formData.vacina_id))

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Agendar Nova Vacina
        </CardTitle>
        <CardDescription>Preencha os dados abaixo para agendar uma vacina</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-accent">Vacina agendada com sucesso!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Você receberá uma notificação próximo à data agendada.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Vaccine Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Selecione a Vacina <span className="text-destructive">*</span>
              </label>
              <select
                name="vacina_id"
                value={formData.vacina_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">-- Escolha uma vacina --</option>
                {vaccines.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.nome} ({vaccine.doses} dose{vaccine.doses > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Dose Number */}
            {selectedVaccine && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Número da Dose <span className="text-destructive">*</span>
                </label>
                <select
                  name="numero_dose"
                  value={formData.numero_dose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {Array.from({ length: selectedVaccine.doses }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Dose {num}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Data Prevista <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                name="data_prevista"
                value={formData.data_prevista}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Location Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Local do Agendamento
              </label>
              <input
                type="text"
                name="local_aplicacao"
                placeholder="Ex: Clínica XYZ, Posto de Saúde, etc..."
                value={formData.local_aplicacao}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Observações (Opcional)</label>
              <textarea
                name="observacoes"
                placeholder="Adicione qualquer informação importante..."
                value={formData.observacoes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}