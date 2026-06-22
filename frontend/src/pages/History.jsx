import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function History() {

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/history",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="page">

      <h1>Search History</h1>

      <div className="history-list">

        {history.map((item, index) => (

          <div
            className="history-item"
            key={index}
          >

            <h3>{item.keyword}</h3>

            <p>
              {item.searched_at}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default History;