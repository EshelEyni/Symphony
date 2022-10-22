export const storageService = {
    loadFromStorage,
    saveToStorage
}

function saveToStorage(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}