export interface SearchResult {
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  description: string | null;
  url: string;
  source: string;
}

// Remotive API - free, no key needed, remote jobs
async function searchRemotive(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=15`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).slice(0, 15).map((job: Record<string, string>) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || "Remote",
      salary: job.salary || null,
      description: job.description || null,
      url: job.url,
      source: "Remotive",
    }));
  } catch {
    return [];
  }
}

// Arbeitnow API - free, no key needed
async function searchArbeitnow(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 15).map((job: Record<string, string>) => ({
      title: job.title,
      company: job.company_name,
      location: job.location || null,
      salary: null,
      description: job.description || null,
      url: job.url,
      source: "Arbeitnow",
    }));
  } catch {
    return [];
  }
}

// Fallback: generate mock job data based on keywords
function generateMockJobs(query: string, count: number = 10): SearchResult[] {
  const companies = [
    "Google", "Meta", "Apple", "Amazon", "Netflix", "Microsoft", "Stripe",
    "Airbnb", "Uber", "Spotify", "Slack", "Figma", "Notion", "Vercel",
    "Shopify", "Square", "Coinbase", "Robinhood", "Plaid", "Datadog",
  ];
  const locations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Remote", "Chicago, IL", "Boston, MA", "Los Angeles, CA",
    "Denver, CO", "Atlanta, GA",
  ];
  const salaryRanges = [
    "$120K - $160K", "$140K - $180K", "$160K - $220K",
    "$100K - $140K", "$180K - $250K", null,
  ];

  return Array.from({ length: count }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const salary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];

    return {
      title: `${query} ${["Engineer", "Analyst", "Developer", "Specialist", "Lead"][i % 5]}`,
      company,
      location,
      salary,
      description: `<h3>About the Role</h3><p>We are looking for a talented ${query} professional to join ${company}. This is an exciting opportunity to work on cutting-edge projects.</p><h3>Responsibilities</h3><ul><li>Design and implement solutions for ${query} related challenges</li><li>Collaborate with cross-functional teams</li><li>Drive technical decisions and best practices</li><li>Mentor junior team members</li></ul><h3>Requirements</h3><ul><li>3+ years of experience in ${query} or related field</li><li>Strong problem-solving skills</li><li>Excellent communication skills</li><li>Bachelor's degree in a relevant field</li></ul><h3>Benefits</h3><ul><li>Competitive salary and equity</li><li>Health, dental, and vision insurance</li><li>Flexible work arrangements</li><li>Professional development budget</li></ul>`,
      url: `https://careers.${company.toLowerCase().replace(/\s/g, "")}.com/jobs/${Date.now()}-${i}`,
      source: "Mock",
    };
  });
}

export async function searchJobs(
  query: string,
  resumeKeywords: string[] = [],
  minResults: number = 10
): Promise<SearchResult[]> {
  const searchQuery = resumeKeywords.length > 0
    ? `${query} ${resumeKeywords.slice(0, 3).join(" ")}`
    : query;

  // Search multiple sources in parallel
  const [remotiveJobs, arbeitnowJobs] = await Promise.all([
    searchRemotive(searchQuery),
    searchArbeitnow(searchQuery),
  ]);

  let allJobs = [...remotiveJobs, ...arbeitnowJobs];

  // Deduplicate by title + company
  const seen = new Set<string>();
  allJobs = allJobs.filter((job) => {
    const key = `${job.title}-${job.company}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // If not enough real results, fill with mock data
  if (allJobs.length < minResults) {
    const mockCount = minResults - allJobs.length;
    allJobs = [...allJobs, ...generateMockJobs(query, mockCount)];
  }

  return allJobs.slice(0, Math.max(minResults, 15));
}
