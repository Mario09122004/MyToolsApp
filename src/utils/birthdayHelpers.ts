/**
 * Formats a timestamp into a friendly Spanish date string like "16 de septiembre".
 */
export const formatBirthdayDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = monthNames[date.getMonth()];
    return `${day} de ${month}`;
};

/**
 * Calculates the age of a person given their birth date timestamp.
 */
export const calculateAge = (timestamp: number): number => {
    const today = new Date();
    const birthDate = new Date(timestamp);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

/**
 * Calculates the number of days remaining until the next occurrence of the birthday.
 * Returns 0 if the birthday is today.
 */
export const calculateRemainingDays = (timestamp: number): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const birthDate = new Date(timestamp);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    nextBirthday.setHours(0, 0, 0, 0);
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
