// ============================================================
// dateUtils.js — Date format korar jonno global utility
// Puro project e date dekhানোর format ek rakha hoyeche: DD/MM/YYYY
// Jemon: 05/04/2025 — ekhane sob jaygay ei function call kora hoy.
// ============================================================

/**
 * Jodi kono ekta date input dao, seta DD/MM/YYYY format e return korbe.
 * @param {string|Date} dateInput - Format korte chai jei date ta
 * @returns {string} - Format kora date string, nahole original return
 */
export const formatDateDDMMYYYY = (dateInput) => {
    // Jodi kono date dewa na hoy, empty string return koro
    if (!dateInput) return '';
    
    const d = new Date(dateInput);
    
    // Jodi date invalid hole (NaN), original input return koro
    if (isNaN(d.getTime())) return dateInput;
    
    // Din, mash, bochor alada kore niyo
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() 0 theke start hoy tai +1
    const year = d.getFullYear();
    
    // DD/MM/YYYY format e return koro
    return `${day}/${month}/${year}`;
};

