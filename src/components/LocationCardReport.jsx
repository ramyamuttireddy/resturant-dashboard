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
    w-full
    grid
    grid-cols-1
    xl:grid-cols-2
    gap-4
    sm:gap-6
    "
    >
      {locations.map((location) => {
        const locationRows = rows.filter(
          (row) => clean(row[locationIndex]) === clean(location.name),
        );

        const cards = [
          ...new Map(
            locationRows.map((row) => [clean(row[cardIndex]), row[cardIndex]]),
          ).values(),
        ];

        const activeCard = selectedCard[location.name] || cards[0];

        const cardRows = locationRows.filter(
          (row) => clean(row[cardIndex]) === clean(activeCard),
        );

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
          w-full
          bg-white
          rounded-3xl
          shadow-xl
          p-4
          sm:p-6
          border
          border-[#E8D8A8]
          "
          >
            {/* HEADER */}

            <div
              className="
            flex
            flex-col
            lg:flex-row
            justify-between
            gap-5
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
                shrink-0
                "
                >
                  <CreditCard />
                </div>

                <div>
                  <h2
                    className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[#728D3E]
                  "
                  >
                    {location.name}
                  </h2>

                  <p
                    className="
                  text-[#5B0E12]
                  font-medium
                  mt-1
                  text-sm
                  sm:text-base
                  "
                  >
                    Card :
                    <span className="text-[#CD7D1C] font-bold ml-1">
                      {activeCard}
                    </span>
                  </p>
                </div>
              </div>

              {/* FILTERS */}

              <div
                className="
              flex
              flex-col
              sm:flex-row
              gap-3
              w-full
              lg:w-auto
              "
              >
                {/* CARD SELECT */}

                <div className="w-full sm:w-auto">
                  <label
                    className="
                  text-xs
                  text-gray-500
                  flex
                  gap-1
                  mb-1
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
                  w-full
                  sm:w-36
                  border
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  outline-none
                  "
                  >
                    {cards.map((card) => (
                      <option key={card}>{card}</option>
                    ))}
                  </select>
                </div>

                {/* VENDOR SELECT */}

                <div className="w-full sm:w-auto">
                  <label
                    className="
                  text-xs
                  text-gray-500
                  flex
                  gap-1
                  mb-1
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
                  w-full
                  sm:w-36
                  border
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  outline-none
                  "
                  >
                    {vendors.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SUMMARY CARDS */}

            <div
              className="
            grid
            grid-cols-1
            sm:grid-cols-2
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
    p-4
    sm:p-5
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
          {title}
        </p>

        <div
          className="
        bg-white/20
        rounded-lg
        p-2
        shrink-0
        "
        >
          {icon}
        </div>
      </div>

      <h2
        className="
      text-xl
      sm:text-2xl
      font-bold
      mt-4
      break-all
      "
      >
        ₹ {value.toLocaleString()}
      </h2>
    </div>
  );
}

export default LocationCardReport;
