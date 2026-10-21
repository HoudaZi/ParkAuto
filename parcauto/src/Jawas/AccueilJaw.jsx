import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderJawaz from "./HeaderJawaz";
import JawazStatsAndToolbar from "./JawazStatsAndToolbar";
import JawazTable from "./JawazTable";
import JawazFooter from "./JawazFooter";

export default function EspaceJawaz() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10; // 10 matricules par page

  const fetchJawazData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/jawaz/");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données Jawaz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJawazData();
  }, []);

  const filteredTransactions = transactions.filter((item) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    const immat = item.immatriculation ? String(item.immatriculation).toLowerCase() : "";
    return immat.includes(search);
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleResetSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid px-4 py-3" style={{ backgroundColor: "#f8fcf9", minHeight: "100vh" }}>
      <HeaderJawaz transactions={filteredTransactions} />

      <JawazStatsAndToolbar
        stats={{
          totalPassages: transactions.length,
          totalConsomme: 2720,
          soldeRestant: 5850,
        }}
        searchTerm={searchTerm}
        onSearchChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        onResetSearch={handleResetSearch}
        onDataImported={fetchJawazData}
      />

      <JawazTable
        transactions={currentTransactions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <JawazFooter />
    </div>
  );
}