# Virtual Barber — Backend (Depreciado)

> ⚠️ **Este repositório foi depreciado.**
>
> O projeto foi migrado para uma nova arquitetura. Veja os detalhes abaixo.

---

## O que mudou

Este repositório continha o backend do **Virtual Barber**, construído com **Node.js**, **Express** e **Prisma ORM**, conectado a um banco PostgreSQL próprio.

### Motivo da migração

O projeto foi reestruturado para usar o **Supabase** como solução completa, eliminando a necessidade de um backend separado. O Supabase passou a gerenciar:

-  Banco de dados (PostgreSQL)
-  Autenticação (email/senha e OTP via SMS)
- API REST automática
- Row Level Security (RLS)
- Storage de arquivos (logos, banners, imagens)

### O que foi descartado

- Servidor Express
- Rotas e controllers
- Middleware de autenticação JWT manual
- Prisma ORM e migrations
- Dockerfile

---

## 🔗 Novo repositório

O frontend e a integração com o Supabase estão no novo repositório:

**https://github.com/seu-usuario/virtual-barber-frontend.git**

---

## Banco de dados

A estrutura de tabelas foi completamente reescrita no Supabase com:

- `profiles` — todos os usuários (owner, barber, customer)
- `barbershops` — dados da barbearia
- `addresses` — endereço
- `barbers` — perfil dos barbeiros
- `services` — serviços
- `service_barbers` — relação barbeiro x serviço
- `opening_hours` — horários de funcionamento
- `customers` — clientes
- `appointments` — agendamentos com controle de conflito de horário

---

*Última atualização: Fevereiro de 2026*
