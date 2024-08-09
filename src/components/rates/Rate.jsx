import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

const RateTable = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [currentRate, setCurrentRate] = useState(null);

  useEffect(() => {
   
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("JWT Token not found");
      }
  
      const response = await fetch('http://localhost:8080/rates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.status === 401) {
        throw new Error('Unauthorized: Token may be invalid or expired');
      }
  
      if (!response.ok) {
        throw new Error('Ağ yanıtı başarılı değil');
      }
  
      const data = await response.json();
      setRates(data);
      setLoading(false);
    } catch (error) {
      console.error('Oranlar getirilirken hata oluştu:', error);
      message.error(error.message);
      setLoading(false);
    }
  };
  

  const handleAddRate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("JWT Token not found");
      }
  
      const response = await fetch('http://localhost:8080/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Oran eklenemedi');
      }
  
      message.success('Oran başarıyla eklendi');
      setModalVisible(false);
      form.resetFields();
      fetchRates();
    } catch (error) {
      console.error('Oran eklenirken hata oluştu:', error);
      message.error('Oran eklenirken hata oluştu!');
    }
  };
  
  const handleEditRate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("JWT Token not found");
      }
  
      const response = await fetch(`http://localhost:8080/rates/${currentRate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error('Oran güncellenemedi');
      }
  
      message.success('Oran başarıyla güncellendi');
      setEditModalVisible(false);
      editForm.resetFields();
      fetchRates();
    } catch (error) {
      console.error('Oran güncellenirken hata oluştu:', error);
      message.error('Oran güncellenirken hata oluştu!');
    }
  };
  
  const handleCancelAddModal = () => {
    setModalVisible(false);
    form.resetFields();
  };
  
  const handleCancelEditModal = () => {
    setEditModalVisible(false);
    editForm.resetFields();
  };
  

  const handleDeleteRate = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      const response = await fetch(`http://localhost:8080/rates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token
        },
      });

      if (!response.ok) {
        throw new Error('Oran silinemedi');
      }

      message.success('Oran başarıyla silindi');
      fetchRates();
    } catch (error) {
      console.error('Oran silinirken hata oluştu:', error);
      message.error('Oran silinirken hata oluştu!');
    }
  };

  const showEditModal = (rate) => {
    setCurrentRate(rate);
    setEditModalVisible(true);
    editForm.setFieldsValue({
      rate: rate.rate,
      hour: rate.hour,
    });
  };

  const columns = [
    {
      title: 'Oran',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: 'Saat',
      dataIndex: 'hour',
      key: 'hour',
    },
    {
      title: 'İşlem',
      key: 'actions',
      render: (_, rate) => (
        <>
          <Button type="link" onClick={() => showEditModal(rate)}>
          <MdEdit />
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => handleDeleteRate(rate.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="link" >
            <MdDelete />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ marginLeft: "20px",fontSize: '30px', color: '#02457A'}}>Oranlar</h1>
        <Button style={{marginRight:"10px"}} type="primary" onClick={() => setModalVisible(true)}>
          Oran Ekle
        </Button>
      </div>
      <Table columns={columns} dataSource={rates} loading={loading} rowKey="id" pagination={false}/>
      <Modal
        title="Oran Ekle"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddRate}>
          <Form.Item name="rate" label="Oran" rules={[{ required: true, message: 'Lütfen oranı girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hour" label="Saat" rules={[{ required: true, message: 'Lütfen saati girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Oranı Düzenle"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditRate}>
          <Form.Item name="rate" label="Oran" rules={[{ required: true, message: 'Lütfen oranı girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hour" label="Saat" rules={[{ required: true, message: 'Lütfen saati girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RateTable;
