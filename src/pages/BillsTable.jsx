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
    const loadData = async () => {
      try {
        console.log("API URL:", import.meta.env.VITE_API_URL);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/excel`);

        console.log("Status:", res.status);

        const result = await res.json();

        console.log("Result:", result);

        setData(result.values || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    loadData();
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

  const resetFilters = () => {
    setSearch("");
    setVendor("All Vendors");
    setCardUsed("All Cards");
    setLocation("All Locations");
    setBillBy("All Billers");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="min-h-screen bg-[#F7F6EF] overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#6F8F3D] to-[#D28A28] shadow-xl w-full">
        <div
          className="
        w-full
        max-w-[1900px]
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-5
        flex
        flex-col
        md:flex-row
        justify-between
        items-start
        md:items-center
        gap-4
        "
        >
          <div>
            <h1
              className="
          text-2xl
          sm:text-3xl
          lg:text-4xl
          font-bold
          text-white
          "
            >
              Bharat Bhavan
            </h1>

            <p className="text-[#FDF7E8] text-sm mt-1">
              Bills Management Dashboard
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-white font-semibold">BB Bills Dashboard</p>

            <p className="text-[#FDF7E8] text-sm">Finance Department</p>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div
        className="
      w-full
      max-w-[1900px]
      mx-auto
      px-3
      sm:px-5
      lg:px-8
      mt-6
      "
      >
        {/* REPORTS */}

        <div className="mb-8 w-full">
          <Reports rows={rows} headers={headers} />
        </div>

        {/* FILTER BOX */}

        <div
          className="
        w-full
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-[#D6C68A]
        p-4
        sm:p-6
        mb-8
        "
        >
          <div
            className="
  flex
  justify-between
  items-center
  mb-5
  "
          >
            <h2
              className="
    text-xl
    sm:text-2xl
    font-bold
    text-[#6F8F3D]
    "
            >
              Filter Bills
            </h2>

            <button
              onClick={resetFilters}
              className="
    bg-gradient-to-r
    from-[#CD7D1C]
    to-[#A85F0A]
    text-white
    px-5
    py-2.5
    rounded-xl
    font-semibold
    text-sm
    shadow-md
    hover:shadow-lg
    hover:scale-105
    transition
    duration-300
    "
            >
              Reset Filters
            </button>
          </div>

          <div
            className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
          gap-4
          "
          >
            {/* FROM DATE */}

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
              text-sm
              "
              />
            </div>

            {/* TO DATE */}

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
              text-sm
              "
              />
            </div>

            {/* VENDOR */}

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
              text-sm
              "
              >
                {vendors.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            {/* CARD */}

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
              text-sm
              "
              >
                {cards.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            {/* LOCATION */}

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
              text-sm
              "
              >
                {locations.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            {/* BILL BY */}

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
              text-sm
              "
              >
                {billers.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE ONLY SCROLL */}

        <div
          className="
        w-full
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-[#D6C68A]
        "
        >
          <div className="overflow-x-auto">
            <table
              className="
            min-w-[1200px]
            w-full
            "
            >
              <thead
                className="
              bg-gradient-to-r
              from-[#6F8F3D]
              to-[#D28A28]
              text-white
              "
              >
                <tr>
                  {headers.map((head, index) => (
                    <th
                      key={index}
                      className="
                      px-5
                      py-4
                      text-left
                      text-sm
                      font-semibold
                      whitespace-nowrap
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
                    "
                  >
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        title={cell}
                        className="
                          px-5
                          py-3
                          text-sm
                          text-gray-700
                          whitespace-nowrap
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
    </div>
  );
}

export default BillsTable;
