const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/employees", {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const Employee = require("./models/employee");
const Attendance = require("./models/attendance");
const moment = require("moment/moment");
// endpoints to register a employee

app.post("/addEmployee", async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    } = req.body;

    // create a new employee
    const newEmployee = new Employee({
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    console.log("Error creating employee", error);
    res.status(500).send("Failed to add employee");
  }
});

// endpoints to fetch all the employees

app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).send("Failed to retrieve employees");
  }
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, employeeName, data, status } = req.body;
    const existingAttendance = await Attendance.findOne({ employeeId, data });
    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({ employeeId, employeeName, data, status });
      await newAttendance.save();
      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add attendance" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;

    const attendanceData = await Attendance.find({ date: date })

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Failed to get attendance" });
  }
});

app.get("/attendance-report-all-employees", async (req, res) => {
  try {
    const { month, year } = req.query;

    console.log("query parameters", month, year);
    const startDate = new moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month").toDate();
    const endDate = new moment(startDate).endOf("month").toDate();

    const report = await Attendance.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  {
                    $month: { $dateFromString: { dateString: "$date" } }
                  },
                  parseInt(req.query.month),
                ],
              },
              {
                $eq: [
                  { $year: { $dateFromString: { dateString: "$date" } } },
                  parseInt(req.query.year),
                ],
              },
            ],
          },
        },
      },

      {
        $group: {
          _id: "$employeeId",
          present: {
            $sum: {
              $cond: { if: { $eq: ["$status", "present"] }, then: 1, else: 0 },
            }
          },
          absent: {
            $sum: {
              $cond: { if: { $eq: ["$status", "absent"] }, then: 1, else: 0 },
            }
          },
          halfday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "halfday"] }, then: 1, else: 0 },
            }
          },
          holiday: {
            $sum: {
              $cond: { if: { $eq: ["$status", "holiday"] }, then: 1, else: 0 },
            }
          },
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "employeeId",
          as: "employeeDetails",
        }
      },
      {
        $unwind: "$employeeDetails",
      },
      {
        $project: {
          _id: 1,
          present: 1,
          absent: 1,
          halfday: 1,
          holiday: 1,
          name: "$employeeDetails.employeeName",
          designation: "$employeeDetails.designation",
          salary: "$employeeDetails.salary",
          employeeId: "$employeeDetails.employeeId",
        },
      },
      res.status(200).json({report}),
    ]);
  } catch (error) {
    res.status(500).json({ message: "Failed to get attendance report" });
  }
});
