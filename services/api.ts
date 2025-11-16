import axios from 'axios';

// ----------------------------------------------------
// 🚨 CORREÇÃO DE URLS AQUI 🚨
//
// Certifique-se de que estas variáveis de ambiente (NEXT_PUBLIC_AUTH_URL, 
// NEXT_PUBLIC_MAIN_API_URL) estão configuradas corretamente no seu
// ambiente de deploy (Render, Vercel, etc.)
//
// Usamos a mesma URL principal para todos os demais serviços (Vacina, Histórico, etc.).
// ----------------------------------------------------

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL;
const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL;

// Cria a instância do axios para o SERVIÇO PRINCIPAL (Vacinas, Histórico, etc.)
const mainApi = axios.create({
  baseURL: MAIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cria a instância do axios para o SERVIÇO DE AUTENTICAÇÃO (Login, Registro)
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros de autenticação no API Principal
mainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== TIPOS ====================
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  is_admin: boolean;
  token?: string; // Adicionado token, já que login o retorna
}

export interface Vacina {
  id: number;
  nome: string;
  doses: number;
}

export interface HistoricoVacinal {
  id: number;
  usuario_id: number;
  vacina_id: number;
  vacina_nome: string;
  numero_dose: number;
  status: 'pendente' | 'aplicada' | 'atrasada' | 'cancelada';
  data_aplicacao?: string;
  data_prevista?: string;
  lote?: string;
  local_aplicacao?: string;
  profissional?: string;
  observacoes?: string;
}

export interface Estatisticas {
  total_doses: number;
  doses_aplicadas: number;
  doses_pendentes: number;
  doses_atrasadas: number;
  doses_canceladas: number;
  vacinas_completas: number;
  vacinas_incompletas: number;
  proximas_doses: Array<{
    vacina: string;
    dose: number;
    data_prevista: string;
  }>;
}

// ==================== Interceptor de Token para API Principal ====================
mainApi.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user: Usuario = JSON.parse(userStr);
    if (user.token) {
      // 🚨 Garante que o token é enviado no header Authorization: Bearer
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// ==================== SERVIÇO DE AUTENTICAÇÃO ====================
export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      // 🚨 Login usa o authApi e envia no body do POST (FastAPI padrão)
      const response = await authApi.post('/auth/login', { email, senha });
      
      const UsuarioData = response.data;
      if (typeof window !== 'undefined') {
        // Assume que o token é retornado no corpo, junto com os dados do usuário
        localStorage.setItem('user', JSON.stringify(UsuarioData));
      }
      return UsuarioData;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Erro ao fazer login');
    }
  },

  async register(nome: string, email: string, senha: string): Promise<Usuario> {
    try {
      // Registro usa o authApi e envia no body do POST
      const response = await authApi.post('/auth/register', {
      nome,
      email,
      senha,
    });
      const UsuarioData = response.data;
      if (typeof window !== 'undefined') {
        // Registro bem-sucedido pode ou não retornar o token, mas salvamos os dados
        localStorage.setItem('user', JSON.stringify(UsuarioData)); 
      }
      return UsuarioData;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Erro ao criar conta');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user'); // Corrigido para 'user'
      window.location.href = '/login';
    }
  },

  getCurrentUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};

// ==================== SERVIÇO DE USUÁRIOS ====================
// Usará o mainApi, assumindo que são rotas protegidas
export const usuarioService = {
  async listarTodos(): Promise<Usuario[]> {
    const response = await mainApi.get('/usuarios/');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await mainApi.get(`/usuarios/${id}`);
    return response.data;
  },

  async atualizar(id: number, dados: Partial<Usuario>): Promise<Usuario> {
    const response = await mainApi.put(`/usuarios/${id}`, dados);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await mainApi.delete(`/usuarios/${id}`);
  },
};

// ==================== SERVIÇO DE VACINAS ====================
// Usará o mainApi
export const vacinaService = {
  async listarTodas(): Promise<Vacina[]> {
    const response = await mainApi.get('/vacinas/');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Vacina> {
    const response = await mainApi.get(`/vacinas/${id}`);
    return response.data;
  },

  async criar(vacina: Omit<Vacina, 'id'>): Promise<Vacina> {
    const response = await mainApi.post('/vacinas/', vacina);
    return response.data;
  },

  async atualizar(id: number, vacina: Partial<Vacina>): Promise<Vacina> {
    const response = await mainApi.put(`/vacinas/${id}`, vacina);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await mainApi.delete(`/vacinas/${id}`);
  },
};

// ==================== SERVIÇO DE HISTÓRICO VACINAL ====================
// Usará o mainApi
export const historicoService = {
  async listarPorUsuario(
    usuarioId: number,
    filtros?: {
      ano?: number;
      mes?: number;
      vacina_id?: number;
      status?: string;
    }
  ): Promise<HistoricoVacinal[]> {
    const response = await mainApi.get(`/usuarios/${usuarioId}/historico/`, {
      params: filtros,
    });
    return response.data;
  },

  async buscarPorId(usuarioId: number, historicoId: number): Promise<HistoricoVacinal> {
    const response = await mainApi.get(`/usuarios/${usuarioId}/historico/${historicoId}`);
    return response.data;
  },

  async criar(
    usuarioId: number,
    dados: {
      vacina_id: number;
      numero_dose: number;
      status?: string;
      data_aplicacao?: string;
      data_prevista?: string;
      lote?: string;
      local_aplicacao?: string;
      profissional?: string;
      observacoes?: string;
    }
  ): Promise<HistoricoVacinal> {
    const response = await mainApi.post(`/usuarios/${usuarioId}/historico/`, dados);
    return response.data;
  },

  async atualizar(
    usuarioId: number,
    historicoId: number,
    dados: Partial<HistoricoVacinal>
  ): Promise<HistoricoVacinal> {
    const response = await mainApi.put(
      `/usuarios/${usuarioId}/historico/${historicoId}`,
      dados
    );
    return response.data;
  },

  async marcarComoAplicada(
    usuarioId: number,
    historicoId: number,
    dados: {
      data_aplicacao: string;
      lote?: string;
      local_aplicacao?: string;
      profissional?: string;
    }
  ): Promise<HistoricoVacinal> {
    const response = await mainApi.patch(
      `/usuarios/${usuarioId}/historico/${historicoId}/aplicar`,
      dados
    );
    return response.data;
  },

  async deletar(usuarioId: number, historicoId: number): Promise<void> {
    await mainApi.delete(`/usuarios/${usuarioId}/historico/${historicoId}`);
  },

  async obterEstatisticas(usuarioId: number): Promise<Estatisticas> {
    const response = await mainApi.get(`/usuarios/${usuarioId}/historico/estatisticas`);
    return response.data;
  },
};

export default mainApi;
