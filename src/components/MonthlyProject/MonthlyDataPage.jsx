// import React, { useState, useEffect } from 'react';
// import { Button, Modal, Form, Select, Table, DatePicker, message, Popconfirm } from 'antd';
// import moment from 'moment';

// const { MonthPicker } = DatePicker;

// const MonthlyDataPage = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingTracking, setEditingTracking] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [taskPackages, setTaskPackages] = useState([]);
//   const [rates, setRates] = useState([]);
//   const [newMonthlyTracking, setNewMonthlyTracking] = useState({ taskPackage: null, rate: null, month: null });
//   const [monthlyTrackings, setMonthlyTrackings] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//     fetchRates();
//     fetchMonthlyTrackings();
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchTaskPackages(selectedUser);
//     }
//   }, [selectedUser]);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('JWT Token bulunamadı. Lütfen giriş yapınız.');
//       return {};
//     }
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/users', {
//         headers: getAuthHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error('Ağ yanıtı başarısız oldu');
//       }

//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Kullanıcılar getirilirken hata oluştu:', error);
//     }
//   };

//   const fetchTaskPackages = async (userId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/users/${userId}/taskPackages`, {
//         headers: getAuthHeaders(),
//       });
//       const data = await response.json();
//       setTaskPackages(data);
//     } catch (error) {
//       console.error('İş paketleri getirilirken hata oluştu:', error);
//       setTaskPackages([]);
//     }
//   };

//   const fetchRates = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/rates', {
//         headers: getAuthHeaders(),
//       });
//       const data = await response.json();
//       setRates(data);
//     } catch (error) {
//       console.error('Oranlar getirilirken hata oluştu:', error);
//     }
//   };

//   const fetchMonthlyTrackings = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/monthly-trackings', {
//         headers: getAuthHeaders(),
//       });
//       const data = await response.json();
//       setMonthlyTrackings(data);
//     } catch (error) {
//       console.error('Aylık veriler getirilirken hata oluştu:', error);
//     }
//   };

//   const handleUserSelect = (userId) => {
//     setSelectedUser(userId);
//   };

//   const handleCreateOrUpdateMonthlyTracking = async () => {
//     if (!selectedUser || !newMonthlyTracking.taskPackage || !newMonthlyTracking.rate || !newMonthlyTracking.month) {
//       message.error('Lütfen tüm alanları doldurun.');
//       return;
//     }

//     const trackingData = {
//       user: { id: selectedUser },
//       taskPackage: { id: newMonthlyTracking.taskPackage },
//       rate: newMonthlyTracking.rate,
//       month: newMonthlyTracking.month.format('MM.YYYY'),
//     };

//     const url = isEditing 
//       ? `http://localhost:8080/monthly-trackings/${editingTracking.id}` 
//       : 'http://localhost:8080/monthly-trackings';

//     const method = isEditing ? 'PUT' : 'POST';

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify(trackingData),
//       });

//       if (response.ok) {
//         await fetchMonthlyTrackings();
//         setModalVisible(false);
//         setNewMonthlyTracking({ taskPackage: null, rate: null, month: null });
//         setSelectedUser(null);
//         setIsEditing(false);
//         setEditingTracking(null);
//         message.success(`Aylık veri ${isEditing ? 'güncellendi' : 'eklendi'}`);
//       } else {
//         throw new Error('Aylık veri kaydedilirken bir hata oluştu.');
//       }
//     } catch (error) {
//       console.error('Aylık veri kaydedilirken hata:', error);
//       message.error('1.0 oranını geçemezsiniz!');
//     }
//   };

//   const handleEditTracking = (tracking) => {
//     setIsEditing(true);
//     setEditingTracking(tracking);
//     setSelectedUser(tracking.user.id);
//     setNewMonthlyTracking({
//       taskPackage: tracking.taskPackage.id,
//       rate: tracking.rate,
//       month: moment(tracking.month, 'MM.YYYY'),
//     });
//     setModalVisible(true);
//   };

//   const handleDeleteTracking = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8080/monthly-trackings/${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//       });

//       if (response.ok) {
//         await fetchMonthlyTrackings();
//         message.success('Aylık veri silindi');
//       } else {
//         throw new Error('Aylık veri silinirken bir hata oluştu.');
//       }
//     } catch (error) {
//       console.error('Aylık veri silinirken hata:', error);
//       message.error('Aylık veri silinirken bir hata oluştu.');
//     }
//   };
//   const columns = [
//     {
//       title: 'Kullanıcı',
//       dataIndex: 'user',
//       key: 'user',
//       render: (user) => `${user.firstName} ${user.lastName}`,
//     },
//     {
//       title: 'İş Paketi',
//       dataIndex: 'taskPackage',
//       key: 'taskPackage',
//       render: (taskPackage) => taskPackage.taskPackageName,
//     },
//     {
//       title: 'Oran',
//       dataIndex: 'rate',
//       key: 'rate',
//       render: (rate) => `${rate.rate}`,
//     },
//     {
//       title: 'Saat',
//       dataIndex: 'rate',
//       key: 'hour',
//       render: (rate) => `${rate.hour}`,
//     },
//     {
//       title: 'Ay',
//       dataIndex: 'month',
//       key: 'month',
//     },
//     {
//       title: 'Aksiyon',
//       key: 'action',
//       render: (_, record) => (
//         <span>
//           <Button onClick={() => handleEditTracking(record)}>Düzenle</Button>
//           <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => handleDeleteTracking(record.id)}>
//             <Button type="link">Sil</Button>
//           </Popconfirm>
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Button  type="primary" onClick={() => setModalVisible(true)}>Aylık Veri Ekle</Button>
//       <Modal
//         title={isEditing ? 'Aylık Veriyi Düzenle' : 'Aylık Veri Ekle'}
//         open={modalVisible}
//         onCancel={() => {
//           setModalVisible(false);
//           setIsEditing(false);
//           setEditingTracking(null);
//           setSelectedUser(null);
//           setNewMonthlyTracking({ taskPackage: null, rate: null, month: null });
//         }}
//         onOk={handleCreateOrUpdateMonthlyTracking}
//       >
//         <Form>
//           <Form.Item label="Kullanıcı">
//             <Select value={selectedUser} onChange={handleUserSelect}>
//               {users.map((user) => (
//                 <Select.Option key={user.id} value={user.id}>{user.firstName} {user.lastName}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item label="İş Paketi">
//             {Array.isArray(taskPackages) ? (
//               <Select value={newMonthlyTracking.taskPackage} onChange={(value) => setNewMonthlyTracking({ ...newMonthlyTracking, taskPackage: value })}>
//                 {taskPackages.map((taskPackage) => (
//                   <Select.Option key={taskPackage.id} value={taskPackage.id}>{taskPackage.taskPackageName}</Select.Option>
//                 ))}
//               </Select>
//             ) : (
//               <p>Mevcut iş paketi yok</p>
//             )}
//           </Form.Item>
//           <Form.Item label="Oran">
//             {Array.isArray(rates) ? (
//               <Select value={newMonthlyTracking.rate ? newMonthlyTracking.rate.id : null} onChange={(value) => setNewMonthlyTracking({ ...newMonthlyTracking, rate: rates.find(rate => rate.id === value) })}>
//                 {rates.map((rate) => (
//                   <Select.Option key={rate.id} value={rate.id}>{rate.rate}</Select.Option>
//                 ))}
//               </Select>
//             ) : (
//               <p>Mevcut oran yok</p>
//             )}
//           </Form.Item>
//           <Form.Item label="Ay">
//             <MonthPicker value={newMonthlyTracking.month} onChange={(date) => setNewMonthlyTracking({ ...newMonthlyTracking, month: date })} format="MM.YYYY" />
//           </Form.Item>
//         </Form>
//       </Modal>
//       <Table dataSource={monthlyTrackings} columns={columns} rowKey="id" />
//     </div>
//   );
// };

// export default MonthlyDataPage;

import React from 'react'

const MonthlyDataPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default MonthlyDataPage
