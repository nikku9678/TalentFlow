import React, { useState } from "react";
import { 
  Save, 
  Plus, 
  X, 
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [requirements, setRequirements] = useState([""]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index) => {
    if (requirements.length > 1) {
      const newReqs = [...requirements];
      newReqs.splice(index, 1);
      setRequirements(newReqs);
    }
  };

  const handleRequirementChange = (index, value) => {
    const newReqs = [...requirements];
    newReqs[index] = value;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      status,
      requirements: requirements.filter((r) => r.trim() !== ""),
    };
    console.log("Form Submitted Data:", data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => console.log("Back button clicked")}
          className="text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Job
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details to post a new job opening
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Basic information about the position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={8}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  List the key requirements and qualifications for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <Input
                        value={req}
                        onChange={(e) =>
                          handleRequirementChange(index, e.target.value)
                        }
                        placeholder={`Requirement ${index + 1}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRequirement(index)}
                      disabled={requirements.length === 1}
                      className="mt-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Job Status</CardTitle>
                <CardDescription>
                  Control the visibility of this job posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Current Status:
                      </span>
                      <Badge className={`${getStatusColor(status)} border-0`}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>
                  Ready to publish your job posting?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {status === "Active" && (
                    <p>✅ This job will be visible to candidates immediately</p>
                  )}
                  {status === "Draft" && (
                    <p>📝 This job will be saved as a draft</p>
                  )}
                  {status === "Paused" && (
                    <p>⏸️ This job will be paused and not visible</p>
                  )}
                  {status === "Closed" && (
                    <p>🔒 This job will be marked as closed</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
