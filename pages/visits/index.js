import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const Visits = ({ initialVisits }) => {
  const router = useRouter();

  const [visits, setVisits] = useState(initialVisits);
  const [error, setError] = useState(null);

  // individual-row loading states
  const [loadingId, setLoadingId] = useState(null);        // delete loading
  const [confirmLoadingId, setConfirmLoadingId] = useState(null); // confirm loading

  // table helpers
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  /* --------------------------------------------------
   * Handlers
   * -------------------------------------------------- */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(`Delete visit #${id}?`);
    if (!ok) return;

    try {
      setLoadingId(id);
      const res = await fetch(`https://heritage.top-wp.com/api/visits/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete visit");

      setVisits((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmToggle = async (id, newValue) => {
    const ok = window.confirm(
      `Mark visit #${id} as ${newValue ? "confirmed" : "un-confirmed"}?`
    );
    if (!ok) return;

    try {
      setConfirmLoadingId(id);

      const res = await fetch(`https://heritage.top-wp.com/api/visits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { Confirmation: newValue } }),
      });
      if (!res.ok) throw new Error("Failed to update confirmation");

      // Strapi returns the updated entity in res.json()
      const { data: updated } = await res.json();

      // replace the old record in state
      setVisits((prev) =>
        prev.map((v) => (v.id === id ? updated : v))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmLoadingId(null);
    }
  };

  /* --------------------------------------------------
   * Search + pagination
   * -------------------------------------------------- */
  const filteredVisits = visits.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      v.id.toString().includes(q) ||
      v.attributes.user?.toLowerCase().includes(q) ||
      v.attributes.plotNumber?.toLowerCase().includes(q) ||
      v.attributes.visitdate?.toLowerCase().includes(q) ||
      v.attributes.createdAt?.toLowerCase().includes(q)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentRows = filteredVisits.slice(start, start + itemsPerPage);

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>Visits</h1>

        {/* search */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* table */}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Visit Date</th>
              <th>Created</th>
              <th>Plot #</th>
              <th>Confirmed</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.attributes.user}</td>
                <td>{v.attributes.visitdate}</td>
                <td>{v.attributes.createdAt}</td>
                <td>{v.attributes.plotNumber}</td>

                {/* Confirmation checkbox */}
                <td>
                  <input
                    type="checkbox"
                    checked={Boolean(v.attributes.Confirmation)}
                    onChange={() =>
                      handleConfirmToggle(
                        v.id,
                        !Boolean(v.attributes.Confirmation)
                      )
                    }
                    disabled={confirmLoadingId === v.id}
                  />
                </td>

                <td>
                  <Link href={`/visits/${v.id}`}>View</Link>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={loadingId === v.id}
                  >
                    {loadingId === v.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              {"<<"}
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {"<"}
            </button>
            <span>{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {">"}
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              {">>"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visits;

/* --------------------------------------------------
 * Fetch data on each request (SSR)
 * -------------------------------------------------- */
export async function getServerSideProps() {
  try {
    const res = await fetch("https://heritage.top-wp.com/api/visits");
    if (!res.ok) throw new Error("Failed to fetch visits");
    const { data } = await res.json();

    return { props: { initialVisits: data } };
  } catch (err) {
    return { props: { initialVisits: [], error: err.message } };
  }
}
