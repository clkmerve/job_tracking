import React, { useState, useEffect } from "react";
import { Table, Spin, Input, Select, message } from "antd";

const { Option } = Select;

const UserProjectsTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/project-tracking-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Veriler alınırken bir hata oluştu");
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = data.filter((item) => {
      const isSearchMatch =
        item.user.firstName.toLowerCase().includes(lowercasedFilter) ||
        item.user.lastName.toLowerCase().includes(lowercasedFilter) ||
        item.taskPackage.taskPackageName
          .toLowerCase()
          .includes(lowercasedFilter);
      const isMonthMatch = selectedMonth ? item.month === selectedMonth : true;
      return isSearchMatch && isMonthMatch;
    });
    setFilteredData(filteredData);
  }, [searchTerm, selectedMonth, data]);

  const columns = [
    {
      title: "Kullanıcı",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Proje",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Ay",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Oran",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "İş Paketi",
      dataIndex: "taskPackageName",
      key: "taskPackageName",
    },
  ];

  const dataSource = filteredData
    .map((item) => ({
      key: item.id,
      userId: item.user.id, // Ekstra bir kullanıcı ID'si alanı ekliyoruz
      userName: `${item.user.firstName} ${item.user.lastName}`,
      projectName: item.project.projectName,
      month: item.month,
      rate: item.rate.rate,
      taskPackageName: item.taskPackage.taskPackageName,
    }))
    .sort((a, b) => {
      // Önce kullanıcı ID'lerine göre, sonra ID'lerine göre sıralama yapıyoruz
      if (a.userId === b.userId) {
        return a.key - b.key;
      }
      return a.userId - b.userId;
    });

  const uniqueMonths = [...new Set(data.map((item) => item.month))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  if (loading) return <Spin />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", gap: "10px" }}>
        <Input
          placeholder="Kullanıcı veya iş paketi ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "260px" }}
        />
        <Select
          placeholder="Ay seçin"
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          style={{ width: "200px" }}
          allowClear
        >
          <Option value="">Tüm Aylar</Option>
          {uniqueMonths.map((month) => (
            <Option key={month} value={month}>
              {month}
            </Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default UserProjectsTable;
