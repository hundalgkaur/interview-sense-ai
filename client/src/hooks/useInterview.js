import { useState } from "react";
import API from "../services/api";

const useInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/interview");
      setInterviews(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  const startNewInterview = async (role, country, experience) => {
    try {
      setLoading(true);
      const { data } = await API.post("/interview/start", {
        role,
        country,
        experience,
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInterviewDetails = async (id) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/interview/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get interview details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitInterviewAnswer = async (id, questionIndex, answer) => {
    try {
      setLoading(true);
      const { data } = await API.post(`/interview/${id}/answer`, {
        questionIndex,
        answer,
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    interviews,
    loading,
    error,
    fetchInterviews,
    startNewInterview,
    getInterviewDetails,
    submitInterviewAnswer,
  };
};

export default useInterview;
