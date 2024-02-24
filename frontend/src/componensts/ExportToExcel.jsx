import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    /* custom headers */
    XLSX.utils.sheet_add_aoa(ws, [["Test Case", "Input Data", "Preresquisite","Test Steps","Expected Output","Supported Status"]], { origin: "A1" })
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    // window.saveAs(data, fileName + fileExtension)
  };

  return (
    <button onClick={(e) => exportToCSV(apiData, fileName)}   className="exportBtn">Excel File</button>
  );
};