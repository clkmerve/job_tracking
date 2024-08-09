// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const ProjectPage = () => {
//     const { projectId } = useParams(); // URL'den proje ID'sini al
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState('');
//     const [error, setError] = useState('');
    
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
//                 if (!token) {
//                     throw new Error('Token bulunamadı, lütfen giriş yapın.');
//                 }

//                 const response = await fetch(`http://localhost:8080/project-tracking-data/users/${projectId}`, {
//                   headers: {
//                     'Authorization': `Bearer ${token}`, // Authorization başlığına token'ı ekle
//                     'Content-Type': 'application/json' // İçerik türünü belirle
//                   }
//                 });

//                 if (!response.ok) {
//                     if (response.status === 401) {
//                         throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
//                     }
//                     throw new Error('Kullanıcıları getirirken bir hata oluştu');
//                 }

//                 const data = await response.json();
//                 setUsers(data);
//             } catch (error) {
//                 setError(error.message);
//             }
//         };

//         fetchUsers();
//     }, [projectId]); // projectId değiştiğinde tekrar çalışır

//     const handleChange = (event) => {
//         setSelectedUser(event.target.value);
//     };

//     return (
//         <div>
//             <h1>Proje Sayfası</h1>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <label htmlFor="user-select">Kullanıcı Seç:</label>
//             <select id="user-select" value={selectedUser} onChange={handleChange}>
//                 <option value="">Seçiniz</option>
//                 {users.map(user => (
//                     <option key={user.id} value={user.id}>
//                         {user.firstName} {user.lastName} {/* Displaying both name and surname */}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// export default ProjectPage;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const ProjectPage = () => {
//     const { projectId } = useParams(); // URL'den proje ID'sini al
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState('');
//     const [userData, setUserData] = useState([]);
//     const [error, setError] = useState('');

//     // Fetch users
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
//                 if (!token) {
//                     throw new Error('Token bulunamadı, lütfen giriş yapın.');
//                 }

//                 const response = await fetch(`http://localhost:8080/project-tracking-data/users/${projectId}`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`, // Authorization başlığına token'ı ekle
//                         'Content-Type': 'application/json' // İçerik türünü belirle
//                     }
//                 });

//                 if (!response.ok) {
//                     if (response.status === 401) {
//                         throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
//                     }
//                     throw new Error('Kullanıcıları getirirken bir hata oluştu');
//                 }

//                 const data = await response.json();
//                 setUsers(data);
//             } catch (error) {
//                 setError(error.message);
//             }
//         };

//         fetchUsers();
//     }, [projectId]);

//     // Fetch data for selected user
//     useEffect(() => {
//         if (!selectedUser) return;

//         const fetchUserData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await fetch(`http://localhost:8080/project-tracking-data/user-data/${projectId}/${selectedUser}`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (!response.ok) {
//                     if (response.status === 401) {
//                         throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
//                     }
//                     throw new Error('Verileri getirirken bir hata oluştu');
//                 }

//                 const data = await response.json();
//                 setUserData(data);
//             } catch (error) {
//                 setError(error.message);
//             }
//         };

//         fetchUserData();
//     }, [selectedUser, projectId]);

//     const handleChange = (event) => {
//         setSelectedUser(event.target.value);
//     };

//     return (
//         <div>
//             <h1>Proje Sayfası</h1>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <label htmlFor="user-select">Kullanıcı Seç:</label>
//             <select id="user-select" value={selectedUser} onChange={handleChange}>
//                 <option value="">Seçiniz</option>
//                 {users.map(user => (
//                     <option key={user.id} value={user.id}>
//                         {user.firstName} {user.lastName}
//                     </option>
//                 ))}
//             </select>

//             {selectedUser && (
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>İş Paketi</th>
//                             <th>Ay</th>
//                             <th>Oran</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {userData.map(data => (
//                             <tr key={data.id}>
//                                 <td>{data.taskPackage.taskPackageName}</td>
//                                 <td>{data.month}</td>
//                                 <td>{data.rate.rate}</td>
//                                 <td>{data.rate.hour}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default ProjectPage;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Select, message } from 'antd';

const { Option } = Select;

const ProjectPage = () => {
    const { projectId } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [userData, setUserData] = useState([]);
    const [organizedData, setOrganizedData] = useState({});
    const [months, setMonths] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token bulunamadı, lütfen giriş yapın.');
                }

                const response = await fetch(`http://localhost:8080/project-tracking-data/users/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
                    }
                    throw new Error('Kullanıcıları getirirken bir hata oluştu');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
                message.error(error.message);
            }
        };

        fetchUsers();
    }, [projectId]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/project-tracking-data/user-data/${projectId}/${selectedUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
                    }
                    throw new Error('Verileri getirirken bir hata oluştu');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                setError(error.message);
                message.error(error.message);
            }
        };

        fetchUserData();
    }, [selectedUser, projectId]);

    useEffect(() => {
        if (userData.length === 0) return;

        const organized = {};
        const monthSet = new Set();

        userData.forEach(data => {
            if (!organized[data.taskPackage.taskPackageName]) {
                organized[data.taskPackage.taskPackageName] = {};
            }
            organized[data.taskPackage.taskPackageName][data.month] = data.rate.rate;
            monthSet.add(data.month);
        });

        setOrganizedData(organized);
        setMonths(Array.from(monthSet).sort());
    }, [userData]);

    const handleChange = (value) => {
        setSelectedUser(value);
    };

    const columns = [
        {
            title: 'İş Paketi',
            dataIndex: 'taskPackageName',
            key: 'taskPackageName',
            fixed: 'left',
            width: 200,
        },
        ...months.map(month => ({
            title: month,
            dataIndex: month,
            key: month,
        })),
    ];

    const dataSource = Object.keys(organizedData).map(taskPackageName => {
        const row = { taskPackageName };
        months.forEach(month => {
            row[month] = organizedData[taskPackageName][month] || 'N/A';
        });
        return row;
    });

    return (
        <div>
            <h1>Proje Sayfası</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label htmlFor="user-select">Kullanıcı Seç:</label>
            <Select
                id="user-select"
                value={selectedUser}
                onChange={handleChange}
                style={{ width: 200 }}
            >
                <Option value="">Seçiniz</Option>
                {users.map(user => (
                    <Option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                    </Option>
                ))}
            </Select>

            {selectedUser && (
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="taskPackageName"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            )}
        </div>
    );
};

export default ProjectPage;
