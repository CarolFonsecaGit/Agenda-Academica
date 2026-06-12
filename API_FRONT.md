_# Guia para integrar o backend

Tema escolhido: **Agenda Acadêmica**, um sistema CRUD para eventos do campus.

## Rotas esperadas

Base usada pelo frontend:

```txt
http://localhost:3000/api/events
```

| Operação | Método | Rota | Descrição |
| --- | --- | --- | --- |
| Listar | GET | `/api/events` | Retorna todos os eventos |
| Cadastrar | POST | `/api/events` | Cria um evento |
| Editar | PUT | `/api/events/:id` | Atualiza um evento |
| Remover | DELETE | `/api/events/:id` | Remove um evento |

## Formato JSON

```json
{
  "id": 1,
  "title": "Oficina de API com Express",
  "date": "2026-06-20",
  "time": "14:00",
  "place": "Laboratório 02",
  "category": "Oficina",
  "seats": 35,
  "description": "Atividade prática para criar rotas, testar requisições e retornar JSON."
}
```

## Observações para o backend

- O `GET /api/events` deve retornar um array.
- O `POST /api/events` deve retornar o evento criado, já com `id`.
- O `PUT /api/events/:id` deve retornar o evento atualizado.
- O `DELETE /api/events/:id` pode retornar status `204` sem corpo.
- Se a API ainda não estiver rodando, o frontend usa `localStorage` automaticamente para demonstração.
