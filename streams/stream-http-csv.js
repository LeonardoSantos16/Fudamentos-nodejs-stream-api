import { parse } from "csv-parse";
import { Readable } from 'node:stream'
import fs from 'node:fs'

const streamCsvToApi = async (filePath) => {
    const readableStream = fs.createReadStream(filePath)
    const parser = parse({columns:true})
    const stream = readableStream.pipe(parser)
    for await (const record of stream){
        const {title, description} = record
        try{
            fetch('http://localhost:777/tasks', {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({ title, description }),
            }).then(res => {
                return res.text()
            }).then(data => {
                console.log(data)
            })
        } catch (error){
            console.log(error)
        }
    }
}

streamCsvToApi('./popularApi.csv')

/*
class CsvReadableStream extends Readable {
    constructor(data) {
        super();
        this.data = data; 
        this.index = 0; 
      }
    

    _read() {
      const i = this.index++
        if(this.index < this.data.length) {
            const chunk = this.data[this.index++]
            this.push(chunk)
        } else {
            this.push(null)
        }
    }
}
*/