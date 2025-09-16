import { useEffect, useState } from "react";
import { db } from "../db/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assessments() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch jobs from IndexedDB
        let jobsData = [];
        if (window.api?.getJobs) {
          jobsData = await window.api.getJobs();
        } else {
          jobsData = await db.jobs.toArray();
        }
        setJobs(jobsData);

        // Fetch assessments from IndexedDB
        let assessmentsData = [];
        if (window.api?.getAssessments) {
          assessmentsData = await window.api.getAssessments();
        } else {
          assessmentsData = await db.assessments.toArray();
        }

        // Enrich assessments with job title + total questions
        const enriched = assessmentsData.map((a) => {
          const job = jobsData.find((j) => j.id === a.jobId);
          const totalQuestions = (a.sections || []).reduce(
            (acc, s) => acc + (s.questions?.length || 0),
            0
          );
          return {
            ...a,
            jobTitle: job?.title || "Job not found",
            totalQuestions,
          };
        });

        setAssessments(enriched);
      } catch (err) {
        console.error("Failed to fetch assessments/jobs:", err);
      }
    }

    fetchData();
  }, []);

  const viewAssessmentHandler = (id) => {
    navigate(`/assessment/view/${id}`);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <Button
          className="bg-blue-600 text-white rounded-2xl"
          onClick={() => navigate("/assessment/create")}
        >
          + Create Assessment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.length > 0 ? (
          assessments.map((a) => (
            <Card
              key={a.id}
              className="flex flex-col justify-between hover:shadow-lg cursor-pointer transition-all duration-200"
            >
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{a.jobTitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {a.sections?.length || 0} sections, {a.totalQuestions} questions
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="flex items-center justify-between w-full"
                  onClick={() => viewAssessmentHandler(a.id)}
                >
                  View Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No assessments found.</p>
        )}
      </div>
    </div>
  );
}
