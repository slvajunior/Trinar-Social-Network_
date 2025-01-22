import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        location: '', // Adicionado campo location
        profile_picture: null,
        cover_photo: null,
    });

    // Busca os dados do perfil ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado. Faça login novamente.');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormData(response.data);
            } catch (error) {
                console.error('Erro ao buscar perfil:', error);
            }
        };

        fetchProfile();
    }, []);

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Lida com a seleção de arquivos
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0],
        });
    };

    // Envia o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token não encontrado. Faça login novamente.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("first_name", formData.first_name);
            formDataToSend.append("last_name", formData.last_name);
            formDataToSend.append("bio", formData.bio);
            formDataToSend.append("location", formData.location); // Adicionando location

            // Adiciona a foto de perfil (se for um arquivo)
            if (formData.profile_picture instanceof File) {
                formDataToSend.append("profile_picture", formData.profile_picture);
            }

            // Adiciona a foto de capa (se for um arquivo)
            if (formData.cover_photo instanceof File) {
                formDataToSend.append("cover_photo", formData.cover_photo);
            }

            const response = await axios.patch("/api/users/profile/edit/", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Perfil atualizado:", response.data);
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil. Verifique o console para mais detalhes.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nome"
            />
            <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Sobrenome"
            />
            <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Biografia"
            />
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Localidade" // Campo para localidade
            />
            <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
            />
            <input
                type="file"
                name="cover_photo"
                onChange={handleFileChange}
            />
            <button type="submit">Salvar</button>
        </form>
    );
};

export default EditProfile;
