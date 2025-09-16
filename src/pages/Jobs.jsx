import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../db/db";
import JobModal from "../components/jobs/JobModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Briefcase, Eye } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalProps, setModalProps] = useState({ show: false, job: null });
  const navigate = useNavigate();

  // Fetch jobs from IndexedDB
  const fetchJobs = async () => {
    let collection = [];
    try {
      // Use MSW API if available (dev), otherwise Dexie directly
      if (window.api?.getJobs) {
        collection = await window.api.getJobs();
      } else {
        collection = await db.jobs.toArray();
      }

      // Apply filters
      if (search) {
        collection = collection.filter(
          (j) =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            (j.status || "").toLowerCase().includes(search.toLowerCase())
        );
      }

      if (statusFilter !== "All") {
        collection = collection.filter((j) => j.status === statusFilter);
      }

      // Pagination
      setTotal(collection.length);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setJobs(collection.slice(start, end));
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, statusFilter]);

  const openModal = (job = null) => {
    setModalProps({ show: true, job });
  };

  const handleSaveJob = async (jobData) => {
    try {
      // Ensure unique slug
      let slug = jobData.slug || jobData.title.toLowerCase().replace(/\s+/g, "-");
      const exists = await db.jobs.where("slug").equals(slug).first();
      if (exists && exists.id !== jobData.id) {
        return alert("Job with this title already exists.");
      }

      // Update or create
      if (jobData.id) {
        await db.jobs.put({ ...jobData, slug });
      } else {
        const id = await db.jobs.add({ ...jobData, slug });
        jobData.id = id;
      }

      fetchJobs(); // Refresh list
      setModalProps({ show: false, job: null });
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  const handleArchive = async (job) => {
    try {
      const updated = {
        ...job,
        status: job.status === "Archived" ? "Active" : "Archived",
      };
      await db.jobs.put(updated);
      fetchJobs();
    } catch (err) {
      console.error("Failed to archive/unarchive job:", err);
    }
  };

  const handleDelete = async (job) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await db.jobs.delete(job.id);
      fetchJobs();
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  // Stats
  const totalJobs = total;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const archivedJobs = jobs.filter((j) => j.status === "Archived").length;
  const inactiveJobs = jobs.filter((j) => j.status === "Inactive").length;

  return (
    <div className="space-y-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Jobs</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] rounded-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-lg">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Job Button */}
          <Button
            onClick={() => openModal()}
            className="w-full md:w-auto rounded-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            + Create Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
            <CardDescription>{totalJobs}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>{activeJobs}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Archived</CardTitle>
            <CardDescription>{archivedJobs}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Inactive</CardTitle>
            <CardDescription>{inactiveJobs}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    <CardTitle className="text-base md:text-lg">
                      {job.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={
                      job.status === "Active"
                        ? "default"
                        : job.status === "Archived"
                        ? "secondary"
                        : "outline"
                    }
                    className="dark:bg-gray-700 dark:text-gray-100 px-2 py-1 text-sm"
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.tags?.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="dark:border-gray-600 dark:text-gray-100 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {job.description || "No description available."}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="flex-1 rounded-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View
                </Button>
                <Button
                  onClick={() => openModal(job)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleArchive(job)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  {job.status === "Archived" ? "Unarchive" : "Archive"}
                </Button>
                <Button
                  onClick={() => handleDelete(job)}
                  variant="destructive"
                  className="flex-1 rounded-full"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            No jobs found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-gray-900 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <JobModal
        show={modalProps.show}
        onClose={() => setModalProps({ show: false, job: null })}
        job={modalProps.job}
        onSave={handleSaveJob}
      />
    </div>
  );
}
