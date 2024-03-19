export const parseHTMLTable = (doc: Document) => {
  if (!doc) {
    return [];
  }
  const table = doc.getElementsByTagName("table").item(0);
  const rows = table?.getElementsByTagName("tr");
  const rowsArray = [];
  if (rows) {
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i]?.childNodes;
      const cellsArray = [];
      if (cells) {
        for (let j = 0; j < cells.length; j++) {
          cellsArray.push(cells[j].textContent);
        }
      }
      rowsArray.push(cellsArray);
    }
  }
  return rowsArray;
};
