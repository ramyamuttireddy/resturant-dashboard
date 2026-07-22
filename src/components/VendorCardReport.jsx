import {
  FaCalendarWeek,
  FaCalendarDays,
  FaMoneyBillTrendUp,
  FaWallet,
  FaStore,
  FaCreditCard,
} from "react-icons/fa6";
import { useState } from "react";

function VendorCardReport({ rows = [], headers = [] }) {
  const [vendor, setVendor] = useState("All Vendors");
  const [card, setCard] = useState("All Cards");

  const vendorIndex = headers.indexOf("Vendor");
  const cardIndex = headers.indexOf("Card Used");
  const dateIndex = headers.indexOf("Bill Date");
  const amountIndex = headers.indexOf("Bill Total");

  const convertDate = (value) => {
    if (!value) return null;

    const parts = String(value).trim().split("/");

    if (parts.length !== 3) return null;

    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  const convertAmount = (value) => {
    return (
      Number(
        String(value || "")
          .replace(/,/g, "")
          .replace("₹", "")
          .trim(),
      ) || 0
    );
  };

  const vendors = [
    "All Vendors",
    ...new Set(
      rows.map((row) => String(row[vendorIndex] || "").trim()).filter(Boolean),
    ),
  ];

  const cards = [
    "All Cards",
    ...new Set(
      rows
        .filter(
          (row) =>
            vendor === "All Vendors" ||
            String(row[vendorIndex]).trim() === vendor,
        )
        .map((row) => String(row[cardIndex] || "").trim())
        .filter(Boolean),
    ),
  ];

  const filteredRows = rows.filter((row) => {
    const vendorMatch =
      vendor === "All Vendors" || String(row[vendorIndex]).trim() === vendor;

    const cardMatch =
      card === "All Cards" || String(row[cardIndex]).trim() === card;

    return vendorMatch && cardMatch;
  });

  const today = new Date();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const twoWeekStart = new Date(today);
  twoWeekStart.setDate(today.getDate() - 13);
  twoWeekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  let week = 0;
  let twoWeeks = 0;
  let month = 0;
  let total = 0;

  filteredRows.forEach((row) => {
    const amount = convertAmount(row[amountIndex]);

    const date = convertDate(row[dateIndex]);

    if (!date) return;

    total += amount;

    if (date >= weekStart) week += amount;

    if (date >= twoWeekStart) twoWeeks += amount;

    if (date >= monthStart) month += amount;
  });

  const cardsData = [
    {
      title: "This Week",
      value: week,
      icon: <FaCalendarWeek />,
      color: "from-[#728D3E] to-[#5F7632]",
    },

    {
      title: "Last 2 Weeks",
      value: twoWeeks,
      icon: <FaCalendarDays />,
      color: "from-[#CD7D1C] to-[#A85F0A]",
    },

    {
      title: "This Month",
      value: month,
      icon: <FaMoneyBillTrendUp />,
      color: "from-[#728D3E] to-[#3F5420]",
    },

    {
      title: "Total Spend",
      value: total,
      icon: <FaWallet />,
      color: "from-[#CD7D1C] to-[#8B4E08]",
    },
  ];

  return (
    <div
      className="
w-full
bg-[#F8F5EF]
rounded-3xl
shadow-xl
p-4
sm:p-6
border
border-[#E8D8A8]
overflow-hidden
"
    >
      {/* HEADER */}

      <div
        className="
flex
flex-col
lg:flex-row
justify-between
items-start
lg:items-center
gap-5
mb-6
sm:mb-8
"
      >
        <div className="w-full">
          <h2
            className="
text-2xl
sm:text-3xl
font-bold
text-[#728D3E]
"
          >
            Vendor + Card Expense
          </h2>

          <p
            className="
text-gray-500
mt-2
text-sm
sm:text-base
"
          >
            Track spending by vendor and card
          </p>
        </div>

        {/* FILTERS */}

        <div
          className="
w-full
lg:w-auto
flex
flex-col
sm:flex-row
gap-3
"
        >
          {/* Vendor */}

          <div className="relative w-full sm:w-auto">
            <FaStore
              className="
absolute
left-3
top-1/2
-translate-y-1/2
text-[#728D3E]
"
            />

            <select
              value={vendor}
              onChange={(e) => {
                setVendor(e.target.value);
                setCard("All Cards");
              }}
              className="
w-full
sm:w-[220px]
border
border-[#728D3E]
rounded-xl
pl-10
pr-4
py-3
bg-white
text-sm
sm:text-base
outline-none
focus:ring-2
focus:ring-[#CD7D1C]
"
            >
              {vendors.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Card */}

          <div className="relative w-full sm:w-auto">
            <FaCreditCard
              className="
absolute
left-3
top-1/2
-translate-y-1/2
text-[#CD7D1C]
"
            />

            <select
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="
w-full
sm:w-[220px]
border
border-[#CD7D1C]
rounded-xl
pl-10
pr-4
py-3
bg-white
text-sm
sm:text-base
outline-none
focus:ring-2
focus:ring-[#728D3E]
"
            >
              {cards.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EXPENSE CARDS */}

      <div
        className="
grid
grid-cols-1
xs:grid-cols-2
sm:grid-cols-2
lg:grid-cols-4
gap-4
sm:gap-6
"
      >
        {cardsData.map((item) => (
          <div
            key={item.title}
            className={`
bg-gradient-to-br
${item.color}
rounded-3xl
shadow-xl
p-5
sm:p-6
text-white
hover:-translate-y-1
transition
duration-300
`}
          >
            <div
              className="
flex
justify-between
items-center
gap-3
"
            >
              <p
                className="
text-sm
sm:text-base
opacity-90
"
              >
                {item.title}
              </p>

              <div
                className="
bg-white/20
p-3
rounded-xl
text-xl
sm:text-2xl
shrink-0
"
              >
                {item.icon}
              </div>
            </div>

            <h2
              className="
text-2xl
sm:text-3xl
font-bold
mt-5
break-all
"
            >
              ₹ {item.value.toLocaleString()}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorCardReport;
