import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message, Modal, Form, Input, Button, Select } from 'antd';
import { MdDelete, MdEdit } from "react-icons/md";
import './UserTable.css';

const { Option } = Select;
const { Search } = Input;

const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [professions, setProfessions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchData();
    fetchProfessions();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchText, activeFilter, data]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      setData(userData);
      setFilteredData(userData); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchProfessions = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/professions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      message.success('Kullanıcı silindi!');
      fetchData(); // Silindikten sonra verileri yeniden yükle
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Kullanıcı silinirken hata oluştu!');
    }
  };

  const handleEdit = (userId) => {
    const userToEdit = data.find(user => user.id === userId);
    setSelectedUser(userToEdit);
    setModalVisible(true);
    form.setFieldsValue({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      profession: userToEdit.profession ? userToEdit.profession.id : null,
      isAdmin: userToEdit.isAdmin,
      isActive: userToEdit.isActive,
      resignDate: userToEdit.resignDate,
    });
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onFinish = async (values) => {
    const token = localStorage.getItem('token');
    try {
      if (!values.profession || values.profession === '') {
        throw new Error('Lütfen bir meslek seçin!');
      }

      const updatedUser = { ...selectedUser, ...values };
      const selectedProfession = professions.find(profession => profession.id === values.profession);
      updatedUser.profession = selectedProfession;
      const response = await fetch(`http://localhost:8080/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      message.success('Kullanıcı bilgileri güncellendi!');
      fetchData();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(error.message || 'Kullanıcı bilgileri güncellenirken hata oluştu!');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
  };
  const filterData = () => {
    let filtered = data.filter(user => 
      (user.firstName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (user.profession && user.profession.profession || '').toLowerCase().includes(searchText.toLowerCase())
    );
  
    if (activeFilter !== 'all') {
      filtered = filtered.filter(user => 
        activeFilter === 'active' ? user.isActive : !user.isActive
      );
    }
  
    setFilteredData(filtered);
  };
  

  const columns = [
    {
      title: 'İsim',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Soy İsim',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Meslek',
      dataIndex: 'profession',
      key: 'profession',
      render: (profession) => profession === null ? "" : profession.profession
    },
    {
      title: 'isAdmin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) => isAdmin ? 'YES' : 'NO',
    },
    {
      title: 'isActive',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => isActive ? 'Aktif' : 'Pasif',
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'İşlem',
      dataIndex: 'operation',
      render: (_, record) =>
        data.length >= 1 ? (
          <span key={record.id}>
            <Popconfirm
              title="Kullanıcıyı silmek istediğinizden emin misiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
              <a style={{marginRight:"8px"}} href="#"><MdDelete /></a>
            </Popconfirm>
            <a href="#" onClick={() => handleEdit(record.id)}><MdEdit /></a>
          </span>
        ) : null,
    }
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div className="filters-container">
        <Select
          defaultValue="all"
          onChange={handleFilterChange}
         
        >
          <Option value="all">Tüm Durumlar</Option>
          <Option value="active">Aktif</Option>
          <Option value="inactive">Pasif</Option>
        </Select>
        <Search
          placeholder="Ara..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className='search'
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
        loading={loading}
        onChange={onChange}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
        rowClassName={(record) => record.isActive ? 'active-user-row' : ''}
      />
      {selectedUser && (
        <Modal
          title="Kullanıcı Düzenle"
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form
            form={form}
            name="editUserForm"
            onFinish={onFinish}
          >
            <Form.Item
              label="İsim"
              name="firstName"
              rules={[{ required: true, message: 'Lütfen ismi girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Soyisim"
              name="lastName"
              rules={[{ required: true, message: 'Lütfen soyisim girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Lütfen email girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Meslek"
              name="profession"
              rules={[{ required: true, message: 'Lütfen meslek seçin!' }]}
            >
              <Select>
                {professions.map(profession => (
                  <Option key={profession.id} value={profession.id}>
                    {profession.profession}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="isAdmin"
              name="isAdmin"
              rules={[{ required: true, message: 'Lütfen isAdmin girin!' }]}
            >
              <Select>
                <Option value={true}>YES</Option>
                <Option value={false}>NO</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="isActive"
              name="isActive"
              rules={[{ required: true, message: 'Lütfen isActive girin!' }]}
            >
              <Select>
                <Option value={true}>Aktif</Option>
                <Option value={false}>Pasif</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Resign Tarih"
              name="resignDate"
              rules={[{ required: false, message: 'Lütfen resign tarih girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Kaydet
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default UserTable;
