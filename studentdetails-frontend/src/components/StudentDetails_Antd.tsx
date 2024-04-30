import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";
import { Input, Radio, Space, RadioChangeEvent, Select } from "antd";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function StudentDetails_Antd() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    department: "",
    address: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting data:", formData); // Log the data being submitted
    try {
      await axios.post("http://localhost:3000/addstudents", formData);
      alert("Data submitted successfully!");
      setTimeout(() => navigate("/Studentdashboard-antd"), 1000);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data.");
    }
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };
  const { TextArea } = Input;

  return (
    <div className="ml-40">
      <div className="border-2 border-gray p-10 w-[500px] ml-80 mt-14">
        <div className="ml-15 text-center">
          <p className="font-semibold text-lg">Student Details Form</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex p-5">
            <p className="mt-2 mr-4">FirstName</p>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </div>
          <div className="flex p-5 mb-1">
            <p className=" mr-4">LastName</p>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>
          <div className="flex p-5 mb-1">
            <p className="mr-4">Gender</p>
            <Radio.Group onChange={handleRadioChange} value={formData.gender}>
              <Space direction="vertical">
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
                <Radio value="Other">Other</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div className="flex p-5 mb-1">
            <p className="mr-1">Department</p>
            <Select
              defaultValue={formData.department}
              style={{ width: 300 }}
              allowClear
              onChange={handleSelectChange}
              options={[
                { value: "Bcom", label: "Bcom" },
                { value: "BA", label: "BA" },
                { value: "BSC", label: "BSC" },
                { value: "BCA", label: "BCA" },
              ]}
            />
          </div>
          <div>
            <p className="ml-4 mt-6">Address</p>
            <TextArea
              className="mt-3"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Type your Address here."
            />
          </div>

          <Button type="submit" className="w-full mt-5">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default StudentDetails_Antd;
