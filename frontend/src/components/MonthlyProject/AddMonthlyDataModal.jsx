// import React, { useState, useEffect } from 'react';
// import { Select } from 'antd';

// const { Option } = Select;

// const AddMonthlyDataModal = ({ onChange }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
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

//   return (
//     <Select placeholder="Kullanıcı Seçin" onChange={onChange} style={{ width: 200 }}>
//       {users.map(user => (
//         <Option key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</Option>
//       ))}
//     </Select>
//   );
// };

// export default AddMonthlyDataModal;


import React from 'react'

const AddMonthlyDataModal = () => {
  return (
    <div>
      
    </div>
  )
}

export default AddMonthlyDataModal
