interface DataTableProps {
  columns: string[];
  data: Array<Record<string, string>>;
}

const DataTable = ({ columns, data }: DataTableProps) => (
  <div className="overflow-x-auto bg-[#1F2A37] rounded-lg shadow-lg border border-[#374151]">
    <table className="min-w-full text-sm text-white">
      <thead className="bg-[#111827]">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-6 py-3 text-left font-semibold">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-[#272E3A] transition">
            {columns.map((col) => (
              <td key={col} className="px-6 py-3 border-t border-[#374151]">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable; 