export function dateToString(date) {
    const year = date.getFullYear();
    const month = date.toLocaleDateString("en-US", {'month': 'long'});
    const day = date.getDate();
    const weekday = date.toLocaleDateString("en-US", {'weekday': 'long'});
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours === 0 ? 12 : hours;
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    
    return `${weekday}, ${month} ${day}, ${year} at ${hours}:${paddedMinutes} ${ampm}`;
}
