import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message 
} from 'antd';
import Modal from 'react-modal';
import './UserCreate.css'; 

const { Option } = Select;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');

const User = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profession:'',
    isAdmin: '',
    isActive: '',
    date: ''
  });

  const [professions, setProfessions] = useState([]); // Meslek seçeneklerini tutmak için state

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/professions', {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const professionData = await response.json();
      setProfessions(professionData);
    } catch (error) {
      console.error('Error fetching professions:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date, dateString) => {
    setFormData({
        ...formData,
        date: dateString // Tarihi string formatında güncelle
    });
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    
     if (Object.keys(formData).every((key) => formData[key] !== '')) {
      try {
        const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
        const selectedProfession = professions.find(
          (profession) => profession.profession === formData.profession
        );
        const dataToSend = { ...formData, profession: selectedProfession }; // Seçilen mesleği ekledim
        const response = await fetch('http://localhost:8080/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        await response.json();
        message.success('Kullanıcı eklendi');
        closeModal();
        window.location.reload(); // Sayfayı yenile
      } catch (error) {
        console.error('Kullanıcı ekleme hatası:', error);
        message.error('Bağlantı Yok');
      }
    } else {
      message.warning('Lütfen tüm alanları doldurun');
    }
  };

  const subtitle = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.current.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16  }}>
      <h1 style={{  marginLeft: "20px", color: "#02457A",fontSize:"30px" }}>Kullanıcılar</h1>
      <Button style={{marginRight:"10px"}} type="primary" onClick={openModal}>
        Kullanıcı Ekle
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={subtitle} style={{ color: 'blue', fontSize: '20px' }}></h2>
        <Form>
          <Form.Item label="İsim" className="custom-form-item">
            <Input name="firstName" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Soy İsim" className="custom-form-item">
            <Input name="lastName" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Email" className="custom-form-item">
            <Input name="email" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Meslek" className="custom-form-item">
            <Select
              name="profession"
              onChange={(value) => setFormData({ ...formData, profession: value })}
            >
              {professions.map(profession => (
                <Option key={profession.id} value={profession.profession}>
                  {profession.profession}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="isAdmin" className="custom-form-item">
            <Select name="isAdmin" onChange={value => setFormData({ ...formData, isAdmin: value })}>
              <Option value={true}>YES</Option>
              <Option value={false}>NO</Option>
            </Select>
          </Form.Item>
          <Form.Item label="isActive" className="custom-form-item">
            <Select name="isActive" placeholder="Seçiniz" onChange={value => setFormData({ ...formData, isActive: value })}>
              <Option value={true}>Aktif</Option>
              <Option value={false}>Pasif</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tarih" className="custom-form-item">
            <DatePicker onChange={handleDateChange} /> {/* Tarihi burada düzgün formatla alın */}
          </Form.Item>
          <Form.Item>
            <Button style={{marginRight:"20px", marginLeft:"150px"}} type="primary" htmlType="submit" onClick={handleSubmit}>Kaydet</Button>
            <Button onClick={closeModal}>Kapat</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default User;
