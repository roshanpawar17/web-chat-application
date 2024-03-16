export function formatDate(acdate) {
    const cDate = new Date(acdate)
    return cDate.toLocaleDateString()
}