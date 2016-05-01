# Super simple object DB
module.exports = ->
  db = new Dexie("objects")
  db.version(1).stores
    objects: "id"

  return db
