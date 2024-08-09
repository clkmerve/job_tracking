import React, { useState, useEffect } from "react";
import { Table, Popconfirm, message, Modal, Form, Input, Button } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import ProfessionCreate from "./ProfessionCreate";

const { Search } = Input;

const ProfessionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/professions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();
      setData(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (professionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/professions/${professionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      message.success("Meslek silindi!");
      fetchData();
    } catch (error) {
      console.error("Error deleting profession:", error);
      message.error("Meslek silinirken hata oluştu!");
    }
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = { ...selectedProfession, ...values };
      const response = await fetch(
        `http://localhost:8080/professions/${selectedProfession.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      message.success("Meslek bilgileri güncellendi!");
      fetchData();
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profession:", error);
      message.error("Meslek bilgileri güncellenirken hata oluştu!");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleEdit = (professionId) => {
    const professionToEdit = data.find(
      (profession) => profession.id === professionId
    );
    setSelectedProfession(professionToEdit);
    setModalVisible(true);
    form.setFieldsValue(professionToEdit);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.profession.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Meslek",
      dataIndex: "profession",
    },
    {
      title: "Tanım",
      dataIndex: "description",
    },
    {
      title: "Tarih",
      dataIndex: "date",
    },
    {
      title: "İşlem",
      dataIndex: "operation",
      render: (_, record) =>
        data.length >= 1 ? (
          <span key={record.id}>
            <Popconfirm
              title="Bu mesleği silmek istediğinizden emin misiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
              <a href="#" style={{ marginRight: "8px" }}>
                <MdDelete />
              </a>
            </Popconfirm>
            <a href="#" onClick={() => handleEdit(record.id)}>
              <MdEdit />
            </a>
          </span>
        ) : null,
    },
  ];

  return (
    <>
      <ProfessionCreate onDataChange={fetchData} />{" "}
      {/* Add the callback prop */}
      <Search
        placeholder="Arama yapın"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: "50%" }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        size="middle"
        loading={loading}
        rowKey={(record) => record.id}
        className="custom-table"
      />
      {selectedProfession && (
        <Modal
          title="Meslek Düzenleme"
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form form={form} name="editProfessionForm" onFinish={onFinish}>
            <Form.Item
              name="profession"
              label="Meslek"
              rules={[{ required: true, message: "Lütfen mesleği girin!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Tanım"
              rules={[
                { required: true, message: "Lütfen meslek tanımını girin!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="date"
              label="Tarih"
              rules={[{ required: true, message: "Lütfen tarihi girin!" }]}
            >
              <Input />
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

export default ProfessionTable;
