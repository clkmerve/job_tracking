import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table, Select, message } from 'antd';
import moment from 'moment';

import ProjectTrackingModal from './ProjectTrackingModal';

const { Option } = Select;

const ProjectTrackingTable = () => {
    const { projectId } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [userData, setUserData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [months, setMonths] = useState([]);
    const [taskPackages, setTaskPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProjectRate, setTotalProjectRate] = useState(0);
    const [error, setError] = useState('');

    const [dataUpdated, setDataUpdated] = useState(false);

    const location = useLocation();
    const projectIdFromLocation = location.pathname.split('/').pop(); 

    const hiddenButtonRef = useRef(null); 

    const refreshData = () => {
        setDataUpdated(true);
        fetchUsers();
        fetchAllData();
    };

    useEffect(() => {
        setLoading(true);
        fetchUsers();
        fetchAllData();
    }, [projectId, projectIdFromLocation]);

    useEffect(() => {
        if (dataUpdated) {
            fetchUsers();
            fetchAllData();
            setDataUpdated(false);
        }
    }, [dataUpdated]);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token bulunamadı, lütfen giriş yapın.');
            }

            const response = await fetch(`http://localhost:8080/project-tracking-data/users/${projectId}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
                }
                throw new Error('Veriler henüz yüklenmemiş olabilir.');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAllData = async () => {
        try {
            const url = `http://localhost:8080/project-tracking-data/projectId/${projectId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                const filteredData = data.filter(item => item.project.id === parseInt(projectId));
                const formattedData = formatData(filteredData);
                
                setAllData(formattedData);
                const totalRate = await fetchTotalProjectRate();
                setTotalProjectRate(totalRate);
            } else {
                throw new Error('Veriler alınırken hata oluştu');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatData = (data) => {
        const taskPackageMap = {};
        const monthSet = new Set();

        data.forEach(item => {
            const { taskPackage, month, rate } = item;
            if (!taskPackageMap[taskPackage.taskPackageName]) {
                taskPackageMap[taskPackage.taskPackageName] = {};
            }
            if (!taskPackageMap[taskPackage.taskPackageName][month]) {
                taskPackageMap[taskPackage.taskPackageName][month] = 0;
            }
            taskPackageMap[taskPackage.taskPackageName][month] += parseFloat(rate.rate) || 0;
            monthSet.add(month);
        });

        // Ayları doğru sıralama 
        const sortedMonths = Array.from(monthSet).sort((a, b) => moment(a, 'MM-YYYY').diff(moment(b, 'MM-YYYY')));

        setTaskPackages(Object.keys(taskPackageMap));
        setMonths(sortedMonths);

        return Object.entries(taskPackageMap).map(([taskPackageName, monthData]) => ({
            key: taskPackageName,
            taskPackage: taskPackageName,
            ...monthData
        }));
    };

    const fetchTotalProjectRate = async () => {
        try {
            const url = `http://localhost:8080/project-tracking-data/project/${projectId}/total-rate`;
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                const totalRate = await response.json();
                return totalRate;
            } else {
                throw new Error('Toplam oran alınırken hata oluştu');
            }
        } catch (error) {
            console.error('Toplam oran alınırken hata oluştu:', error);
            message.error('Toplam oran alınırken bir hata oluştu.');
            return 0;
        }
    };

    useEffect(() => {
        if (!selectedUser) {
            setUserData(allData);
            return;
        }

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/project-tracking-data/user-data/${projectId}/${selectedUser}`, {
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Yetkilendirme hatası, lütfen giriş yapın.');
                    }
                    throw new Error('Verileri getirirken bir hata oluştu');
                }

                const data = await response.json();
                const formattedData = formatData(data);
                setUserData(formattedData);
            } catch (error) {
                setError(error.message);
                message.error(error.message);
            }
        };

        fetchUserData();
    }, [selectedUser, projectId, allData]);

    useEffect(() => {
        if (selectedMonth) {
            const filteredData = allData.map(item => ({
                key: item.taskPackage,
                taskPackage: item.taskPackage,
                [selectedMonth]: item[selectedMonth] || 0,
            }));
            setUserData(filteredData);
        } else {
            setUserData(allData);
        }
    }, [selectedMonth, allData]);

    const handleChangeUser = (value) => {
        setSelectedUser(value);
        if (value === '') {
            if (hiddenButtonRef.current) {
                hiddenButtonRef.current.click();
            }
        }
    };

    const handleChangeMonth = (value) => {
        setSelectedMonth(value);
    };

    const columns = [
        {
            title: 'İş Paketi',
            dataIndex: 'taskPackage',
            key: 'taskPackage',
            fixed: 'left',
            width: 200,
        },
        ...months.filter(month => !selectedMonth || month === selectedMonth).map(month => ({
            title: moment(month, 'MM-YYYY').format('MM.YYYY'),
            dataIndex: month,
            key: month,
            render: (rate) => rate ? rate.toFixed(1) : '-' 
        })),
    ];

    const dataSource = userData.map(item => ({
        key: item.taskPackage,
        ...item,
    }));

    const calculateTotalRates = () => {
        const totals = {};
        dataSource.forEach(row => {
            months.forEach(month => {
                if (!totals[month]) totals[month] = 0;
                totals[month] += parseFloat(row[month]) || 0;
            });
        });
        return totals;
    };

    const totalRates = calculateTotalRates();

    const calculateHoursFromRate = (rate) => {
        return rate * 225;
    };

    return (
        <div style={{ marginLeft: "20px", color: "#02457A", marginRight: "20px" }}>
            <ProjectTrackingModal refreshData={refreshData} />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ marginBottom: 20 }}>
                <label htmlFor="user-select" style={{ fontSize: "23px", marginRight: 20 }}>Kullanıcı Seç: </label>
                <Select
                    id="user-select"
                    value={selectedUser}
                    onChange={handleChangeUser}
                    style={{ width: 200, marginRight: 20 }}
                >
                    <Option value="">Tüm Kullanıcılar</Option>
                    {users.map(user => (
                        <Option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </Option>
                    ))}
                </Select>

                <label htmlFor="month-select" style={{ fontSize: "23px" }}>Ay Seç: </label>
                <Select
                    id="month-select"
                    value={selectedMonth}
                    onChange={handleChangeMonth}
                    style={{ width: 200 }}
                >
                    <Option value="">Tüm Aylar</Option>
                    {months.map(month => (
                        <Option key={month} value={month}>
                            {moment(month, 'MM-YYYY').format('MM.YYYY')}
                        </Option>
                    ))}
                </Select>
            </div>

            <button 
                ref={hiddenButtonRef}
                style={{ display: 'none' }} 
                onClick={() => {
                    fetchAllData(); 
                }}
            >
                Gizli Buton
            </button>

            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content' }}
                bordered
                footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: 8, color: '#0000FF' }}>
                            Toplam Proje Oranı: {totalProjectRate.toFixed(1)} ({calculateHoursFromRate(totalProjectRate).toFixed(1)} Saat)
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default ProjectTrackingTable;
