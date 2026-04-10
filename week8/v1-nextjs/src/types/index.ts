export interface JobPost {
  id: string;
  blockId: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  description: string | null;
  url: string;
  source: string;
  status: "to_apply" | "applied";
  appliedAt: string | null;
  createdAt: string;
}

export interface JobSource {
  id: string;
  blockId: string;
  name: string;
  url: string | null;
  type: string;
}

export interface JobBlock {
  id: string;
  title: string;
  color: string;
  resumePath: string | null;
  resumeText: string | null;
  createdAt: string;
  updatedAt: string;
  jobs: JobPost[];
  sources: JobSource[];
}
