import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RELEASE_STEPS, ReleaseStatus } from "@/types/release";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate release status based on completed steps
export function calculateStatus(completedSteps: string[]): ReleaseStatus {
  const totalSteps = RELEASE_STEPS.length;
  const completedCount = completedSteps.length;

  if (completedCount === 0) {
    return "planned";
  } else if (completedCount < totalSteps) {
    return "ongoing";
  } else {
    return "done";
  }
}
