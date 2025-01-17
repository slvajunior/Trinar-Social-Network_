import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePictureUpload from "./ProfilePictureUpload";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser); // Atualiza os dados do usuário após o upload
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Perfil de {user.first_name} {user.last_name}</h1>
      <ProfilePictureUpload user={user} onUpdate={handleUpdate} />
    </div>
  );
};

export default UserProfile;