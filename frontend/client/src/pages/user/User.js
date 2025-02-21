import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import './User.css';

const User = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
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
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        throw new Error('No autorizado');
      }
    } catch (error) {
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

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
    return <div className="user-page loading">Cargando...</div>;
  }

  if (!userData) {
    return (
      <div className="user-page">
        <div className="user-container not-logged">
          <div className="not-logged-content">
            <FaExclamationCircle className="not-logged-icon" />
            <h2>No has iniciado sesión</h2>
            <p>Para ver tu perfil, necesitas iniciar sesión primero.</p>
            <div className="auth-buttons">
              <button onClick={() => navigate('/login')} className="login-redirect">
                Iniciar Sesión
              </button>
              <button onClick={() => navigate('/register')} className="register-redirect">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <h1>Perfil de Usuario</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {userData && (
          <div className="user-info-container">
            <div className="user-info-section">
              <h2>Información Personal</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{userData.nombre}</span>
                </div>
                <div className="info-item">
                  <label>Apellido:</label>
                  <span>{userData.apellido}</span>
                </div>
                <div className="info-item">
                  <label>Usuario:</label>
                  <span>{userData.usuario}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userData.email}</span>
                </div>
                <div className="info-item">
                  <label>Rol:</label>
                  <span>{userData.rol}</span>
                </div>
              </div>
            </div>

            <div className="password-section">
              <button 
                className="change-password-button"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? (
                  <>
                    <FaTimes /> Cancelar
                  </>
                ) : (
                  <>
                    <FaEdit /> Cambiar Contraseña
                  </>
                )}
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
        )}
      </div>
    </div>
  );
};

export default User;
