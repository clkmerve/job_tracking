import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken); // Token'ı localStorage'a kaydediyoruz
        message.success('Giriş başarılı!');
        navigate('/projects'); // Başarılı giriş sonrası yönlendirme
      } else {
        message.error('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Giriş işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-box'>
          <img src='argemerkezilogo.png' className='img' alt="logo" />
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="Kullanıcı Adı veya Email"
              name="usernameOrEmail"
              rules={[
                {
                  required: true,
                  message: 'Kullanıcı Adı veya Email Boş Bırakılamaz!',
                },
              ]}
            >
              <Input
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Şifre"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Şifre Alanı Boş Bırakılamaz!',
                },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#018abe]"
                size="large"
              >
                Giriş Yap
              </Button>
            </Form.Item>
            <p>Anasayfa dönmek için <Link to="/"> tıklayın.</Link></p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
