// Release steps configuration (same for all releases)
export const RELEASE_STEPS = [
  "Build completed",
  "Tests passed",
  "Documentation updated",
  "Staging deployed",
  "Code reviewed",
  "Merge to main",
  "Production deployed",
  "Monitoring verified"
] as const;

export type ReleaseStep = typeof RELEASE_STEPS[number];

// Release status types
export type ReleaseStatus = "planned" | "ongoing" | "done";

// Release model
export interface Release {
  id: string;
  name: string;
  date: string; // ISO datetime
  status: ReleaseStatus;
  additional_info?: string;
  completed_steps: ReleaseStep[];
  created_at: string;
  updated_at: string;
}

// Create release input
export interface CreateReleaseInput {
  name: string;
  additional_info?: string;
  date: string;
}

// Update release input
export interface UpdateReleaseInput {
  additional_info?: string;
  completed_steps?: ReleaseStep[];
}
