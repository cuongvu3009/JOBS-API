const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdBy');
  res.status(200).json({ jobs, number: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(200).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(200).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(200).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
