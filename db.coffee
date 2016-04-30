# Exploring the magic of IndexedDB

module.exports = ->
  version = 1
  name = "test"

  request = window.indexedDB.open(name, version)

  request.onupgradeneeded = (event) ->
    db = event.target.result

    # Do table initialization
    objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" })

  p = new Promise (resolve, reject) ->
    request.onsuccess = resolve
    request.onerror = reject
  .then ->
    request.result

  p.then (result) ->
    console.log result

module.exports()
