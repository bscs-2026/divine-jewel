// src/lib/dateTimeHelper.ts

// Function to format the date
export const formatDate = (dateString: string, timeZone: string = 'Asia/Manila') => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const parts = new Intl.DateTimeFormat('en-PH', options).formatToParts(date);
    const year = parts.find(part => part.type === 'year')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const day = parts.find(part => part.type === 'day')?.value;
    const hour = parts.find(part => part.type === 'hour')?.value;
    const minute = parts.find(part => part.type === 'minute')?.value;
    const second = parts.find(part => part.type === 'second')?.value;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// Function to format the date in human readable format
export const formatDateHumanReadable = (dateString: string, locale: string = 'en-PH', timeZone: string = 'Asia/Singapore') => {
    return new Date(dateString).toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: timeZone,
    });
};
