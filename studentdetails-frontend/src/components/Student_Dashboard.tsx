import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  _id: string;
  isEditing: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  department: string;
  address: string;
}

function Student_Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/students")
      .then((response) => {
        setStudents(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      (selectedGender === "All" || student.gender === selectedGender) &&
      (selectedDepartment === "" || student.department === selectedDepartment)
  );

  const searchStudents = filteredStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department === "All" ? "" : department);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchStudents.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id: string) => {
    console.log("Delete icon clicked for student with ID:", id);
    setShowConfirmation(true);
    setStudentToDeleteId(id);
  };

  const handleConfirmation = async () => {
    try {
      await axios.delete(`http://localhost:3000/students/${studentToDeleteId}`);
      console.log("Student deleted successfully");
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentToDeleteId)
      );
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) {
      return; // Exit early if editingStudent is null
    }

    try {
      // Update the student data in the database
      await axios.put(
        `http://localhost:3000/students/${editingStudent._id}`,
        editingStudent
      );

      // Update the student data in the local state
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === editingStudent._id ? editingStudent : student
        )
      );

      // Close the edit dialog
      setEditingStudent(null);
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 mt-6 text-center">
        Student Dashboard
      </h1>
      <div className="flex mt-10">
        <div>
          <input
            type="text"
            placeholder="Search by first name or last name"
            className="border border-gray-400 px-4 py-2 mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex mb-4 ml-10">
          <DropdownMenu>
            <label htmlFor="gender" className="mr-2 mt-2">
              Gender:
            </label>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border border-gray-400 px-2 py-1 w-[120px]"
              >
                Select
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Gender</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedGender === "All"}
                onCheckedChange={() => handleGenderChange("All")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedGender === "Male"}
                onCheckedChange={() => handleGenderChange("Male")}
              >
                Male
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedGender === "Female"}
                onCheckedChange={() => handleGenderChange("Female")}
              >
                Female
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedGender === "Other"}
                onCheckedChange={() => handleGenderChange("Other")}
              >
                Other
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <label htmlFor="gender" className="mr-2 mt-2 ml-3">
              Department:
            </label>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border border-gray-400 px-2 py-1 w-[120px]"
              >
                Select
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedDepartment === "All"}
                onCheckedChange={() => handleDepartmentChange("All")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedDepartment === "Bcom"}
                onCheckedChange={() => handleDepartmentChange("Bcom")}
              >
                Bcom
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedDepartment === "BA"}
                onCheckedChange={() => handleDepartmentChange("BA")}
              >
                BA
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedDepartment === "BSC"}
                onCheckedChange={() => handleDepartmentChange("BSC")}
              >
                BSC
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedDepartment === "BCA"}
                onCheckedChange={() => handleDepartmentChange("BCA")}
              >
                BCA
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex mt-10">{/* Dropdown filters */}</div>

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">First Name</th>
            <th className="border border-gray-400 px-4 py-2">Last Name</th>
            <th className="border border-gray-400 px-4 py-2">Gender</th>
            <th className="border border-gray-400 px-4 py-2">Department</th>
            <th className="border border-gray-400 px-4 py-2">Address</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows */}
          {searchStudents.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-red-500">
                No results found.
              </td>
            </tr>
          ) : (
            currentItems.map((student) => (
              <tr key={student._id} className="border-b border-gray-400">
                <td className="border border-gray-400 px-4 py-2">
                  {student.firstName}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.lastName}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.gender}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.department}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.address}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <div className="flex">
                    <img
                      className="w-[30px] h-[30px] mt-4 ml-7 cursor-pointer"
                      src="public/edit.png"
                      alt=""
                      onClick={() => handleEdit(student)}
                    />
                    <img
                      className="w-[30px] h-[30px] mt-4 ml-4 cursor-pointer"
                      src="public/delete.png"
                      alt=""
                      onClick={() => handleDelete(student._id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= searchStudents.length}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4 font-semibold text-lg">Edit Student</p>
            <div className="border-2 border-gray p-10">
              <div className="flex">
                <h1 className="mt-3 ">firstname:</h1>
                <Input
                  type="text"
                  value={editingStudent.firstName}
                  className="ml-10"
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <p className="mt-3">Lastname:</p>
                <Input
                  type="text"
                  value={editingStudent.lastName}
                  className="ml-10 mt-2"
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <p className="mt-3">Gender:</p>
                <Input
                  type="text"
                  value={editingStudent.gender}
                  className="ml-14 mt-2"
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      gender: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <p className="mt-3">Department:</p>
                <Input
                  type="text"
                  value={editingStudent.department}
                  className="ml-5 mt-2"
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      department: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex">
                <p className="mt-3">Address:</p>
                <Input
                  type="text"
                  value={editingStudent.address}
                  className="ml-12 mt-2"
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 ml-0 rounded"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">
              Are you sure you want to delete this student?
            </p>
            <div className="flex justify-between">
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 ml-3 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmation}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Student_Dashboard;
