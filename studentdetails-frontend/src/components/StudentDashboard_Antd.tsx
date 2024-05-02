import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  Input,
  Dropdown,
  Menu,
  Space,
  notification,
  Modal,
  Form,
} from "antd";
import axios from "axios";
import { RadiusUprightOutlined } from "@ant-design/icons";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  department: string;
  address: string;
}

const StudentDashboardAntd = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string | undefined>(
    undefined
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string>("");

  const [editingStudent, setEditingStudent] = useState<Student | null>(null); // Proper initialization and type
  
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    axios
      .get("http://localhost:4000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleEditSave = async (values: Partial<Student>) => {
    if (editingStudent) {
      try {
        await axios.put(`http://localhost:4000/students/${editingStudent._id}`, values);
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingStudent._id ? { ...student, ...values } : student
          )
        );
        setEditingStudent(null); 
        openNotification("Edit Successful", "Student data has been updated.");
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  const openNotification = (message: string, description: string) => {
    api.info({
      message,
      description,
      placement: "topRight",
      icon: <RadiusUprightOutlined />,
    });
  };

  const handleDelete = (id: string) => {
    setShowConfirmation(true);
    setStudentToDeleteId(id);
  };

  const handleConfirmation = async () => {
    try {
      await axios.delete(`http://localhost:3000/students/${studentToDeleteId}`);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentToDeleteId)
      );
      setShowConfirmation(false);
      openNotification("Student Deleted", "The student has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const genderMenu = (
    <Menu
      onClick={(e) => setSelectedGender(e.key === "All" ? undefined : e.key)}
    >
      <Menu.Item key="All">All</Menu.Item>
      <Menu.Item key="Male">Male</Menu.Item>
      <Menu.Item key="Female">Female</Menu.Item>
      <Menu.Item key="Other">Other</Menu.Item>
    </Menu>
  );

  const departmentMenu = (
    <Menu
      onClick={(e) =>
        setSelectedDepartment(e.key === "All" ? undefined : e.key)
      }
    >
      <Menu.Item key="All">All</Menu.Item>
      <Menu.Item key="Bcom">Bcom</Menu.Item>
      <Menu.Item key="BA">BA</Menu.Item>
      <Menu.Item key="BSC">BSC</Menu.Item>
      <Menu.Item key="BCA">BCA</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a: Student, b: Student) =>
        a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a: Student, b: Student) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Student) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      {contextHolder}
      <h1 className="text-3xl font-bold mb-4 mt-6 text-center">Student Dashboard</h1>
      <div className="flex mt-10 mb-4">
        <Input
          placeholder="Search by first name or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Space style={{ marginLeft: 16 }}>
          <Dropdown overlay={genderMenu} trigger={["click"]}>
            <Button type="default">Gender</Button>
          </Dropdown>
          <Dropdown overlay={departmentMenu} trigger={["click"]}>
            <Button type="default">Department</Button>
          </Dropdown>
        </Space>
      </div>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={students}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
      />

      {editingStudent && (
        <Modal
          title="Edit Student"
          visible={true}
          onCancel={() => setEditingStudent(null)}
          footer={null}
        >
          <Form
            initialValues={editingStudent}
            onFinish={handleEditSave}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter a first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter a last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please enter a gender" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Please enter a department" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter an address" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Save</Button>
              <Button type="default" onClick={() => setEditingStudent(null)}>Cancel</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {showConfirmation && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2>Are you sure you want to delete this student?</h2>
            <Space style={{ marginTop: "20px" }}>
              <Button
                type="default"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmation}>
                Yes, Delete
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardAntd;
