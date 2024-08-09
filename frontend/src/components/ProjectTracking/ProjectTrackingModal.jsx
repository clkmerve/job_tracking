import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, DatePicker, message } from 'antd';
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { MonthPicker } = DatePicker;

const ProjectTrackingModal = ({ refreshData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [taskPackages, setTaskPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rates, setRates] = useState([]);
  const [selectedTaskPackage, setSelectedTaskPackage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [month, setMonth] = useState(null);
  const [currentMonthData, setCurrentMonthData] = useState([]);

  const location = useLocation();
  const projectId = location.pathname.split('/').pop(); // Extract project ID from URL

  useEffect(() => {
    fetchProjectDetails(projectId);
    fetchTaskPackages(projectId);
    fetchRates();
    if (selectedTaskPackage && selectedUser && month) {
      fetchCurrentMonthData();
    }
  }, [projectId, selectedTaskPackage, selectedUser, month]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setProjectName(data.projectName); // Ensure this matches the response field
      } else {
        throw new Error('Proje bilgileri alınırken hata oluştu');
      }
    } catch (error) {
      console.error(error.message);
      message.error('Proje bilgileri alınırken bir hata oluştu.');
    }
  };

  const fetchTaskPackages = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${projectId}/taskPackages`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setTaskPackages(data);
      } else {
        throw new Error('İş paketleri alınırken hata oluştu');
      }
    } catch (error) {
      console.error(error.message);
      message.error('İş paketleri alınırken bir hata oluştu.');
    }
  };

  const fetchRates = async () => {
    try {
      const response = await fetch('http://localhost:8080/rates', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setRates(data);
      } else {
        throw new Error('Oranlar alınırken hata oluştu');
      }
    } catch (error) {
      console.error('Oranlar alınırken hata oluştu:', error);
      message.error('Oranlar alınırken bir hata oluştu.');
    }
  };

  const fetchUsersByTaskPackage = async (taskPackageId) => {
    try {
      const response = await fetch(`http://localhost:8080/taskPackages/${taskPackageId}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        })));
      } else {
        throw new Error('Kullanıcılar alınırken hata oluştu');
      }
    } catch (error) {
      console.error(error.message);
      message.error('Kullanıcılar alınırken bir hata oluştu.');
    }
  };

  const fetchCurrentMonthData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/project-tracking-data?projectId=${projectId}&userId=${selectedUser}&month=${month.format('YYYY-MM')}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentMonthData(data);
      } else {
        throw new Error('Mevcut ay verileri alınırken hata oluştu');
      }
    } catch (error) {
      console.error(error.message);
      message.error('Mevcut ay verileri alınırken bir hata oluştu.');
    }
  };

  const handleTaskPackageChange = (taskPackageId) => {
    setSelectedTaskPackage(taskPackageId);
    fetchUsersByTaskPackage(taskPackageId);
  };

  const handleUserChange = (userId) => {
    setSelectedUser(userId);
  };

  const handleRateChange = (rateId) => {
    setSelectedRate(rateId);
  };

  const handleSave = async () => {
    if (!selectedTaskPackage || !selectedUser || !selectedRate || !month) {
      message.error('Lütfen tüm alanları doldurun.');
      return;
    }

    const selectedRateDetails = rates.find(rate => rate.id === selectedRate);
    
    // Calculate the total rate for the selected user and month
    const totalRateForMonth = currentMonthData.reduce((acc, item) => acc + (item.rate ? parseFloat(item.rate) : 0), 0);
    const newRate = parseFloat(selectedRateDetails.rate);

    if (totalRateForMonth + newRate > 1.0) {
      message.error('Seçilen oran ile birlikte toplam oran 1.0\'ı geçmemelidir.');
      return;
    }

    const trackingData = {
      project: { id: projectId },
      taskPackage: { id: selectedTaskPackage },
      user: { id: selectedUser },
      rate: selectedRateDetails,
      month: month.format('MM.YYYY'),
    };

    try {
      const response = await fetch('http://localhost:8080/project-tracking-data', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(trackingData),
      });

      if (response.ok) {
        message.success('Veri başarıyla kaydedildi!');
        setModalVisible(false);
        setSelectedTaskPackage(null);
        setSelectedUser(null);
        setSelectedRate(null);
        setMonth(null);
        setCurrentMonthData([]);
        refreshData(); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Veri kaydedilirken hata oluştu');
      }
    } catch (error) {
      console.error(error.message);
      message.error('1.0 değeri geçilemez ');
    }
  };

  return (
    <div  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
 <h1 style={{ fontSize: "30px", color: "#02457A" }}>İş Yükü Dağılımı</h1>               

      <Button  style={{ marginLeft:"50px"}}  type="primary" onClick={() => setModalVisible(true)}>Yeni Veri Ekle</Button>
      <Modal
        title={`Proje: ${projectName}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form layout="vertical">
          <Form.Item label="İş Paketi">
            <Select 
              value={selectedTaskPackage} 
              onChange={handleTaskPackageChange} 
              placeholder="İş Paketi Seçin"
            >
              {taskPackages.map(taskPackage => (
                <Option key={taskPackage.id} value={taskPackage.id}>
                  {taskPackage.taskPackageName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kullanıcı">
            <Select 
              value={selectedUser} 
              onChange={handleUserChange} 
              placeholder="Kullanıcı Seçin"
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Oran">
            {Array.isArray(rates) ? (
              <Select 
                value={selectedRate}
                onChange={handleRateChange}
                placeholder="Oran Seçin"
              >
                {rates.map(rate => (
                  <Option key={rate.id} value={rate.id}>
                    {rate.rate} {/* Display the rate amount or other relevant field */}
                  </Option>
                ))}
              </Select>
            ) : (
              <p>Mevcut oran yok</p>
            )}
          </Form.Item>
          <Form.Item label="Ay">
            <MonthPicker 
              value={month} 
              onChange={setMonth} 
              format="YYYY-MM" // Update format to match expected format
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectTrackingModal;
