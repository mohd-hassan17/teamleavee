import LeaveRequest from "../models/LeaveRequest.js";

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const calculateWorkingDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return 0;
  }

  let days = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();

    if (day !== 0 && day !== 6) {
      days += 1;
    }

    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const applyLeave = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, reason, managerId } = req.body;

  console.log("Leave apply route hit", {
    userId: req.user?._id,
    type,
    startDate,
    endDate,
    hasReason: Boolean(reason),
  });

  if (!type || !startDate || !endDate || !reason) {
    console.log("Leave apply validation failed: missing required fields");
    return res.status(400).json({ message: "Type, startDate, endDate, and reason are required" });
  }

  const workingDays = calculateWorkingDays(startDate, endDate);

  if (workingDays < 1) {
    console.log("Leave apply validation failed: no working days", { startDate, endDate });
    return res.status(400).json({ message: "Leave must include at least one working day" });
  }

  const leaveRequest = await LeaveRequest.create({
    userId: req.user._id,
    type,
    startDate,
    endDate,
    reason,
    managerId: managerId || null,
    workingDays,
  });

  console.log("Leave request created", leaveRequest._id.toString());
  res.status(201).json({ leaveRequest });
});

export const getMyLeaves = asyncHandler(async (req, res) => {
  const leaveRequests = await LeaveRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.json({ leaveRequests });
});

export const getPendingLeaves = asyncHandler(async (req, res) => {
  const leaveRequests = await LeaveRequest.find({
    status: "pending",
    $or: [{ managerId: req.user._id }, { managerId: null }],
  })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  res.json({ leaveRequests });
});

export const approveLeave = asyncHandler(async (req, res) => {
  const leaveRequest = await LeaveRequest.findById(req.params.id);

  if (!leaveRequest) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  leaveRequest.status = "approved";
  leaveRequest.managerId = req.user._id;
  leaveRequest.comment = req.body.comment || "";

  await leaveRequest.save();

  res.json({ leaveRequest });
});

export const rejectLeave = asyncHandler(async (req, res) => {
  const leaveRequest = await LeaveRequest.findById(req.params.id);

  if (!leaveRequest) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  leaveRequest.status = "rejected";
  leaveRequest.managerId = req.user._id;
  leaveRequest.comment = req.body.comment || "";

  await leaveRequest.save();

  res.json({ leaveRequest });
});
