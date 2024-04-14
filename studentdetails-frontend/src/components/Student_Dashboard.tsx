import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
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

  const handleEdit = (id: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === id
          ? { ...student, isEditing: !student.isEditing }
          : student
      )
    );
  };

  const handleSave = (id: string) => {
    const student = students.find((student) => student._id === id);
    if (!student) {
      console.error("Student not found for ID:", id);
      return;
    }

    console.log("Saving student data:", student);

    axios
      .put(`http://localhost:3000/students/${id}`, student)
      .then((response) => {
        console.log("Student updated successfully:", response.data);
        axios
          .get("http://localhost:3000/students")
          .then((response) => {
            setStudents(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating student:", error);
      });
  };

  const handleInput = (value: string, id: string, field: keyof Student) => {
    if (field !== "_id") {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, [field]: value } : student
        )
      );
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/students/${id}`);
  //     console.log("Student deleted successfully");
  //     setStudents((prevStudents) =>
  //       prevStudents.filter((student) => student._id !== id)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting student:", error);
  //   }
  // };
  const handleDelete = (id: string) => {
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

  const handleCancel = (id: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === id ? { ...student, isEditing: false } : student
      )
    );
  };
  const Cancelbutton = () => {
    setShowConfirmation(false);
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

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gray-200">
            {/* <th className="border border-gray-400 px-4 py-2">ID</th> */}
            <th className="border border-gray-400 px-4 py-2">First Name</th>
            <th className="border border-gray-400 px-4 py-2">Last Name</th>
            <th className="border border-gray-400 px-4 py-2">Gender</th>
            <th className="border border-gray-400 px-4 py-2">Department</th>
            <th className="border border-gray-400 px-4 py-2">Address</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
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
                  {student.isEditing ? (
                    <input
                      type="text"
                      value={student.firstName}
                      onChange={(e) =>
                        handleInput(e.target.value, student._id, "firstName")
                      }
                    />
                  ) : (
                    student.firstName
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.isEditing ? (
                    <input
                      type="text"
                      value={student.lastName}
                      onChange={(e) =>
                        handleInput(e.target.value, student._id, "lastName")
                      }
                    />
                  ) : (
                    student.lastName
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.isEditing ? (
                    <input
                      type="text"
                      value={student.gender}
                      onChange={(e) =>
                        handleInput(e.target.value, student._id, "gender")
                      }
                    />
                  ) : (
                    student.gender
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.isEditing ? (
                    <input
                      type="text"
                      value={student.department}
                      onChange={(e) =>
                        handleInput(e.target.value, student._id, "department")
                      }
                    />
                  ) : (
                    student.department
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.isEditing ? (
                    <input
                      type="text"
                      value={student.address}
                      onChange={(e) =>
                        handleInput(e.target.value, student._id, "address")
                      }
                    />
                  ) : (
                    student.address
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {student.isEditing ? (
                    <div className="flex">
                      <Button
                        className="bg-green-200 hover:bg-green-300 ml-4 text-black font-bold py-2 px-4 rounded"
                        onClick={() => handleSave(student._id)}
                      >
                        Save
                      </Button>
                      <Button
                        className="bg-red-200 hover:bg-red-300 text-black font-bold py-2 px-4 ml-3 rounded"
                        onClick={() => handleCancel(student._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex">
                      <img
                        className="w-[30px] h-[30px] mt-4 ml-7"
                        onClick={() => handleEdit(student._id)}
                        src="public/edit.png"
                        alt=""
                      />

                      <img
                        className="w-[30px] h-[30px] mt-4 ml-4"
                        onClick={() => handleDelete(student._id)}
                        src="public/delete.png"
                        alt=""
                      />
                      {showConfirmation && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="mb-4">
                              Are you sure you want to delete this student?
                            </p>
                            <div className="flex justify-between">
                              <Button
                                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 ml-3 rounded"
                                onClick={Cancelbutton}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleConfirmation}>
                                Yes, Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
    </div>
  );
}

export default Student_Dashboard;
