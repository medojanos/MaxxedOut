export default function displayTime(sec, format) {
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    if (!format) {
        return `${days > 0 ? days + 'd ' : ''}${
            hours.toString().padStart(2, '0')
        }:${
            minutes.toString().padStart(2, '0')
        }:${
            seconds.toString().padStart(2, '0')
        }`;
    }

    return format
        .replaceAll('d', days + 'd')
        .replaceAll('h', hours + 'h')
        .replaceAll('m', minutes + 'm')
        .replaceAll('s', seconds + 's');
}