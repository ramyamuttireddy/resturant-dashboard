import Charts from "../components/Charts";
import VendorCardReport from "../components/VendorCardReport";
import LocationCardReport from "../components/LocationCardReport";

function Reports({ rows = [], headers = [] }) {
  return (
    <div className="space-y-8">
      {/* VENDOR + CARD SUMMARY */}

      <VendorCardReport rows={rows} headers={headers} />
      <LocationCardReport rows={rows} headers={headers} />

      {/* CHART */}

      <Charts rows={rows} headers={headers} />
    </div>
  );
}

export default Reports;
