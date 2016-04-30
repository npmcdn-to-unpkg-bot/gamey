error = console.error.bind(console)
log = console.log.bind(console)

db = new Dexie("test")
db.version(1).stores
  friends: "++id,name,age"
  gameSessions: "id,score"

db.open()
.then log
.catch error
