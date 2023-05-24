const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

const getAllJobs = async (req, res) => {
    const userId = req.user.userId
    const jobs = await Job.find({ createdBy: userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.json({ job })
}
const updateJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
        body: { company, position }
    } = req
    if (company === "" || position === "") {
        throw new BadRequestError("Company or Position cannot be empty")
    }
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true })
    if (!job) {
        throw new NotFoundError(`Can not update job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}