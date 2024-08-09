import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Option } = Select;

const TaskPackages = () => {
  const { projectId } = useParams();
  const [taskPackages, setTaskPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [currentTaskPackage, setCurrentTaskPackage] = useState(null);

  useEffect(() => {
    fetchTaskPackages();
    fetchUsers();
  }, [projectId]);

  const fetchTaskPackages = async () => {
    try {
      if (!projectId) {
        throw new Error('Proje ID tanımlı değil');
      }
      const token = localStorage.getItem("token"); // Retrieve JWT token
      const response = await fetch(`http://localhost:8080/projects/${projectId}/taskPackages`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token
        }
      });
      if (!response.ok) {
        throw new Error('Ağ yanıtı başarılı değil');
      }
      const data = await response.json();
      setTaskPackages(data);
      setLoading(false);
    } catch (error) {
      console.error('İş paketleri getirilirken hata oluştu:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      const response = await fetch('http://localhost:8080/users', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token
        }
      });
      if (!response.ok) {
        throw new Error('Ağ yanıtı başarılı değil');
      }
      const data = await response.json();
      const activeUsers = data.filter(user => user.isActive); 
      setUsers(activeUsers);
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata oluştu:', error);
    }
  };

  
  const handleAddTaskPackage = async (values) => {
    try {
        const token = localStorage.getItem("token"); 
        const requestBody = {
            taskPackageName: values.taskPackageName,
            project: { id: projectId },
            users: values.userIds.map(userId => ({ id: userId })),
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD"),
            updatedAt: values.updatedAt.format("YYYY-MM-DD")
        };

        const response = await fetch(`http://localhost:8080/taskPackages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('İş paketi eklenemedi');
        }

        message.success('İş paketi başarıyla eklendi');
        setModalVisible(false);
        form.resetFields();
        window.location.reload(); 
    } catch (error) {
        console.error('İş paketi eklenirken hata oluştu:', error);
        message.error('İş paketi eklenirken hata oluştu!');
    }
};

  const handleEditTaskPackage = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        taskPackageName: values.taskPackageName,
        project: { id: projectId },
        users: values.userIds.map(userId => ({ id: userId })),
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        updatedAt: values.updatedAt.format("YYYY-MM-DD"),
      };
  
      const response = await fetch(`http://localhost:8080/taskPackages/${currentTaskPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('İş paketi güncellenemedi');
      }
  
      message.success('İş paketi başarıyla güncellendi');
      setEditModalVisible(false);
      editForm.resetFields();
      fetchTaskPackages(); 
    } catch (error) {
      console.error('İş paketi güncellenirken hata oluştu:', error);
      message.error('İş paketi güncellenirken hata oluştu!');
    }
  };
  
  const handleDeleteTaskPackage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/taskPackages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
        }
      });

      if (!response.ok) {
        throw new Error('İş paketi silinemedi');
      }

      message.success('İş paketi başarıyla silindi');
      fetchTaskPackages();
    } catch (error) {
      console.error('İş paketi silinirken hata oluştu:', error);
      message.error('İş paketi silinirken hata oluştu!');
    }
  };

  const showEditModal = (taskPackage) => {
    setCurrentTaskPackage(taskPackage);
    setEditModalVisible(true);
    editForm.setFieldsValue({
      taskPackageName: taskPackage.taskPackageName,
      startDate: dayjs(taskPackage.startDate),
      endDate: dayjs(taskPackage.endDate),
      updatedAt: dayjs(taskPackage.updatedAt),
      userIds: taskPackage.users.map(user => user.id),
    });
  };

  const columns = [
    {
      title: 'Paket Adı',
      dataIndex: 'taskPackageName',
      key: 'taskPackageName',
    },
    {
      title: 'Başlama Tarihi',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Bitiş Tarihi',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Güncelleme Tarihi',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'İşlem',
      key: 'actions',
      render: (_, taskPackage) => (
        <>
          <Button type="link" onClick={() => showEditModal(taskPackage)}>
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => handleDeleteTaskPackage(taskPackage.id)}
            okText="Evet"
            cancelText="Hayır">
            <Button type="link" danger>
              Sil
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const allUsers = [];
  taskPackages.forEach(taskPackage => {
    taskPackage.users.forEach(user => {
      if (!allUsers.some(existingUser => existingUser.id === user.id)) {
        allUsers.push(user);
      }
    });
  });

  const userColumns = [
    {
      title: 'Ad',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Soyad',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Meslek',
      dataIndex: ['profession', 'profession'],
      key: 'profession',
    },
  ];

  return (
    <div style={{  marginLeft: "20px", color: "#02457A",marginRight: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
        <h1 style={{ fontSize: "30px", color: "#02457A" }}>İŞ PAKETLERİ</h1>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          İş Paketi Ekle
        </Button>
      </div>
      <Table  columns={columns} dataSource={taskPackages} loading={loading} rowKey="id" />
      <h1 style={{ fontSize: "30px",  color: "#02457A" }}>İş Paketlerine Eklenen Kullanıcılar</h1>
      <Table
        columns={userColumns}
        dataSource={allUsers}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="İş Paketi Ekle"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTaskPackage}>
          <Form.Item name="taskPackageName" label="Paket Adı" rules={[{ required: true, message: 'Lütfen paket adını girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userIds" label="Kullanıcılar" rules={[{ required: true, message: 'Lütfen kullanıcıları seçin' }]}>
            <Select mode="multiple">
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.profession.profession})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="startDate" label="Başlama Tarihi" rules={[{ required: true, message: 'Lütfen başlama tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="endDate" label="Bitiş Tarihi" rules={[{ required: true, message: 'Lütfen bitiş tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="updatedAt" label="Güncelleme Tarihi" rules={[{ required: true, message: 'Lütfen güncelleme tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="İş Paketini Düzenle"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditTaskPackage}>
          <Form.Item name="taskPackageName" label="Paket Adı" rules={[{ required: true, message: 'Lütfen paket adını girin' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userIds" label="Kullanıcılar" rules={[{ required: true, message: 'Lütfen kullanıcıları seçin' }]}>
            <Select mode="multiple">
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.profession.profession})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Başlama Tarihi" name="startDate" rules={[{ required: true, message: 'Lütfen başlama tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Bitiş Tarihi" name="endDate" rules={[{ required: true, message: 'Lütfen bitiş tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Güncelleme Tarihi" name="updatedAt" rules={[{ required: true, message: 'Lütfen güncelleme tarihini girin' }]}>
            <DatePicker format="YYYY-MM-DD" />
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

export default TaskPackages;
