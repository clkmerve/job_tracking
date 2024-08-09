import Modal from 'react-modal';
import React, { useState, useRef } from 'react';
import { Button, DatePicker, Form, Input, message } from 'antd';

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

const ProfessionCreate = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    profession: '',
    description: '',
    date: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, dateString) => {
    setFormData({
      ...formData,
      date: dateString,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.keys(formData).every((key) => formData[key] !== '')) {
      const token = localStorage.getItem('token'); // Token'ı localStorage'dan al

      fetch('http://localhost:8080/professions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Authorization başlığına token'ı ekle
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          message.success('Meslek eklendi');
          onDataChange();
          closeModal();
        })
        .catch((error) => {
          message.error('Bağlantı Yok');
        });
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
    if (subtitle.current) {
      subtitle.current.style.color = '#f00';
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h1 style={{ marginLeft: "20px", color: "#02457A",fontSize:"30px" }}>Meslekler</h1>
      <Button  style={{marginRight:"10px"}} type="primary" onClick={openModal}>
        Meslek Ekle
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Form>
          <Form.Item label="Meslek">
            <Input name="profession" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Tanım">
            <Input name="description" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Tarih">
            <DatePicker onChange={handleDateChange} />
          </Form.Item>
          <Form.Item>
            <Button style={{marginRight:"20px", marginLeft:"40px"}} type="primary" htmlType="submit" onClick={handleSubmit}>
              Kaydet
            </Button>
            <Button onClick={closeModal}>Kapat</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfessionCreate;
