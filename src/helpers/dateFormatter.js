export function dateToString(date, long, includeTime) {
    const lengthType = long ? 'long' : 'short';
    
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', {'month': lengthType});
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', {'weekday': lengthType});
    
    const dateString = `${weekday}, ${month} ${day}, ${year}`;
    
    if(!includeTime) {
        return dateString;
    }
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours === 0 ? 12 : hours;
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    
    return `${dateString} at ${hours}:${paddedMinutes} ${ampm}`;
}
