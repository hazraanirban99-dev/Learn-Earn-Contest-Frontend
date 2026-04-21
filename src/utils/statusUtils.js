/**
 * Determines the actual status of a contest based on current time and start/end dates.
 * This handles timezone discrepancies by syncing UTC values with local time visuals.
 */
export const getActualStatus = (contest) => {
    if (!contest || !contest.startDate || !contest.endDate) return contest?.status || 'UPCOMING';

    const now = new Date();
    
    // Visual Sync Logic: treat UTC numbers as if they were intended for the user's local timezone.
    const getLocalTime = (dateStr) => {
       const d = new Date(dateStr);
       return new Date(
           d.getUTCFullYear(), 
           d.getUTCMonth(), 
           d.getUTCDate(), 
           d.getUTCHours(), 
           d.getUTCMinutes(), 
           d.getUTCSeconds()
       );
    };

    const start = getLocalTime(contest.startDate);
    const end = getLocalTime(contest.endDate);

    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'ONGOING';
    return 'COMPLETED';
};
