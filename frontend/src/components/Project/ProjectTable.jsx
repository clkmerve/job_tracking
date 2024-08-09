import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message, Modal, Form, Input, Button, Select } from 'antd';
import { MdDelete, MdEdit } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import './ProjectTable.css'
import ProjectCreate from './ProjectCreate';

const { Search } = Input;
const { Option } = Select;

const ProjectTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState(''); // Aktif/Pasif filtreleme için state
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:8080/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const projectData = await response.json();
      setData(projectData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      message.success('Proje silindi!');
      fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Proje silinirken hata oluştu!');
    }
  };

  
  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No token found');
      }
      const updatedData = { ...selectedRow, ...values, taskPackages: selectedRow.taskPackages };
      const response = await fetch(`http://localhost:8080/projects/${selectedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        message.success('Proje bilgileri güncellendi!');
        fetchData(); 
        setModalVisible(false);
      } else {
        const errorText = await response.text(); 
        throw new Error(`Network response was not ok. Status: ${response.status}. ${errorText}`);
            }
    } catch (error) {
      console.error('Error updating project:', error);
      message.error('Proje bilgileri güncellenirken hata oluştu!');
    }
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
  }

  const handleEdit = (projectId) => {
    const projectToEdit = data.find(project => project.id === projectId);
    setSelectedRow(projectToEdit);
    setModalVisible(true);
    form.setFieldsValue({ ...projectToEdit, isActive: projectToEdit.isActive });
  }

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const filteredData = data.filter(item =>
    (item.projectName && item.projectName.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
  ).filter(item => {
    if (statusFilter === '') return true; 
    return item.isActive === (statusFilter === 'active'); 
  });

  const columns = [
    {
      title: 'Proje Adı',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Proje Kodu',
      dataIndex: 'projectCode',
      key: 'projectCode',
    },
    {
      title: 'Başlama Tarihi',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Bitiş Tarihi',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Açıklama',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Oluşturma Tarihi',
      dataIndex: 'creationDate',
      key: 'creationDate',
    },
    {
      title: 'isActive',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => isActive ? 'Aktif' : 'Pasif',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'İşlem',
      dataIndex: 'operation',
      render: (_, record) =>
        data.length >= 1 ? (
          <span key={record.id}>
            <Popconfirm
              title="Bu projeyi silmek istediğinizden emin misiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
              <a href="#" style={{marginRight:"3px"}}><MdDelete /></a>
            </Popconfirm>
            <a href="#" style={{marginRight:"3px"}} onClick={(e) => { e.preventDefault(); handleEdit(record.id); }}><MdEdit /></a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleViewDetails(record.id); }}><FcViewDetails /></a>
          </span>
        ) : null,
    }
  ];

  const handleProjectAdded = () => {
    fetchData();
  };

  return (
    <>
      <ProjectCreate onProjectAdded={handleProjectAdded} />

      <div className="filters">
        <Select
          defaultValue=""
          onChange={handleStatusFilterChange}
          style={{ marginRight: 16 ,marginTop:"15px"}}
        >
          <Option value="">Tüm Durumlar</Option>
          <Option value="active">Aktif</Option>
          <Option value="inactive">Pasif</Option>
        </Select>
        <Search placeholder="Arama yapın" onChange={(e) => handleSearch(e.target.value)} className='search' />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        size="middle" 
        loading={loading} 
        rowKey="id"
        rowClassName={(record) => record.isActive ? 'active-project-row' : ''}
        rowStyle={(record) => record.isActive ? { background: '#e6f7ff' } : {}}
      />

      {selectedRow && (
        <Modal
          title="Proje Düzenleme"
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form
            form={form}
            name="editProjectForm"
            onFinish={onFinish}
          >
            <Form.Item
              name="projectName"
              label="Proje Adı"
              rules={[{ required: true, message: 'Lütfen projeyi girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="projectCode"
              label="Proje Kodu"
              rules={[{ required: true, message: 'Lütfen proje kodunu girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Başlama Tarihi"
              rules={[{ required: true, message: 'Lütfen tarihi girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Bitiş Tarihi"
              rules={[{ required: true, message: 'Lütfen tarihi girin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Açıklama"
              rules={[{ required: true, message: 'Lütfen proje açıklamasını girin!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Aktif mi?"
              rules={[{ required: true, message: 'Lütfen aktiflik durumunu seçin!' }]}
            >
              <Select>
                <Option value={true}>Aktif</Option>
                <Option value={false}>Pasif</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Kategori"
              rules={[{ required: true, message: 'Lütfen kategoriyi seçin!' }]}
            >
              <Select>
                <Option value="Devam Eden ArGe Merkezi Projeleri">Devam Eden ArGe Merkezi Projeleri</Option>
                <Option value="Tamamlanan ArGe Merkezi Projeleri">Tamamlanan ArGe Merkezi Projeleri</Option>
                <Option value="İptal edilen ArGe Merkezi Projeleri">İptal edilen ArGe Merkezi Projeleri</Option>
                <Option value="Teydeb Hazırlık Projeleri">Teydeb Hazırlık Projeleri</Option>
                <Option value="Teydeb Projeleri">Teydeb Projeleri</Option>
                <Option value="Genel ArGe Projeleri Bütçe Çalışmaları">Genel ArGe Projeleri Bütçe Çalışmaları</Option>
                <Option value="Hepsi">Hepsi</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Güncelle
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ProjectTable;
