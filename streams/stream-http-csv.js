import { parse } from "csv-parse";
import fs from "node:fs";
import fsp from "node:fs/promises";

export const streamCsvToApi = async (filePath) => {
  try {
    const readableStream = fs.createReadStream(filePath);
    const parser = parse({ columns: true, delimiter: ';' });
    const stream = readableStream.pipe(parser);

    for await (const record of stream) {
      const { title, description } = record;
      console.log("record", record)
      console.log("title", title)
      console.log("description", description)
      
      try {
  
        const response = await fetch("http://localhost:777/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });

        const responseData = await response.text();
        console.log("Resposta da API:", responseData);
      } catch (error) {
        console.error("Erro ao enviar dados para a API:", error);
      }
    }

  } catch (error) {
    console.error("Erro ao processar o CSV:", error);
  }
};

(async () => {
  const controlFile = './population-flag.txt';

  try{
    await fsp.access(controlFile)
    console.log('O banco já foi populado anteriormente')
  } catch {
    console.log('Populando o banco de dados...')
    await streamCsvToApi('./popularApi.csv')
    await fsp.writeFile(controlFile, 'populated');
    console.log('Banco de dados populado com sucesso.');
  }
})();

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