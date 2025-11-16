import axios from 'axios'

// Configure a URL base da API - ajuste conforme necessário
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Cria instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== TIPOS ====================
export interface Usuario {
  id: number
  nome: string
  email: string
  is_admin: boolean
}

export interface Vacina {
  id: number
  nome: string
  doses: number
}

export interface HistoricoVacinal {
  id: number
  usuario_id: number
  vacina_id: number
  vacina_nome: string
  numero_dose: number
  status: 'pendente' | 'aplicada' | 'atrasada' | 'cancelada'
  data_aplicacao?: string
  data_prevista?: string
  lote?: string
  local_aplicacao?: string
  profissional?: string
  observacoes?: string
}

export interface Estatisticas {
  total_doses: number
  doses_aplicadas: number
  doses_pendentes: number
  doses_atrasadas: number
  doses_canceladas: number
  vacinas_completas: number
  vacinas_incompletas: number
  proximas_doses: Array<{
    vacina: string
    dose: number
    data_prevista: string
  }>
}

// ==================== SERVIÇO DE AUTENTICAÇÃO ====================
export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post('/usuarios/login', null, {
        params: { email, senha }
      })
      const Usuario = response.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(Usuario))
      }
      return Usuario
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Erro ao fazer login')
    }
  },

  async register(nome: string, email: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post('/usuarios/', {
        nome,
        email,
        senha
      })
      const Usuario = response.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(Usuario))
      }
      return Usuario
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Erro ao criar conta')
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('Usuario')
    }
  },

  getCurrentUser(): Usuario | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser()
  },
}

// ==================== SERVIÇO DE USUÁRIOS ====================
export const usuarioService = {
  async listarTodos(): Promise<Usuario[]> {
    const response = await api.get('/usuarios/')
    return response.data
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  async atualizar(id: number, dados: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, dados)
    return response.data
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },
}

// ==================== SERVIÇO DE VACINAS ====================
export const vacinaService = {
  async listarTodas(): Promise<Vacina[]> {
    const response = await api.get('/vacinas/')
    return response.data
  },

  async buscarPorId(id: number): Promise<Vacina> {
    const response = await api.get(`/vacinas/${id}`)
    return response.data
  },

  async criar(vacina: Omit<Vacina, 'id'>): Promise<Vacina> {
    const response = await api.post('/vacinas/', vacina)
    return response.data
  },

  async atualizar(id: number, vacina: Partial<Vacina>): Promise<Vacina> {
    const response = await api.put(`/vacinas/${id}`, vacina)
    return response.data
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/vacinas/${id}`)
  },
}

// ==================== SERVIÇO DE HISTÓRICO VACINAL ====================
export const historicoService = {
  async listarPorUsuario(
    usuarioId: number,
    filtros?: {
      ano?: number
      mes?: number
      vacina_id?: number
      status?: string
    }
  ): Promise<HistoricoVacinal[]> {
    const response = await api.get(`/usuarios/${usuarioId}/historico/`, {
      params: filtros
    })
    return response.data
  },

  async buscarPorId(usuarioId: number, historicoId: number): Promise<HistoricoVacinal> {
    const response = await api.get(`/usuarios/${usuarioId}/historico/${historicoId}`)
    return response.data
  },

  async criar(
    usuarioId: number,
    dados: {
      vacina_id: number
      numero_dose: number
      status?: string
      data_aplicacao?: string
      data_prevista?: string
      lote?: string
      local_aplicacao?: string
      profissional?: string
      observacoes?: string
    }
  ): Promise<HistoricoVacinal> {
    const response = await api.post(`/usuarios/${usuarioId}/historico/`, dados)
    return response.data
  },

  async atualizar(
    usuarioId: number,
    historicoId: number,
    dados: Partial<HistoricoVacinal>
  ): Promise<HistoricoVacinal> {
    const response = await api.put(
      `/usuarios/${usuarioId}/historico/${historicoId}`,
      dados
    )
    return response.data
  },

  async marcarComoAplicada(
    usuarioId: number,
    historicoId: number,
    dados: {
      data_aplicacao: string
      lote?: string
      local_aplicacao?: string
      profissional?: string
    }
  ): Promise<HistoricoVacinal> {
    const response = await api.patch(
      `/usuarios/${usuarioId}/historico/${historicoId}/aplicar`,
      dados
    )
    return response.data
  },

  async deletar(usuarioId: number, historicoId: number): Promise<void> {
    await api.delete(`/usuarios/${usuarioId}/historico/${historicoId}`)
  },

  async obterEstatisticas(usuarioId: number): Promise<Estatisticas> {
    const response = await api.get(`/usuarios/${usuarioId}/historico/estatisticas`)
    return response.data
  },
}

export default api