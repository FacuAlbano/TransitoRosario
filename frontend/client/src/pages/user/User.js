import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import './User.css';

const User = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setError('');
        alert('Contraseña actualizada exitosamente');
      } else {
        setError(data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="profile-container">
        <h2>Información Personal</h2>
        
        <div className="info-section">
          <div className="info-row">
            <label>Nombre:</label>
            <span>{userData?.nombre || 'No disponible'}</span>
          </div>
          
          <div className="info-row">
            <label>Apellido:</label>
            <span>{userData?.apellido || 'No disponible'}</span>
          </div>
          
          <div className="info-row">
            <label>Usuario:</label>
            <span>{userData?.usuario || 'No disponible'}</span>
          </div>
          
          <div className="info-row">
            <label>Email:</label>
            <span>{userData?.email || 'No disponible'}</span>
          </div>
          
          <div className="info-row">
            <label>Rol:</label>
            <span>{userData?.rol || 'No disponible'}</span>
          </div>
        </div>

        <button 
          className="change-password-button"
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          Cambiar Contraseña
        </button>

        {showChangePassword && (
          <form onSubmit={handleSubmitPassword} className="password-form">
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Contraseña actual"
                required
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nueva contraseña"
                required
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmar nueva contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" className="save-button">
              <FaSave /> Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default User;
