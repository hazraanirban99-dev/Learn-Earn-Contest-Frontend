import { toast } from 'react-toastify';

/**
 * Utility to export an array of objects to a CSV file.
 * @param {Array} data - Array of objects to export.
 * @param {string} filename - Name of the file to download.
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    toast.error("No data available to export.", {
      className: "border-2 border-red-500 !bg-[#fff5f5] font-black text-[10px] tracking-tight uppercase"
    });
    return;
  }

  // Sanitize filename (remove characters like / \ : * ? " < > | )
  const sanitizedFilename = filename.replace(/[\\/:*?"<>|]/g, '-');

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Create CSV content (handling commas in values)
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? "" : row[header];
        // Enclose in quotes if it contains a comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${sanitizedFilename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`Exported ${sanitizedFilename}.csv successfully!`, {
    className: "border-2 border-[#8cc63f] !bg-[#f8faf6] font-black text-[10px] tracking-tight uppercase"
  });
};
