import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Reports from "./Reports";

function BillsTable() {
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [vendor, setVendor] = useState("All Vendors");
  const [cardUsed, setCardUsed] = useState("All Cards");
  const [location, setLocation] = useState("All Locations");
  const [billBy, setBillBy] = useState("All Billers");

  // NEW DATE RANGE
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const loadData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/excel`)
        .then((res) => res.json())
        .then((result) => {
          setData(result.values || []);
        })
        .catch((err) => console.log(err));
    };

    loadData();

    const interval = setInterval(loadData, 10000);

    return () => clearInterval(interval);
  }, []);

  const headers = data[0] || [];
  const rows = data.slice(1);

  const dateIndex = headers.indexOf("Bill Date");
  const vendorIndex = headers.indexOf("Vendor");
  const cardIndex = headers.indexOf("Card Used");
  const locationIndex = headers.indexOf("BB Location");
  const billByIndex = headers.indexOf("Bill By");

  const vendors = [
    "All Vendors",
    ...new Set(rows.map((row) => row[vendorIndex]).filter(Boolean)),
  ];

  const cards = [
    "All Cards",
    ...new Set(rows.map((row) => row[cardIndex]).filter(Boolean)),
  ];

  const locations = [
    "All Locations",
    ...new Set(rows.map((row) => row[locationIndex]).filter(Boolean)),
  ];

  const billers = [
    "All Billers",
    ...new Set(rows.map((row) => row[billByIndex]).filter(Boolean)),
  ];

  // Convert excel date string to JS Date
  const parseDate = (value) => {
    if (!value) return null;

    // అన్ని spaces remove చేయండి
    const str = String(value).replace(/\s+/g, "");

    // ఇప్పుడు 14/07/2026 అవుతుంది
    const parts = str.split("/");

    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  };

  const filteredRows = rows.filter((row) => {
    const searchMatch = row.some((cell) =>
      String(cell).toLowerCase().includes(search.toLowerCase()),
    );

    const vendorMatch = vendor === "All Vendors" || row[vendorIndex] === vendor;

    const cardMatch =
      cardUsed === "All Cards" ||
      String(row[cardIndex] || "").trim() === String(cardUsed).trim();

    const locationMatch =
      location === "All Locations" || row[locationIndex] === location;

    const billMatch = billBy === "All Billers" || row[billByIndex] === billBy;

    const rowDate = parseDate(row[dateIndex]);

    let dateMatch = true;

    if (fromDate && rowDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);

      dateMatch = dateMatch && rowDate >= from;
    }

    if (toDate && rowDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      dateMatch = dateMatch && rowDate <= to;
    }
    console.log(rows.slice(0, 10).map((row) => row[dateIndex]));
    console.log("Bill Date:", row[dateIndex], "Parsed:", rowDate);

    return (
      searchMatch &&
      vendorMatch &&
      cardMatch &&
      locationMatch &&
      billMatch &&
      dateMatch
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F6EF]">
      {/* Header */}

      <div className="bg-gradient-to-r from-[#6F8F3D] to-[#D28A28] shadow-xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Bharat Bhavan
            </h1>

            <p className="text-[#FDF7E8] text-sm mt-1">
              Bills Management Dashboard
            </p>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold">BB Bills Dashboard</p>

            <p className="text-[#FDF7E8] text-sm">Finance Department</p>
          </div>
        </div>
      </div>

      <div className="max-w-10xl mx-auto px-8 mt-8">
        {/* Reports */}

        <div className="mb-8">
          <Reports rows={rows} headers={headers} />
        </div>

        {/* Filters */}

        <div
          className="
bg-white
rounded-3xl
shadow-xl
border
border-[#D6C68C]
p-6
mb-8
"
        >
          <h2
            className="
text-2xl
font-bold
text-[#6F8F3D]
mb-6
"
          >
            Filter Bills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                Vendor
              </label>

              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              >
                {vendors.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                Card Used
              </label>

              <select
                value={cardUsed}
                onChange={(e) => setCardUsed(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              >
                {cards.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                Location
              </label>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              >
                {locations.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#556B2F] mb-2">
                Bill By
              </label>

              <select
                value={billBy}
                onChange={(e) => setBillBy(e.target.value)}
                className="
w-full
rounded-xl
border
border-[#6F8F3D]
bg-[#FCFCF6]
p-3
outline-none
focus:ring-2
focus:ring-[#D28A28]
"
              >
                {billers.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}

        <div
          className="
bg-white
rounded-3xl
shadow-xl
overflow-hidden
border
border-[#D6C68C]
"
        >
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#6F8F3D] to-[#D28A28] text-white">
              <tr>
                {headers.map((head, index) => (
                  <th
                    key={index}
                    className="
px-6
py-5
text-left
font-semibold
tracking-wide
"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row, index) => (
                <tr
                  key={index}
                  className="
border-b
border-[#ECE6C8]
hover:bg-[#FFF8EB]
transition
duration-200
"
                >
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className="
px-6
py-4
text-gray-700
"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BillsTable;
