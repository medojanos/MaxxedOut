export default function displayTime(sec) {
    const days = Math.floor(sec / 86400);
    const hours = Math.floor(sec % 86400 / 3600);
    const minutes = Math.floor(sec % 3600 / 60);
    const seconds = sec % 60;
    return `${days > 0 ? days.toString() + 'd ' : ''}${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}