"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile, saveProfile } from "@/lib/profile";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<UserProfile["experienceLevel"]>("mid");
  const [careerGoals, setCareerGoals] = useState("");

  useEffect(() => {
    const existing = getProfile();
    if (existing) {
      setIndustry(existing.industry);
      setExperienceLevel(existing.experienceLevel);
      setCareerGoals(existing.careerGoals);
    }
  }, []);

  const handleSave = () => {
    if (!industry.trim()) return;
    saveProfile({ industry: industry.trim(), experienceLevel, careerGoals: careerGoals.trim() });
    router.push("/practice");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Tell us about your background so we can personalize interview
            questions and feedback to your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Input
              id="industry"
              placeholder="e.g. Software Engineering, Finance, Healthcare, Marketing"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Experience Level <span className="text-red-500">*</span>
            </Label>
            <Select
              value={experienceLevel}
              onValueChange={(v) =>
                setExperienceLevel(v as UserProfile["experienceLevel"])
              }
            >
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select level">
                  {experienceLevel === "entry" && "Entry Level (0-2 years)"}
                  {experienceLevel === "mid" && "Mid Level (3-5 years)"}
                  {experienceLevel === "senior" && "Senior (6-10 years)"}
                  {experienceLevel === "executive" && "Executive (10+ years)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">
                  Entry Level (0-2 years)
                </SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                <SelectItem value="executive">
                  Executive (10+ years)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Career Goals</Label>
            <Textarea
              id="goals"
              placeholder="e.g. Transitioning to product management, aiming for a senior engineer role at a FAANG company, moving into leadership..."
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional but recommended — helps tailor questions to your
              aspirations.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!industry.trim()}
            className="w-full"
            size="lg"
          >
            Save & Start Practicing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
