import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

function Student_Details() {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3006/addstudents", formData);

      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data.");
    }
  };

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
            />
          </div>
          <div className="flex p-5 mb-1">
            <p className=" mr-4">LastName</p>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <RadioGroup
            defaultValue="Male"
            name="gender"
            onChange={handleInputChange}
          >
            <p className="ml-5">Gender</p>
            <div className="flex items-center space-x-2 ml-4 mt-2">
              <RadioGroupItem value="Male" id="r1" />
              <Label htmlFor="r1">Male</Label>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <RadioGroupItem value="Female" id="r2" />
              <Label htmlFor="r2">Female</Label>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <RadioGroupItem value="Other" id="r3" />
              <Label htmlFor="r3">Other</Label>
            </div>
          </RadioGroup>

          <DropdownMenu>
            <div className="flex">
              <p className=" ml-4 mt-6">Department</p>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-5 mt-4 w-[290px]">
                  select
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <DropdownMenuRadioItem value="Bcom">
                    Bcom
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="BA">BA</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="BSC">BSC</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="BCA">BCA</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
          <div>
            <p className="ml-4 mt-6">Address</p>
            <Textarea
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

export default Student_Details;
