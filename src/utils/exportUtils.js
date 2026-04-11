// ============================================================
// exportUtils.js — Data CSV file e export korar utility
// Admin jodi participant list ba leaderboard download korte chai,
// ei function call korle browser automatically CSV file download dibe.
// ============================================================

import { toast } from 'react-toastify';

/**
 * Jodi ekta array of objects dao, seta CSV file hisebe download hobe.
 * @param {Array} data - Jar theke CSV banabo
 * @param {string} filename - CSV file er naam ki hobe
 */
export const exportToCSV = (data, filename) => {
  // Jodi data na thake, error toast dekhao
  if (!data || !data.length) {
    toast.error("No data available to export.", {
      className: "border-2 border-red-500 !bg-[#fff5f5] font-black text-[10px] tracking-tight uppercase"
    });
    return;
  }

  // Filename theke special character / \\ : * ? " < > | remove kora hocche
  const sanitizedFilename = filename.replace(/[\\/:*?"<>|]/g, '-');

  // Object er keys gulo header hobe (1st row)
  const headers = Object.keys(data[0]);
  
  // CSV content toiri hocche — row by row
  const csvContent = [
    headers.join(','), // Header row — column names
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? "" : row[header];
        // Jodi value e comma thake, quote diye wrap koro
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Browser e download trigger korar jonno Blob toiri korchi
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${sanitizedFilename}.csv`);
  link.style.visibility = 'hidden'; // Invisible anchor tag e click simulate kora hocche
  
  document.body.appendChild(link);
  link.click(); // Programmatically click kore download start kora
  document.body.removeChild(link);
  
  // Download successful hole success toast show koro
  toast.success(`Exported ${sanitizedFilename}.csv successfully!`, {
    className: "border-2 border-[#8cc63f] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase"
  });
};

