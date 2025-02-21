import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleMapsLoader from '../../components/GoogleMapsLoader/GoogleMapsLoader';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    pais: '',
    codigoPostal: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });

  useEffect(() => {
    initAutocomplete();
  }, []);

  const initAutocomplete = () => {
    const addressInput = document.getElementById('direccion');
    if (window.google && addressInput) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInput);
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        let addressData = {
          direccion: '',
          ciudad: '',
          provincia: '',
          pais: '',
          codigoPostal: ''
        };

        for (const component of place.address_components) {
          const componentType = component.types[0];

          switch (componentType) {
            case 'street_number':
              addressData.direccion = `${component.long_name} ${addressData.direccion}`;
              break;
            case 'route':
              addressData.direccion += component.long_name;
              break;
            case 'locality':
              addressData.ciudad = component.long_name;
              break;
            case 'administrative_area_level_1':
              addressData.provincia = component.long_name;
              break;
            case 'country':
              addressData.pais = component.long_name;
              break;
            case 'postal_code':
              addressData.codigoPostal = component.long_name;
              break;
            default:
              break;
          }
        }

        setFormData(prev => ({
          ...prev,
          ...addressData
        }));
      });
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = 'Solo se permiten letras';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido';
        }
        break;
      case 'usuario':
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Solo letras, números y guiones bajos';
        }
        break;
      case 'password': {
        const validations = {
          length: value.length >= 8,
          uppercase: /[A-Z]/.test(value),
          lowercase: /[a-z]/.test(value),
          number: /[0-9]/.test(value),
          symbol: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };

        if (!validations.length) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!validations.uppercase) {
          error = 'Debe contener al menos una letra mayúscula';
        } else if (!validations.lowercase) {
          error = 'Debe contener al menos una letra minúscula';
        } else if (!validations.number) {
          error = 'Debe contener al menos un número';
        } else if (!validations.symbol) {
          error = 'Debe contener al menos un símbolo especial';
        }
        break;
      }
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
      case 'fechaNacimiento':
        const fecha = new Date(value);
        const hoy = new Date();
        if (fecha >= hoy) {
          error = 'La fecha no puede ser futura';
        }
        break;
      case 'codigoPostal':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten números';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const checkPasswordValidations = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      checkPasswordValidations(value);
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    let newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Cambiamos la ruta y agregamos el formato correcto de fecha
      const dataToSend = {
        ...formData,
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString().split('T')[0]
      };
      delete dataToSend.confirmPassword; // Removemos el campo que no necesitamos enviar

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrors({ submit: data.message || 'Error al registrar usuario' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error de conexión con el servidor' });
    }
  };

  return (
    <GoogleMapsLoader onLoad={initAutocomplete}>
      <div className="register-page">
        <div className="register-container">
          <h1>Registro</h1>
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
                {errors.nombre && <span className="error">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
                {errors.apellido && <span className="error">{errors.apellido}</span>}
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Nombre de Usuario"
                required
              />
              {errors.usuario && <span className="error">{errors.usuario}</span>}
            </div>

            <div className="form-group password-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
              <div className="password-requirements">
                La contraseña debe contener al menos:
                <ul>
                  <li className={passwordValidations.length ? 'valid' : ''}>
                    8 caracteres
                  </li>
                  <li className={passwordValidations.uppercase ? 'valid' : ''}>
                    Una letra mayúscula
                  </li>
                  <li className={passwordValidations.lowercase ? 'valid' : ''}>
                    Una letra minúscula
                  </li>
                  <li className={passwordValidations.number ? 'valid' : ''}>
                    Un número
                  </li>
                  <li className={passwordValidations.symbol ? 'valid' : ''}>
                    Un símbolo especial
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group password-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar Contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
              {errors.fechaNacimiento && <span className="error">{errors.fechaNacimiento}</span>}
            </div>

            <div className="form-group">
              <input
                id="direccion"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  placeholder="Provincia"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  placeholder="País"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  placeholder="Código Postal"
                  required
                />
                {errors.codigoPostal && <span className="error">{errors.codigoPostal}</span>}
              </div>
            </div>

            <button type="submit" className="register-button">
              Registrarse
            </button>
          </form>
          <div className="login-link">
            ¿Ya tienes una cuenta?{' '}
            <button onClick={() => navigate('/login')}>
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>
    </GoogleMapsLoader>
  );
};

export default Register;
