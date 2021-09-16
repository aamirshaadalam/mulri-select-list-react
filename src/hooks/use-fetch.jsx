import { useState, useEffect, useCallback } from "react";

function useFetch(query, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const sendQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${query}&page=${page}`
      );
      setList((prev) => [
            ...new Set([...prev, ...res.data.docs.map((d) => d.title)])
        ]);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [query, page]);

  useEffect(() => {
    sendQuery(query);
  }, [query, sendQuery, page]);

  return { loading, error, list };
}

export default useFetch;
