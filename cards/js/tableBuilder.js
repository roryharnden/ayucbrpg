/**
 * Parses CSV data and builds an HTML table
 * @param {string} csvData - The raw CSV text
 * @returns {HTMLTableElement} - The created table element
 */
export function buildTableFromCSV(csvData) {
  const allRows = csvData.split(/\r?\n|\r/);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  allRows.forEach((row, rowIndex) => {
    if (!row.trim()) return; // Skip empty rows
    
    const tr = document.createElement('tr');
    const cells = row.split(',');
    
    cells.forEach(cell => {
      if (rowIndex === 0) {
        const th = document.createElement('th');
        th.textContent = cell;
        tr.appendChild(th);
      } else {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      }
    });
    
    if (rowIndex === 0) {
      thead.appendChild(tr);
    } else {
      tbody.appendChild(tr);
    }
  });
  
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
} 