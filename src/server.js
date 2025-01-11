import http from 'node:http'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { json } from './middlewares/json.js'
import { streamCsvToApi } from '../streams/stream-http-csv.js'
import fs from 'fs/promises'

/*
const popularBD = (async () => {
  const controlFile = './data/population-flag.txt';

  try{
    await fs.access(controlFile)
    console.log('O banco já foi populado anteriormente')
  } catch {
    console.log('Populando o banco de dados...')
    await streamCsvToApi('./popularApi.csv')
    await fs.writeFile(controlFile, 'populated');
    console.log('Banco de dados populado com sucesso.');
  }
  })
*/
const startServer = async () => {
  const server = http.createServer(async (req, res) => {
    const { method, url } = req
    await json(req, res)

    const route = routes.find(route => {
      return route.method === method && route.path.test(url)
    })

    if (route) {
      const routeParams = req.url.match(route.path)

      const { query, ...params } = routeParams.groups

      req.params = params
      req.query = query ? extractQueryParams(query) : {}

      return route.handler(req, res)
    }
    return res.writeHead(404).end()
  })

  server.listen(777, () => {
    console.log('Servidor rodando em http://localhost:777')
  })

}
startServer()
