export const handleDragEnd = (res, array) => {
    if (!res.destination) return
    const items = Array.from(array)
    const [reorderedItem] = items.splice(res.source.index, 1)
    items.splice(res.destination.index, 0, reorderedItem)
    return items
}