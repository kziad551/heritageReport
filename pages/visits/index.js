import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const Visits = () => {
  const router = useRouter();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // individual-row loading states
  const [loadingId, setLoadingId] = useState(null);        // delete loading
  const [confirmLoadingId, setConfirmLoadingId] = useState(null); // confirm loading

  // table helpers
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch visits data on component mount
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        // Check if we have cached data
        const cachedData = sessionStorage.getItem('visitsCache');
        const cacheTimestamp = sessionStorage.getItem('visitsCacheTimestamp');
        const cacheAge = Date.now() - parseInt(cacheTimestamp || '0');
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

        // If we have recent cached data, use it immediately
        if (cachedData && cacheAge < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          setVisits(parsedData);
          setLoading(false);
          
          // Still fetch fresh data in background to keep cache updated
          try {
            const res = await fetch("https://heritage.top-wp.com/api/visits");
            if (res.ok) {
              const { data } = await res.json();
              const freshData = data || [];
              setVisits(freshData);
              // Update cache with fresh data
              sessionStorage.setItem('visitsCache', JSON.stringify(freshData));
              sessionStorage.setItem('visitsCacheTimestamp', Date.now().toString());
            }
          } catch (bgError) {
            console.log('Background fetch failed, using cached data');
          }
          return;
        }

        // No valid cache, show loading and fetch data
        setLoading(true);
        const res = await fetch("https://heritage.top-wp.com/api/visits");
        if (!res.ok) throw new Error("Failed to fetch visits");
        const { data } = await res.json();
        const visitsData = data || [];
        
        setVisits(visitsData);
        
        // Cache the data
        sessionStorage.setItem('visitsCache', JSON.stringify(visitsData));
        sessionStorage.setItem('visitsCacheTimestamp', Date.now().toString());
        
      } catch (err) {
        setError(err.message);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

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

      const updatedVisits = visits.filter((v) => v.id !== id);
      setVisits(updatedVisits);
      
      // Update cache with new data
      sessionStorage.setItem('visitsCache', JSON.stringify(updatedVisits));
      sessionStorage.setItem('visitsCacheTimestamp', Date.now().toString());
      
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
      const updatedVisits = visits.map((v) => (v.id === id ? updated : v));
      setVisits(updatedVisits);
      
      // Update cache with new data
      sessionStorage.setItem('visitsCache', JSON.stringify(updatedVisits));
      sessionStorage.setItem('visitsCacheTimestamp', Date.now().toString());
      
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

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading visits...</p>
          </div>
        )}

        {!loading && (
          <>
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
                  <th style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#2c3e50',
                    padding: '12px 8px',
                    backgroundColor: '#e9ecef',
                    border: '1px solid #dee2e6'
                  }}>#</th>
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
                    <td style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#2c3e50',
                      padding: '12px 8px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6'
                    }}>{v.id}</td>
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
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
                gap: '8px'
              }}>
                <button
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    backgroundColor: currentPage === 1 ? '#f8f9fa' : '#ffffff',
                    color: currentPage === 1 ? '#6c757d' : '#007bff',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {"<<"}
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    backgroundColor: currentPage === 1 ? '#f8f9fa' : '#ffffff',
                    color: currentPage === 1 ? '#6c757d' : '#007bff',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {"<"}
                </button>
                
                {/* Page numbers */}
                {(() => {
                  const pageNumbers = [];
                  const startPage = Math.max(1, currentPage - 1);
                  const endPage = Math.min(totalPages, startPage + 2);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(
                      <button
                        key={i}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #dee2e6',
                          backgroundColor: i === currentPage ? '#007bff' : '#ffffff',
                          color: i === currentPage ? 'white' : '#007bff',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: i === currentPage ? 'bold' : '500',
                          fontSize: '14px',
                          minWidth: '40px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setCurrentPage(i)}
                        onMouseEnter={(e) => {
                          if (i !== currentPage) {
                            e.target.style.backgroundColor = '#e9ecef';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (i !== currentPage) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pageNumbers;
                })()}
                
                <button
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#ffffff',
                    color: currentPage === totalPages ? '#6c757d' : '#007bff',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {">"}
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #dee2e6',
                    backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#ffffff',
                    color: currentPage === totalPages ? '#6c757d' : '#007bff',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {">>"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Visits;
