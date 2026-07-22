import { useState } from "react";
import {
  CreditCard,
  CalendarDays,
  CalendarRange,
  Calendar,
  Wallet,
  UserRound,
} from "lucide-react";

function LocationCardReport({ rows = [], headers = [] }) {
  const locationIndex = headers.indexOf("BB Location");
  const cardIndex = headers.indexOf("Card Used");
  const vendorIndex = headers.indexOf("Vendor");

  const dateIndex = headers.indexOf("Bill Date");
  const amountIndex = headers.indexOf("Bill Total");

  const [selectedVendor, setSelectedVendor] = useState({});
  const [selectedCard, setSelectedCard] = useState({});

  // NORMALIZE

  const clean = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase();
  };

  // DATE

  const convertDate = (value) => {
    if (!value) return null;

    const parts = String(value).trim().split("/");

    if (parts.length !== 3) return null;

    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  // AMOUNT

  const amountConvert = (value) => {
    return (
      Number(
        String(value || "")
          .replace(/,/g, "")
          .replace("₹", "")
          .trim(),
      ) || 0
    );
  };

  // CALCULATE

  const calculate = (data) => {
    let week = 0;
    let twoWeek = 0;
    let month = 0;
    let total = 0;

    const today = new Date();

    const weekStart = new Date(today);

    weekStart.setDate(today.getDate() - today.getDay());

    weekStart.setHours(0, 0, 0, 0);

    const twoWeekStart = new Date(today);

    twoWeekStart.setDate(today.getDate() - 13);

    twoWeekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    data.forEach((row) => {
      const amount = amountConvert(row[amountIndex]);

      const date = convertDate(row[dateIndex]);

      if (!date) return;

      total += amount;

      if (date >= weekStart) week += amount;

      if (date >= twoWeekStart) twoWeek += amount;

      if (date >= monthStart) month += amount;
    });

    return {
      week,
      twoWeek,
      month,
      total,
    };
  };

  const locations = [
    {
      name: "Frisco",
    },

    {
      name: "Irving",
    },
  ];

  return (
    <div
      className="
grid
grid-cols-1
xl:grid-cols-2
gap-6
"
    >
      {locations.map((location) => {
        // LOCATION FILTER

        const locationRows = rows.filter(
          (row) => clean(row[locationIndex]) === clean(location.name),
        );

        // AVAILABLE CARDS

        const cards = [
          ...new Map(
            locationRows.map((row) => [clean(row[cardIndex]), row[cardIndex]]),
          ).values(),
        ];

        const activeCard = selectedCard[location.name] || cards[0];

        // CARD FILTER

        const cardRows = locationRows.filter(
          (row) => clean(row[cardIndex]) === clean(activeCard),
        );

        // VENDORS

        const vendors = [
          "All Vendors",

          ...new Set(cardRows.map((row) => row[vendorIndex]).filter(Boolean)),
        ];

        const activeVendor = selectedVendor[location.name] || "All Vendors";

        const finalRows =
          activeVendor === "All Vendors"
            ? cardRows
            : cardRows.filter(
                (row) => clean(row[vendorIndex]) === clean(activeVendor),
              );

        const report = calculate(finalRows);

        return (
          <div
            key={location.name}
            className="
bg-white
rounded-3xl
shadow-xl
p-6
border
border-[#E8D8A8]
"
          >
            {/* HEADER */}

            <div
              className="
flex
justify-between
items-center
mb-6
"
            >
              <div
                className="
flex
gap-3
items-center
"
              >
                <div
                  className="
bg-gradient-to-br
from-[#728D3E]
to-[#5F7632]
text-white
p-3
rounded-xl
shadow-lg
"
                >
                  <CreditCard />
                </div>

                <div>
                  <h2
                    className="
text-3xl
font-bold
text-[#728D3E]
"
                  >
                    {location.name}
                  </h2>

                  <p className="text-[#5B0E12] font-medium mt-1">
                    Card :{" "}
                    <span className="text-[#CD7D1C] font-bold">
                      {activeCard}
                    </span>
                  </p>
                </div>
              </div>

              {/* FILTERS SIDE BY SIDE */}

              <div
                className="
flex
gap-3
"
              >
                <div>
                  <label
                    className="
text-xs
text-gray-500
flex
gap-1
"
                  >
                    <CreditCard size={14} />
                    Card
                  </label>

                  <select
                    value={activeCard}
                    onChange={(e) => {
                      setSelectedCard({
                        ...selectedCard,

                        [location.name]: e.target.value,
                      });

                      setSelectedVendor({
                        ...selectedVendor,

                        [location.name]: "All Vendors",
                      });
                    }}
                    className="
border
rounded-xl
px-3
py-2
w-36
"
                  >
                    {cards.map((card) => (
                      <option key={card}>{card}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="
text-xs
text-gray-500
flex
gap-1
"
                  >
                    <UserRound size={14} />
                    Vendor
                  </label>

                  <select
                    value={activeVendor}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,

                        [location.name]: e.target.value,
                      })
                    }
                    className="
border
rounded-xl
px-3
py-2
w-36
"
                  >
                    {vendors.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CARDS */}

            <div
              className="
grid
grid-cols-2
gap-4
"
            >
              <SummaryCard
                title="This Week"
                value={report.week}
                icon={<CalendarDays />}
              />

              <SummaryCard
                title="Last 2 Weeks"
                value={report.twoWeek}
                icon={<CalendarRange />}
              />

              <SummaryCard
                title="This Month"
                value={report.month}
                icon={<Calendar />}
              />

              <SummaryCard
                title="Total Spend"
                value={report.total}
                icon={<Wallet />}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  const colors = {
    "This Week": "from-[#728D3E] to-[#5F7632]",

    "Last 2 Weeks": "from-[#CD7D1C] to-[#A85F0A]",

    "This Month": "from-[#728D3E] to-[#3F5420]",

    "Total Spend": "from-[#CD7D1C] to-[#8B4E08]",
  };

  return (
    <div
      className={`
bg-gradient-to-br
${colors[title]}
rounded-2xl
p-5
text-white
shadow-lg
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
"
      >
        <p className="text-sm opacity-90">{title}</p>

        <div
          className="
bg-white/20
rounded-lg
p-2
"
        >
          {icon}
        </div>
      </div>

      <h2
        className="
text-2xl
font-bold
mt-4
"
      >
        ₹ {value.toLocaleString()}
      </h2>
    </div>
  );
}

export default LocationCardReport;
