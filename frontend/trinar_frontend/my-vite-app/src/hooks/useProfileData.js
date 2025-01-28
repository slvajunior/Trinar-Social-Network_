import { useState, useEffect } from "react";
import axios from "axios";

export const useProfileData = (userId, token) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !token) {
      setError("Informações insuficientes para buscar os dados.");
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data || "Erro ao buscar dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, token]);

  return { profileData, isLoading, error };
};
