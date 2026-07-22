import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Charts({ rows = [], headers = [] }) {
  if (!rows.length) return null;

  const dateIndex = headers.indexOf("Bill Date");
  const amountIndex = headers.indexOf("Bill Total");
  const cardIndex = headers.indexOf("Card Used");
  const locationIndex = headers.indexOf("BB Location");
  const vendorIndex = headers.indexOf("Vendor");

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

  const parseDate = (value) => {
    if (!value) return null;

    const parts = String(value).trim().split("/");

    if (parts.length !== 3) return null;

    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  // =========================
  // WEEKLY REPORT
  // =========================

  const weekly = {};

  rows.forEach((row) => {
    const date = parseDate(row[dateIndex]);

    if (!date) return;

    const week = `Week ${Math.ceil(date.getDate() / 7)}`;

    weekly[week] = (weekly[week] || 0) + amountConvert(row[amountIndex]);
  });

  const weeklyData = Object.entries(weekly).map(([name, amount]) => ({
    name,
    amount,
  }));

  // =========================
  // CARD REPORT
  // =========================

  const card = {};

  rows.forEach((row) => {
    const name = String(row[cardIndex] || "").trim();

    if (!name) return;

    card[name] = (card[name] || 0) + amountConvert(row[amountIndex]);
  });

  const cardData = Object.entries(card).map(([name, value]) => ({
    name,
    value,
  }));

  // =========================
  // LOCATION REPORT
  // =========================

  const location = {};

  rows.forEach((row) => {
    const name = String(row[locationIndex] || "").trim();

    if (!name) return;

    location[name] = (location[name] || 0) + amountConvert(row[amountIndex]);
  });

  const locationData = Object.entries(location).map(([name, value]) => ({
    name,
    value,
  }));

  // =========================
  // VENDOR REPORT
  // =========================

  const vendor = {};

  rows.forEach((row) => {
    const name = String(row[vendorIndex] || "").trim();

    if (!name) return;

    vendor[name] = (vendor[name] || 0) + amountConvert(row[amountIndex]);
  });

  const vendorData = Object.entries(vendor)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 15);

  // LOCATION COLORS

  const locationColors = [
    "#728D3E",
    "#CD7D1C",
    "#5B0E12",
    "#00897B",
    "#7B1FA2",
    "#1565C0",
  ];

  return (
    <div className="space-y-8 w-full overflow-hidden">
      {/* TOP CHARTS */}

      <div
        className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-6
      "
      >
        {/* WEEKLY */}

        <div
          className="
        bg-white
        rounded-3xl
        shadow-xl
        p-5
        xl:p-8
        border
        border-[#728D3E]/30
        "
        >
          <h2
            className="
          text-xl
          xl:text-2xl
          font-bold
          text-[#5B0E12]
          mb-6
          "
          >
            Weekly Spending
          </h2>

          <div className="w-full h-[300px] xl:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 14,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 14,
                  }}
                />

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "14px",
                  }}
                />

                <Bar dataKey="amount" fill="#728D3E" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD PIE */}

        <div
          className="
        bg-white
        rounded-3xl
        shadow-xl
        p-5
        xl:p-8
        border
        border-[#CD7D1C]/30
        "
        >
          <h2
            className="
          text-xl
          xl:text-2xl
          font-bold
          text-[#5B0E12]
          mb-6
          "
          >
            Card Wise Spending
          </h2>

          <div className="w-full h-[300px] xl:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cardData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {cardData.map((item, index) => (
                    <Cell
                      key={index}
                      fill={["#728D3E", "#CD7D1C", "#5B0E12"][index % 3]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOCATION */}

        <div
          className="
        bg-white
        rounded-3xl
        shadow-xl
        p-5
        xl:p-8
        border
        border-[#728D3E]/30
        "
        >
          <h2
            className="
          text-xl
          xl:text-2xl
          font-bold
          text-[#5B0E12]
          mb-6
          "
          >
            Location Wise Spending
          </h2>

          <div className="w-full h-[300px] xl:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 14,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 14,
                  }}
                />

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "14px",
                  }}
                />

                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {locationData.map((item, index) => (
                    <Cell
                      key={index}
                      fill={locationColors[index % locationColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* VENDOR CHART */}

      <div
        className="
      bg-white
      rounded-3xl
      shadow-xl
      p-5
      xl:p-8
      border
      border-[#CD7D1C]/30
      "
      >
        <h2
          className="
      text-2xl
      xl:text-3xl
      font-bold
      text-[#5B0E12]
      mb-6
      "
        >
          Vendor Spending
        </h2>

        <div className="w-full h-[400px] xl:h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendorData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                height={120}
                tick={{
                  fontSize: 14,
                }}
              />

              <YAxis
                tick={{
                  fontSize: 14,
                }}
              />

              <Tooltip />

              <Legend
                wrapperStyle={{
                  fontSize: "15px",
                }}
              />

              <Bar dataKey="amount" fill="#CD7D1C" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;
