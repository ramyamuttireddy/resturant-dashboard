function SummaryCards({ rows = [], headers = [] }) {
  const amountIndex = headers.indexOf("Bill Total");

  const totalBills = rows.length;

  const totalAmount = rows.reduce((sum, row) => {
    const value =
      Number(
        String(row[amountIndex] || "")
          .replace(/,/g, "")
          .replace("₹", ""),
      ) || 0;

    return sum + value;
  }, 0);

  const average = totalBills > 0 ? totalAmount / totalBills : 0;

  const highest = rows.reduce((max, row) => {
    const value =
      Number(
        String(row[amountIndex] || "")
          .replace(/,/g, "")
          .replace("₹", ""),
      ) || 0;

    return value > max ? value : max;
  }, 0);

  const cards = [
    {
      title: "Total Bills",
      value: totalBills || 0,
      icon: "🧾",
      bg: "bg-[#5B0E12]",
    },

    {
      title: "Total Amount",
      value: `₹ ${totalAmount.toLocaleString()}`,
      icon: "💰",
      bg: "bg-[#728D3E]",
    },

    {
      title: "Average Bill",
      value: `₹ ${average.toFixed(2)}`,
      icon: "📊",
      bg: "bg-[#CD7D1C]",
    },

    {
      title: "Highest Bill",
      value: `₹ ${highest.toLocaleString()}`,
      icon: "🔥",
      bg: "bg-gray-800",
    },
  ];

  return (
    <div
      className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-5
      mb-6
      "
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
          ${card.bg}
          rounded-2xl
          shadow-xl
          p-6
          text-white
          hover:scale-105
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
            <p
              className="
              text-sm
              opacity-80
            "
            >
              {card.title}
            </p>

            <span
              className="
              text-3xl
            "
            >
              {card.icon}
            </span>
          </div>

          <h2
            className="
            text-3xl
            font-bold
            mt-5
            "
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
