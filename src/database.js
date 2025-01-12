import fs from 'node:fs/promises'

const databasePath = new URL('../database.json', import.meta.url);


export class Database {
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8').then(data => {this.#database = JSON.parse(data)
    }). catch(() => {
        this.#persist()
    })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table, search) {
        let data = this.#database[table] ?? []
        
        if (search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    const fieldValue = row[key]
                    if (typeof fieldValue === 'string'){
                        return row[key].toLowerCase().includes(value.toLowerCase())
                    }
                })
            })
        }
        return data
    }


    insert(table, data) {
        const newData = {
            ...data,
            created_at: new Date().toISOString(),
            completed_at: null,
            update_at: new Date().toISOString(),

        }
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(newData)
        } else {
            this.#database[table] = [newData]
        }
        this.#persist()

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        const currentRow = this.#database[table][rowIndex];

        if(rowIndex > -1){
            const updateData = {
                ...currentRow,
                ...data,
                update_at: new Date().toISOString(),
            }
            this.#database[table][rowIndex] = updateData;
            this.#persist()
        }else {
            throw new Error(`Registro com Id ${id} não encontrado no banco de dados`)
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    updateCompleted(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if (rowIndex > -1) {
            const currentRow = this.#database[table][rowIndex];
            const completed_at = currentRow.completed_at === null 
            ? new Date().toISOString() 
            : null;
            this.#database[table][rowIndex] = {
                ...currentRow,
                completed_at
            };
      
            this.#persist(); 
        } else {
          throw new Error(`Registro com Id ${id} não encontrado no banco de dados`);
        }
      }
      
}