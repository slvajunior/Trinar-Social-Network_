// src/components/UserInfo.jsx
import React from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarAlt,
} from "react-icons/fa";

const UserInfo = ({ user }) => {
  // Função para formatar a data
  const formatarData = (data) => {
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    const dataObj = new Date(data);
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();
    return `Nascido(a) em ${dia} de ${mes} de ${ano}`;
  };

  return (
    <div className="profile-page-header">
      {user.profile_picture ? (
        <img
          src={user.profile_picture}
          alt="Profile"
          className="profile-page-photo"
        />
      ) : (
        <FaUserCircle className="profile-page-default-photo" size={100} />
      )}
      <h1 className="profile-page-name">
        {user.first_name} {user.last_name}
      </h1>
      <p className="profile-page-bio">{user.bio}</p>

      <div className="profile-page-details">
        {user.location && (
          <p className="profile-page-detail">
            <FaMapMarkerAlt /> {user.location}
          </p>
        )}
        {user.birth_date && (
          <p className="profile-page-detail">
            <FaBirthdayCake /> {formatarData(user.birth_date)}
          </p>
        )}
        {user.date_joined && (
          <p className="profile-page-detail">
            <FaCalendarAlt /> Ingressou em{" "}
            {new Date(user.date_joined).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
