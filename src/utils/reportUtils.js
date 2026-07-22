// src/utils/reportUtils.js

// ------------------------------
// Parse Date (DD/MM/YYYY)
// ------------------------------
export const parseDate = (value) => {
  if (!value) return null;

  const str = String(value).replace(/\s+/g, "");

  const parts = str.split("/");

  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  return new Date(year, month, day);
};

// ------------------------------
// Parse Amount
// ------------------------------
export const parseAmount = (amount) => {
  if (!amount) return 0;

  return Number(
    String(amount)
      .replace(/,/g, "")
      .replace("₹", "")
      .trim()
  ) || 0;
};

// ------------------------------
// Total Amount
// ------------------------------
export const getTotalAmount = (rows, amountIndex) => {
  return rows.reduce(
    (sum, row) => sum + parseAmount(row[amountIndex]),
    0
  );
};

// ------------------------------
// Current Week
// ------------------------------
export const getWeeklyRows = (
  rows,
  dateIndex
) => {

  const today = new Date();

  const firstDay = new Date(today);

  firstDay.setDate(today.getDate() - today.getDay());

  firstDay.setHours(0,0,0,0);

  const lastDay = new Date(firstDay);

  lastDay.setDate(firstDay.getDate() + 6);

  lastDay.setHours(23,59,59,999);

  return rows.filter((row)=>{

      const date=parseDate(row[dateIndex]);

      if(!date) return false;

      return date>=firstDay && date<=lastDay;

  });

};

// ------------------------------
// Last 14 Days
// ------------------------------
export const getLastTwoWeeksRows = (
  rows,
  dateIndex
) => {

  const today=new Date();

  today.setHours(23,59,59,999);

  const from=new Date();

  from.setDate(today.getDate()-13);

  from.setHours(0,0,0,0);

  return rows.filter((row)=>{

      const date=parseDate(row[dateIndex]);

      if(!date) return false;

      return date>=from && date<=today;

  });

};

// ------------------------------
// Current Month
// ------------------------------
export const getMonthlyRows = (
  rows,
  dateIndex
)=>{

  const today=new Date();

  return rows.filter((row)=>{

      const date=parseDate(row[dateIndex]);

      if(!date) return false;

      return(
        date.getMonth()===today.getMonth() &&
        date.getFullYear()===today.getFullYear()
      );

  });

};

// ------------------------------
// Group By Column
// ------------------------------
export const groupByColumn = (
  rows,
  keyIndex,
  amountIndex
)=>{

    const result={};

    rows.forEach((row)=>{

        const key=row[keyIndex] || "Unknown";

        const amount=parseAmount(row[amountIndex]);

        if(!result[key]){

            result[key]=0;

        }

        result[key]+=amount;

    });

    return result;

};

// ------------------------------
// Summary
// ------------------------------
export const getSummary = (
    rows,
    amountIndex
)=>{

    return{

        totalBills:rows.length,

        totalAmount:getTotalAmount(
            rows,
            amountIndex
        )

    };

};

// ------------------------------
// Card Wise
// ------------------------------
export const getCardWiseReport=(
    rows,
    cardIndex,
    amountIndex
)=>{

    return groupByColumn(
        rows,
        cardIndex,
        amountIndex
    );

};

// ------------------------------
// Vendor Wise
// ------------------------------
export const getVendorWiseReport=(
    rows,
    vendorIndex,
    amountIndex
)=>{

    return groupByColumn(
        rows,
        vendorIndex,
        amountIndex
    );

};

// ------------------------------
// Location Wise
// ------------------------------
export const getLocationWiseReport=(
    rows,
    locationIndex,
    amountIndex
)=>{

    return groupByColumn(
        rows,
        locationIndex,
        amountIndex
    );

};

// ------------------------------
// Bill By Wise
// ------------------------------
export const getBillByReport=(
    rows,
    billByIndex,
    amountIndex
)=>{

    return groupByColumn(
        rows,
        billByIndex,
        amountIndex
    );

};

// ------------------------------
// Week Number
// ------------------------------
export const getWeekNumber = (date) => {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  // ISO week
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));

  const yearStart = new Date(d.getFullYear(), 0, 1);

  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// ------------------------------
// Two Week Group Key
// ------------------------------
export const getTwoWeekKey = (date) => {

  const start = new Date(date);

  const day = start.getDate();

  const month = start.getMonth();

  const year = start.getFullYear();


  const period = day <= 15 ? "1-15" : "16-End";


  return `${period} ${month + 1}/${year}`;

};

// ------------------------------
// Month Key
// ------------------------------
export const getMonthKey = (date) => {

  const month = date.toLocaleString("default", {
    month: "long",
  });

  const year = date.getFullYear();

  return `${month} ${year}`;

};