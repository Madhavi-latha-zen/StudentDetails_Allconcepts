const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./Student");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/newdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.post("/addstudents", async (req, res) => {
  try {
    const { firstName, lastName, gender, department, address } = req.body;
    const newStudent = new Student({
      firstName,
      lastName,
      gender,
      department,
      address,
    });
    await newStudent.save();
    console.log("Student record created successfully");
    res.status(201).send("Student record created successfully");
  } catch (error) {
    console.error("Error creating student record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/students/:id", async (req, res) => {
  const studentId = req.params.id;
  const { firstName, lastName, gender, department, address } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { firstName, lastName, gender, department, address },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("Student deleted successfully");
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
