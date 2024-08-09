import Modal from "react-modal";
import React, { useState, useRef } from "react";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import './ProjectCreate.css'
const { Option } = Select;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

const ProjectCreate = ({ onProjectAdded }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    startDate: "",
    endDate: "",
    description: "",
    creationDate: "",
    isActive: "",
    category: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, dateString, name) => {
    setFormData({
      ...formData,
      [name]: dateString,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.keys(formData).every((key) => formData[key] !== "")) {
      const token = localStorage.getItem("token");

      fetch("http://localhost:8080/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          message.success("Proje eklendi");
          closeModal();
          onProjectAdded(); // Callback fonksiyonunu çağırma
        })
        .catch((error) => {
          message.error("Bağlantı Yok");
        });
    } else {
      message.warning("Lütfen tüm alanları doldurun");
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

  // Kategori seçenekleri
  const categoryOptions = [
    { value: "Bir Kategori Seçin...", label: "Bir Kategori Seçin..." },
    { value: "Devam Eden ArGe Merkezi Projeleri", label: "Devam Eden ArGe Merkezi Projeleri" },
    { value: "Tamamlanan ArGe Merkezi Projeleri", label: "Tamamlanan ArGe Merkezi Projeleri" },
    { value: "İptal edilen ArGe Merkezi Projeleri", label: "İptal Edilen ArGe Merkezi Projeleri" },
    { value: "Teydeb Hazırlık Projeleri", label: "Teydeb Hazırlık Projeleri" },
    { value: "Teydeb Projeleri", label: "Teydeb Projeleri" },
    { value: "Genel ArGe Projeleri Bütçe Çalışmaları", label: "Genel ArGe Projeleri Bütçe Çalışmaları" },
    { value: "Hepsi", label: "Hepsi" },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h1 style={{  marginLeft: "20px", color: "#02457A",fontSize:"30px"}}>Projeler</h1>
      <Button style={{marginRight:"10px"}} type="primary" onClick={openModal}>
        Proje Ekle
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Proje Modal"
      >
        <Form>
        <Form.Item label="Proje Adı" className="custom-form-item">
  <Input name="projectName" onChange={handleInputChange} />
</Form.Item>
<Form.Item label="Proje Kodu" className="custom-form-item">
  <Input name="projectCode" onChange={handleInputChange} />
</Form.Item>
<Form.Item label="Başlama Tarihi" className="custom-form-item">
  <DatePicker
    name="startDate"
    onChange={(date, dateString) => handleDateChange(date, dateString, "startDate")}
  />
</Form.Item>
<Form.Item label="Bitiş Tarihi" className="custom-form-item">
  <DatePicker
    name="endDate"
    onChange={(date, dateString) => handleDateChange(date, dateString, "endDate")}
  />
</Form.Item>
<Form.Item label="Açıklama" className="custom-form-item">
  <Input name="description" onChange={handleInputChange} />
</Form.Item>
<Form.Item label="Oluşturma Tarihi" className="custom-form-item">
  <DatePicker
    name="creationDate"
    onChange={(date, dateString) => handleDateChange(date, dateString, "creationDate")}
  />
</Form.Item>
<Form.Item label="Aktif" className="custom-form-item">
  <Select
    name="isActive"
    placeholder="Seçiniz"
    onChange={(value) => setFormData({ ...formData, isActive: value })}
  >
    <Option value={true}>Aktif</Option>
    <Option value={false}>Pasif</Option>
  </Select>
</Form.Item>
<Form.Item label="Kategori" className="custom-form-item">
  <Select
    name="category"
    onChange={(value) => setFormData({ ...formData, category: value })}
    defaultValue={categoryOptions[0].value}
  >
    {categoryOptions.map((option) => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item>
            <Button style={{marginRight:"20px", marginLeft:"150px"}} type="primary" htmlType="submit" onClick={handleSubmit}>
              Kaydet
            </Button>
            <Button onClick={closeModal}>
              Kapat
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectCreate;
