import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Power, Shield, Calendar, Users, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-balance">Imunetrack</h1>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Power className="h-4 w-4" />
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
            Mantenha sua saúde em dia com o calendário de vacinação
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Acompanhe todas as vacinas necessárias para cada fase da vida. Receba lembretes e mantenha seu histórico de
            vacinação sempre atualizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/cadastro">
              <Button size="lg" className="w-full sm:w-auto">
                Começar agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Saiba mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Calendário Personalizado</CardTitle>
                <CardDescription>Acompanhe suas vacinas com lembretes automáticos</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Para Toda Família</CardTitle>
                <CardDescription>Gerencie a vacinação de todos os membros da família</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Histórico Completo</CardTitle>
                <CardDescription>Mantenha registro de todas as vacinas aplicadas</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Vaccine Schedule by Age */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-balance">
            Calendário de Vacinação por Faixa Etária
          </h3>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">0-2 anos</span>
                  <span className="text-sm font-normal text-muted-foreground">(Bebês e Primeira Infância)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>BCG</strong> - Ao nascer (dose única)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Hepatite B</strong> - Ao nascer, 2, 4 e 6 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Pentavalente</strong> - 2, 4 e 6 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Poliomielite</strong> - 2, 4, 6 e 15 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Rotavírus</strong> - 2 e 4 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Pneumocócica</strong> - 2, 4 e 12 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Meningocócica C</strong> - 3, 5 e 12 meses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Tríplice Viral (Sarampo, Caxumba, Rubéola)</strong> - 12 meses
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">4-6 anos</span>
                  <span className="text-sm font-normal text-muted-foreground">(Pré-escolar)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>DTP (Tríplice Bacteriana)</strong> - Reforço aos 4 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Tríplice Viral</strong> - Segunda dose aos 4 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Varicela (Catapora)</strong> - Segunda dose aos 4 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Poliomielite</strong> - Reforço aos 4 anos
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">9-14 anos</span>
                  <span className="text-sm font-normal text-muted-foreground">(Adolescentes)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>HPV</strong> - 2 doses (meninas e meninos de 9-14 anos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Meningocócica ACWY</strong> - Dose única aos 11-12 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>dTpa (Tríplice Bacteriana Acelular)</strong> - Reforço
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">20-59 anos</span>
                  <span className="text-sm font-normal text-muted-foreground">(Adultos)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>dT (Dupla Adulto)</strong> - Reforço a cada 10 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Tríplice Viral</strong> - Até 49 anos (se não vacinado)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Hepatite B</strong> - 3 doses (se não vacinado)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Febre Amarela</strong> - Dose única (áreas de risco)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary">60+ anos</span>
                  <span className="text-sm font-normal text-muted-foreground">(Idosos)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Influenza (Gripe)</strong> - Anual
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Pneumocócica 23</strong> - Dose única
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>dT (Dupla Adulto)</strong> - Reforço a cada 10 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Herpes Zóster</strong> - A partir de 50 anos (recomendada)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h3 className="text-3xl font-bold text-balance">Pronto para cuidar da sua saúde?</h3>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty leading-relaxed">
            Crie sua conta gratuitamente e comece a acompanhar seu calendário de vacinação hoje mesmo.
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="mt-4">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Imunetrack. Todos os direitos reservados.</p>
          <p className="mt-2">
            As informações sobre vacinas são baseadas no Calendário Nacional de Vacinação do Ministério da Saúde.
          </p>
        </div>
      </footer>
    </div>
  )
}
