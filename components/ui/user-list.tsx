"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/services/api"

interface User {
  id: number
  nome: string
  email: string
  senha: string
  is_admin: boolean
}

interface Vaccine {
  id: number
  nome: string
  doses: number
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null)
  const [creatingVaccine, setCreatingVaccine] = useState(false)
  const [newVaccine, setNewVaccine] = useState({ nome: "", doses: 1 })

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/usuarios/")
        setUsers(response.data)
      } catch (error) {
        console.error("Erro ao buscar usuários:", error)
      }
    }

    async function fetchVaccines() {
      try {
        const response = await api.get("/vacinas/")
        setVaccines(response.data)
      } catch (error) {
        console.error("Erro ao buscar vacinas:", error)
      }
    }

    fetchVaccines()
    fetchUsers()
  }, [])

  const handleEdit = (user: User) => setEditingUser(user)
  const handleDelete = async (id: number) => {
    await api.delete(`/usuarios/${id}/`)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const handleSave = async () => {
    if (!editingUser) return
    await api.put(`/usuarios/${editingUser.id}/`, editingUser)
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    )
    setEditingUser(null)
  }

  const handleEditVaccine = (vaccine: Vaccine) => setEditingVaccine(vaccine)

  const handleDeleteVaccine = async (id: number) => {
    await api.delete(`/vacinas/${id}/`)
    setVaccines((prev) => prev.filter((v) => v.id !== id))
  }

  const handleSaveVaccine = async () => {
    if (!editingVaccine) return
    await api.put(`/vacinas/${editingVaccine.id}/`, editingVaccine)
    setVaccines((prev) =>
      prev.map((v) => (v.id === editingVaccine.id ? editingVaccine : v))
    )
    setEditingVaccine(null)
  }

  const handleCreateVaccine = async () => {
    try {
      const response = await api.post("/vacinas/", newVaccine)
      setVaccines((prev) => [...prev, response.data])
      setCreatingVaccine(false)
      setNewVaccine({ nome: "", doses: 1 })
    } catch (error) {
      console.error("Erro ao criar vacina:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{user.nome}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>Id: {user.id}</p>
              <p>{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {user.is_admin ? "Administrador" : "Usuário comum"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição de Usuário */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={editingUser?.nome || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser!, nome: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editingUser?.email || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser!, email: e.target.value })
                }
              />
            </div>
            
            <div>
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                onChange={(e) =>
                  setEditingUser({ ...editingUser!, senha: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editingUser?.is_admin || false}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser!,
                    is_admin: e.target.checked,
                  })
                }
              />
              <Label>Administrador?</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================= */}
      {/* Seção de Vacinas */}
      {/* ============================= */}
      <div className="flex items-center justify-between mt-10">
        <h1 className="text-2xl font-bold">Gerenciar Vacinas</h1>
        <Button onClick={() => setCreatingVaccine(true)}>Adicionar Vacina</Button>
      </div>

      <div className="space-y-4">
        {vaccines.map((vaccine) => (
          <Card key={vaccine.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{vaccine.nome}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEditVaccine(vaccine)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteVaccine(vaccine.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>Id: {vaccine.id}</p>
              <p>Doses: {vaccine.doses}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição de Vacina */}
      <Dialog open={!!editingVaccine} onOpenChange={() => setEditingVaccine(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Vacina</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={editingVaccine?.nome || ""}
                onChange={(e) =>
                  setEditingVaccine({ ...editingVaccine!, nome: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Doses</Label>
              <Input
                type="number"
                value={editingVaccine?.doses || ""}
                onChange={(e) =>
                  setEditingVaccine({
                    ...editingVaccine!,
                    doses: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVaccine(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVaccine}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Vacina */}
      <Dialog open={!!creatingVaccine} onOpenChange={() => setCreatingVaccine(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Vacina</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={newVaccine.nome}
                onChange={(e) =>
                  setNewVaccine({ ...newVaccine, nome: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Doses</Label>
              <Input
                type="number"
                value={newVaccine.doses}
                onChange={(e) =>
                  setNewVaccine({
                    ...newVaccine,
                    doses: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatingVaccine(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateVaccine}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )


}
