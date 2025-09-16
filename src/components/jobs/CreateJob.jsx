import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/db";
import { ArrowLeft, Briefcase, Plus, X, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CreateJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [requirements, setRequirements] = useState([{ value: "" }]);
  const [loading, setLoading] = useState(false);

  const addRequirement = () => setRequirements([...requirements, { value: "" }]);
  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };
  const updateRequirement = (index, value) => {
    const newReqs = [...requirements];
    newReqs[index].value = value;
    setRequirements(newReqs);
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      Paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (!requirements.some(r => r.value.trim())) return toast.error("At least one requirement is needed");

    setLoading(true);
    try {
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const exists = await db.jobs.where("slug").equals(slug).first();
      if (exists) {
        toast.error("Job with this title already exists!");
        setLoading(false);
        return;
      }

      const id = await db.jobs.add({
        title,
        description,
        status,
        requirements: requirements.map(r => r.value).filter(Boolean),
        slug,
      });

      toast.success("Job created successfully!");
      navigate(`/job/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in m-6">
      {/* Header */}
      <div className="flex flex-col space-x-4">
        {/* <Button variant="ghost" onClick={() => navigate("/jobs")} className="text-gray-600 dark:text-gray-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button> */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Job</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to post a new job opening</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Details
              </CardTitle>
              <CardDescription>Basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role..." rows={8} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>List the key requirements for this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <Input value={req.value} onChange={e => updateRequirement(index, e.target.value)} placeholder={`Requirement ${index + 1}`} />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeRequirement(index)} disabled={requirements.length === 1}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addRequirement} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Requirement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
              <CardDescription>Control the visibility of this job posting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Status:</span>
                  <Badge className={`${getStatusColor(status)} border-0`}>{status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Ready to publish your job posting?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Create Job</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
