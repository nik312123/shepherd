export function dateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours === 0 ? 12 : hours;
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    
    return `${month}/${day}/${year} at ${hours}:${paddedMinutes} ${ampm}`;
}
