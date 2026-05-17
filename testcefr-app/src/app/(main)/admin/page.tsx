'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'];

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-blue-100 text-blue-800',
  A2: 'bg-green-100 text-green-800',
  B1: 'bg-yellow-100 text-yellow-800',
  B2: 'bg-orange-100 text-orange-800',
  C1: 'bg-red-100 text-red-800',
  C2: 'bg-purple-100 text-purple-800',
};

interface Stats {
  stats: Record<string, Record<string, number>>;
  total: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user, accessToken } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fill Question Bank state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(CEFR_LEVELS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(SKILLS);
  const [countPerSlot, setCountPerSlot] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [generationError, setGenerationError] = useState('');

  // Redirect non-admin users
  useEffect(() => {
    if (!authIsLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [authIsLoading, isAuthenticated, user, router]);

  // Fetch question bank stats
  const fetchStats = useCallback(async () => {
    if (!accessToken) return;
    setStatsLoading(true);
    try {
      const response = await fetch('/api/admin/questions/stats', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (authIsLoading || !isAuthenticated || !accessToken) return;
    fetchStats();
  }, [authIsLoading, isAuthenticated, accessToken, fetchStats]);

  // Toggle helpers
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleAllLevels = () => {
    setSelectedLevels((prev) => (prev.length === CEFR_LEVELS.length ? [] : [...CEFR_LEVELS]));
  };

  const toggleAllSkills = () => {
    setSelectedSkills((prev) => (prev.length === SKILLS.length ? [] : [...SKILLS]));
  };

  // Batch generation
  const handleGenerate = async () => {
    if (!accessToken) return;
    setGenerating(true);
    setGenerationError('');
    setGenerationResult(null);

    try {
      const response = await fetch('/api/admin/questions/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          levels: selectedLevels,
          skills: selectedSkills,
          countPerSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Generation failed');
      }

      setGenerationResult(data);
      fetchStats(); // Refresh stats
    } catch (error: any) {
      setGenerationError(error.message || 'An error occurred during generation.');
    } finally {
      setGenerating(false);
    }
  };

  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const totalSlots = selectedLevels.length * selectedSkills.length;
  const totalTarget = totalSlots * countPerSlot;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Database className="h-6 w-6" />
                Admin — Question Bank
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and generate CEFR assessment questions
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {stats?.total ?? 0} total questions
            </Badge>
          </div>

          {/* Stats Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Question Bank Status</CardTitle>
                  <CardDescription>Current question count per level and skill</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={fetchStats}
                  disabled={statsLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${statsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading && !stats ? (
                <Skeleton className="h-48 w-full" />
              ) : stats ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Level</TableHead>
                      {SKILLS.map((skill) => (
                        <TableHead key={skill} className="text-center capitalize">
                          {skill}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Row Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CEFR_LEVELS.map((level) => {
                      const rowTotal = SKILLS.reduce(
                        (sum, skill) => sum + (stats.stats[level]?.[skill] || 0),
                        0
                      );
                      return (
                        <TableRow key={level}>
                          <TableCell>
                            <Badge className={CEFR_COLORS[level]}>{level}</Badge>
                          </TableCell>
                          {SKILLS.map((skill) => {
                            const count = stats.stats[level]?.[skill] || 0;
                            return (
                              <TableCell key={skill} className="text-center">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    count >= 50
                                      ? 'bg-green-100 text-green-800'
                                      : count > 0
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {count}
                                </span>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-medium">{rowTotal}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>

          {/* Fill Question Bank Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="lg">
                <BookOpen className="h-5 w-5" />
                Fill Question Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Fill Question Bank</DialogTitle>
                <DialogDescription>
                  Automatically generates questions for each selected level × skill combination
                  until the target count is reached. Runs in the background — you can close this
                  modal.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* CEFR Levels Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">CEFR Levels</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={toggleAllLevels}
                    >
                      {selectedLevels.length === CEFR_LEVELS.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CEFR_LEVELS.map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                          selectedLevels.includes(level)
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        }`}
                      >
                        <Checkbox
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                        />
                        <Badge className={CEFR_COLORS[level]}>{level}</Badge>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Skills</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={toggleAllSkills}
                    >
                      {selectedSkills.length === SKILLS.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors capitalize ${
                          selectedSkills.includes(skill)
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        }`}
                      >
                        <Checkbox
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Count per slot */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Target questions per level × skill</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={countPerSlot}
                    onChange={(e) => setCountPerSlot(Number(e.target.value))}
                    className="w-48"
                  />
                  <p className="text-sm text-muted-foreground">
                    Total target: {totalSlots} slots × {countPerSlot} = <strong>{totalTarget}</strong> questions
                  </p>
                </div>

                {/* Generation Result */}
                {generationError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{generationError}</span>
                  </div>
                )}

                {generationResult && (
                  <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">
                        Generated {generationResult.totalGenerated} new questions
                        ({generationResult.totalSkipped} already existed)
                      </p>
                      <div className="mt-2 space-y-1">
                        {generationResult.results?.map((r: any, i: number) => (
                          <p key={i} className="text-xs">
                            {r.level}/{r.skill}: +{r.generated} generated, {r.skipped} existing
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button
                  className="gap-2"
                  onClick={handleGenerate}
                  disabled={generating || !selectedLevels.length || !selectedSkills.length}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Start Batch Generation</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
