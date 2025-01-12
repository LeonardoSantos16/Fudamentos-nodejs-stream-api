import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          let { search } = req.query
          
          search = search ? decodeURIComponent(search.trim()) : null;
          
          const tasks = database.select('tasks', search ? {
            title: search,
            id: search,
            description: search
          } : null)
    
          return res.end(JSON.stringify(tasks))
        }
      },
      {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          console.log(req.body)
          const { title, description} = req.body
          if (!title || !description) {
            return res.writeHead(400).end('Title and description are required', req.body);
          }
          const task = {
            id: randomUUID(),
            title,
            description,
          }
    
          database.insert('tasks', task)
    
          return res.writeHead(201).end()
        }
      },
      {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
          const { id } = req.params
          const { title, description } = req.body
          let updateDate = {}

          if(title !== undefined){
            updateDate.title = title;
          }
          if(description !== undefined){
            updateDate.description = description;
          }
          database.update('tasks', id, updateDate)
  
          return res.writeHead(204).end()
        }
      },
      {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
          const { id } = req.params
          console.log(id)
          database.updateCompleted('tasks', id)
    
          return res.writeHead(204).end()
        }
      },
      {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
          const { id } = req.params
    
          database.delete('tasks', id)
    
          return res.writeHead(204).end()
        }
      }
]