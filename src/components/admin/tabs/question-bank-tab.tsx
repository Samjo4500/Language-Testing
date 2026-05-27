'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen, Plus, Trash2, Edit, Upload, Download, Eye,
  Search, Filter, Star, ChevronDown, ChevronUp, X,
  RefreshCw, FileText, BarChart3, CheckCircle2, AlertCircle,
  Volume2, Mic, PenTool, HelpCircle, Layers,
} from 'lucide-react';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, CEFR_LEVELS, CEFR_COLORS_DARK, CEFR_PIE_COLORS,
  SKILLS, SKILL_LABELS, cefrBadge, statusBadge, formatDate, formatNumber,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface QuestionBankTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

// ─── Types ───────────────────────────────────────────────
interface QuestionStats {
  [level: string]: {
    [skill: string]: number;
  };
}

interface QuestionRecord {
  id: string;
  text: string;
  level: string;
  category: string;
  type: string;
  difficultyTier: number;
  options: string;
  correctIndex: number;
  explanation: string | null;
  isActive: boolean;
  timesUsed: number;
  avgScore: number;
  tags: string[];
  audioUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  versionHistory: { date: string; changes: string }[];
}

interface QuestionFormData {
  text: string;
  type: string;
  level: string;
  skill: string;
  difficulty: number;
  options: string[];
  correctIndex: number;
  audioUrl: string;
  imageUrl: string;
  explanation: string;
  tags: string;
}

const QUESTION_TYPES = [
  { value: 'mcq', label: 'MCQ', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'fill', label: 'Fill-in-blank', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'audio', label: 'Audio Comprehension', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'speaking', label: 'Speaking Prompt', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { value: 'writing', label: 'Writing Prompt', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
];

const DIFFICULTY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

const defaultFormData: QuestionFormData = {
  text: '',
  type: 'mcq',
  level: 'A1',
  skill: 'grammar',
  difficulty: 3,
  options: ['', '', '', ''],
  correctIndex: 0,
  audioUrl: '',
  imageUrl: '',
  explanation: '',
  tags: '',
};

export function QuestionBankTab({ onToast }: QuestionBankTabProps) {
  // ─── State ────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Search & filters
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<string[]>([]);
  const [filterSkill, setFilterSkill] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({ ...defaultFormData });
  const [saving, setSaving] = useState(false);

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionRecord | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState<QuestionRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Expanded rows (version history)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Bulk import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch stats ──────────────────────────────────
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions/stats', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || null);
        setTotalQuestions(data.total || 0);
      }
    } catch (e) {
      console.error('Fetch question stats error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch questions (mock from stats + generated) ─
  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    try {
      // We'll generate mock questions from stats for now
      // In production this would hit a paginated questions API
      const res = await fetch('/api/admin/questions/stats', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        const mockQuestions: QuestionRecord[] = [];
        let idx = 0;
        const allLevels = CEFR_LEVELS;
        const allSkills = ['grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'];
        const allTypes = ['mcq', 'fill', 'audio', 'speaking', 'writing'];

        for (const level of allLevels) {
          for (const skill of allSkills) {
            const count = data.stats?.[level]?.[skill] || 0;
            const typeForSkill = skill === 'listening' ? 'audio' : skill === 'speaking' ? 'speaking' : skill === 'writing' ? 'writing' : skill === 'reading' ? 'mcq' : Math.random() > 0.5 ? 'mcq' : 'fill';
            for (let i = 0; i < Math.min(count, 3); i++) {
              idx++;
              mockQuestions.push({
                id: `q_${idx}`,
                text: `${skill.charAt(0).toUpperCase() + skill.slice(1)} question for ${level} level — ${typeForSkill === 'mcq' ? 'Choose the correct answer.' : typeForSkill === 'fill' ? 'Fill in the blank with the appropriate word.' : typeForSkill === 'audio' ? 'Listen to the audio and answer the question.' : typeForSkill === 'speaking' ? 'Respond to the following prompt verbally.' : 'Write a response to the following prompt.'}`,
                level,
                category: skill,
                type: typeForSkill,
                difficultyTier: Math.floor(Math.random() * 5) + 1,
                options: '["Option A","Option B","Option C","Option D"]',
                correctIndex: Math.floor(Math.random() * 4),
                explanation: 'This is the explanation for why the correct answer is right.',
                isActive: Math.random() > 0.1,
                timesUsed: Math.floor(Math.random() * 500),
                avgScore: Math.floor(Math.random() * 40 + 60),
                tags: [skill, level.toLowerCase()],
                audioUrl: typeForSkill === 'audio' ? 'https://example.com/audio/sample.mp3' : null,
                imageUrl: null,
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                versionHistory: [
                  { date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), changes: 'Initial creation' },
                ],
              });
            }
          }
        }

        setQuestions(mockQuestions);
        setTotalPages(Math.ceil(mockQuestions.length / 25));
        if (mockQuestions.length > 0) {
          setLastAdded(mockQuestions.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b).createdAt);
        }
      }
    } catch (e) {
      console.error('Fetch questions error:', e);
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchQuestions();
  }, [fetchStats, fetchQuestions]);

  // ─── Filtered questions ────────────────────────────
  const filteredQuestions = questions.filter(q => {
    if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.id.includes(search)) return false;
    if (filterLevel.length > 0 && !filterLevel.includes(q.level)) return false;
    if (filterSkill.length > 0 && !filterSkill.includes(q.category)) return false;
    if (filterType.length > 0 && !filterType.includes(q.type)) return false;
    if (filterDifficulty.length > 0 && !filterDifficulty.includes(q.difficultyTier)) return false;
    return true;
  });

  const pagedQuestions = filteredQuestions.slice((page - 1) * 25, page * 25);

  // ─── Stats by skill ───────────────────────────────
  const skillCounts: Record<string, number> = {};
  if (stats) {
    for (const level of Object.values(stats)) {
      for (const [skill, count] of Object.entries(level)) {
        skillCounts[skill] = (skillCounts[skill] || 0) + count;
      }
    }
  }

  // ─── Type badge ────────────────────────────────────
  const typeBadge = (type: string) => {
    const t = QUESTION_TYPES.find(qt => qt.value === type);
    if (!t) return <span className="text-white/30 text-xs">—</span>;
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${t.color}`}>{t.label}</span>;
  };

  // ─── Difficulty dots ───────────────────────────────
  const difficultyDots = (level: number) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < level
              ? level <= 2 ? 'bg-green-400' : level <= 3 ? 'bg-yellow-400' : 'bg-red-400'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );

  // ─── Toggle filter value ───────────────────────────
  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    setPage(1);
  };

  const toggleDifficultyFilter = (val: number) => {
    setFilterDifficulty(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    setPage(1);
  };

  // ─── Open Add dialog ──────────────────────────────
  const openAddDialog = () => {
    setFormData({ ...defaultFormData });
    setEditMode(false);
    setEditId(null);
    setDialogOpen(true);
  };

  // ─── Open Edit dialog ─────────────────────────────
  const openEditDialog = (q: QuestionRecord) => {
    const opts = (() => {
      try { return JSON.parse(q.options); } catch { return ['', '', '', '']; }
    })();
    setFormData({
      text: q.text,
      type: q.type,
      level: q.level,
      skill: q.category,
      difficulty: q.difficultyTier,
      options: opts.length === 4 ? opts : ['', '', '', ''],
      correctIndex: q.correctIndex,
      audioUrl: q.audioUrl || '',
      imageUrl: q.imageUrl || '',
      explanation: q.explanation || '',
      tags: (q.tags || []).join(', '),
    });
    setEditMode(true);
    setEditId(q.id);
    setDialogOpen(true);
  };

  // ─── Save question ────────────────────────────────
  const handleSaveQuestion = async () => {
    if (!formData.text.trim()) {
      onToast('Question text is required', 'error');
      return;
    }
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      if (editMode && editId) {
        setQuestions(prev => prev.map(q => {
          if (q.id !== editId) return q;
          return {
            ...q,
            text: formData.text,
            level: formData.level,
            category: formData.skill,
            type: formData.type,
            difficultyTier: formData.difficulty,
            options: JSON.stringify(formData.options),
            correctIndex: formData.correctIndex,
            explanation: formData.explanation || null,
            audioUrl: formData.audioUrl || null,
            imageUrl: formData.imageUrl || null,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
            versionHistory: [
              ...q.versionHistory,
              { date: new Date().toISOString(), changes: 'Question updated' },
            ],
          };
        }));
        onToast('Question updated successfully', 'success');
      } else {
        const newQ: QuestionRecord = {
          id: `q_${Date.now()}`,
          text: formData.text,
          level: formData.level,
          category: formData.skill,
          type: formData.type,
          difficultyTier: formData.difficulty,
          options: JSON.stringify(formData.options),
          correctIndex: formData.correctIndex,
          explanation: formData.explanation || null,
          isActive: true,
          timesUsed: 0,
          avgScore: 0,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          audioUrl: formData.audioUrl || null,
          imageUrl: formData.imageUrl || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versionHistory: [
            { date: new Date().toISOString(), changes: 'Initial creation' },
          ],
        };
        setQuestions(prev => [newQ, ...prev]);
        setTotalQuestions(prev => prev + 1);
        setLastAdded(newQ.createdAt);
        onToast('Question added successfully', 'success');
      }
      setDialogOpen(false);
      setSaving(false);
    }, 500);
  };

  // ─── Delete question ──────────────────────────────
  const handleDeleteQuestion = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    setTimeout(() => {
      setQuestions(prev => prev.filter(q => q.id !== confirmDelete.id));
      setTotalQuestions(prev => prev - 1);
      setDeleteLoading(false);
      setConfirmDelete(null);
      onToast('Question deleted', 'success');
    }, 300);
  };

  // ─── Export questions ──────────────────────────────
  const handleExport = () => {
    const exportData = filteredQuestions.map(q => ({
      id: q.id,
      text: q.text,
      level: q.level,
      category: q.category,
      type: q.type,
      difficulty: q.difficultyTier,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      isActive: q.isActive,
      timesUsed: q.timesUsed,
      avgScore: q.avgScore,
      tags: q.tags,
      createdAt: q.createdAt,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Questions exported successfully', 'success');
  };

  // ─── Bulk import ──────────────────────────────────
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const imported = JSON.parse(content);
        if (!Array.isArray(imported)) throw new Error('Expected array');
        const newQuestions: QuestionRecord[] = imported.map((q: any, i: number) => ({
          id: q.id || `q_import_${Date.now()}_${i}`,
          text: q.text || '',
          level: q.level || 'A1',
          category: q.category || q.skill || 'grammar',
          type: q.type || 'mcq',
          difficultyTier: q.difficulty || q.difficultyTier || 3,
          options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options || ['', '', '', '']),
          correctIndex: q.correctIndex || 0,
          explanation: q.explanation || null,
          isActive: q.isActive !== false,
          timesUsed: q.timesUsed || 0,
          avgScore: q.avgScore || 0,
          tags: q.tags || [],
          audioUrl: q.audioUrl || null,
          imageUrl: q.imageUrl || null,
          createdAt: q.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versionHistory: [{ date: new Date().toISOString(), changes: 'Imported' }],
        }));
        setQuestions(prev => [...newQuestions, ...prev]);
        setTotalQuestions(prev => prev + newQuestions.length);
        onToast(`Imported ${newQuestions.length} questions`, 'success');
      } catch {
        onToast('Invalid file format. Expected JSON array.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Toggle expanded row ──────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Update form options ──────────────────────────
  const updateOption = (index: number, value: string) => {
    setFormData(prev => {
      const opts = [...prev.options];
      opts[index] = value;
      return { ...prev, options: opts };
    });
  };

  // ═══════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* ─── Question Stats Cards ───────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Questions"
            value={formatNumber(totalQuestions)}
            gradient="from-blue-600 to-blue-500"
          />
          <StatCard
            icon={BarChart3}
            label="By Level"
            value={`${CEFR_LEVELS.filter(l => stats && stats[l] && Object.values(stats[l]).some(c => c > 0)).length} levels`}
            subtitle={CEFR_LEVELS.map(l => {
              const count = stats?.[l] ? Object.values(stats[l]).reduce((a: number, b: number) => a + b, 0) : 0;
              return `${l}:${count}`;
            }).join(' · ')}
            gradient="from-violet-600 to-violet-500"
          />
          <StatCard
            icon={Layers}
            label="By Skill"
            value={`${Object.keys(skillCounts).filter(k => skillCounts[k] > 0).length} skills`}
            subtitle={Object.entries(skillCounts).map(([s, c]) => `${SKILL_LABELS[s] || s}:${c}`).join(' · ')}
            gradient="from-green-600 to-green-500"
          />
          <StatCard
            icon={RefreshCw}
            label="Last Added"
            value={lastAdded ? formatDate(lastAdded) : '—'}
            gradient="from-amber-600 to-amber-500"
          />
        </div>
      )}

      {/* ─── Search + Filters ───────────────────────── */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search questions by text or ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2 ${showFilters ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : ''}`}
            >
              <Filter className="h-4 w-4" /> Filters
              {(filterLevel.length + filterSkill.length + filterType.length + filterDifficulty.length) > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">
                  {filterLevel.length + filterSkill.length + filterType.length + filterDifficulty.length}
                </span>
              )}
            </Button>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 gap-2"
            >
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/5">
            {/* Level filter */}
            <div>
              <Label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">CEFR Level</Label>
              <div className="flex flex-wrap gap-1.5">
                {CEFR_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => toggleFilter(filterLevel, level, setFilterLevel)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterLevel.includes(level)
                        ? CEFR_COLORS_DARK[level] || 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill filter */}
            <div>
              <Label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Skill</Label>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleFilter(filterSkill, skill, setFilterSkill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterSkill.includes(skill)
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                    }`}
                  >
                    {SKILL_LABELS[skill] || skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div>
              <Label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Question Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {QUESTION_TYPES.map(qt => (
                  <button
                    key={qt.value}
                    onClick={() => toggleFilter(filterType, qt.value, setFilterType)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterType.includes(qt.value)
                        ? qt.color
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                    }`}
                  >
                    {qt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div>
              <Label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Difficulty</Label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDifficultyFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      filterDifficulty.includes(d)
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                    }`}
                  >
                    {d} - {DIFFICULTY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">
            Showing <span className="text-white font-medium">{filteredQuestions.length}</span> of {formatNumber(totalQuestions)} questions
          </span>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
            >
              <Upload className="h-4 w-4" /> Import
            </Button>
            <ExportButton onClick={handleExport} label="Export JSON" />
          </div>
        </div>
      </div>

      {/* ─── Questions Table ────────────────────────── */}
      <div className="glass-card overflow-hidden">
        {questionsLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : pagedQuestions.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No questions found"
            description="Try adjusting your search or filter criteria, or add a new question."
            action={{ label: 'Add Question', onClick: openAddDialog }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-4 py-3 w-8"></th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Question</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Level</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Skill</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Type</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Difficulty</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Used</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Avg Score</th>
                  <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedQuestions.map(q => (
                  <>
                    <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(q.id)}
                          className="text-white/30 hover:text-white transition-colors"
                        >
                          {expandedRows.has(q.id) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-[300px]">
                          <p className="text-white/80 text-sm truncate">{q.text}</p>
                          <p className="text-white/30 text-xs mt-0.5 font-mono">{q.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{cefrBadge(q.level)}</td>
                      <td className="px-4 py-3">
                        <span className="text-white/60 text-xs">{SKILL_LABELS[q.category] || q.category}</span>
                      </td>
                      <td className="px-4 py-3">{typeBadge(q.type)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {difficultyDots(q.difficultyTier)}
                          <span className="text-white/40 text-xs">{q.difficultyTier}/5</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{formatNumber(q.timesUsed)}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">
                        {q.timesUsed > 0 ? `${q.avgScore}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setPreviewQuestion(q); setPreviewOpen(true); }}
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Preview"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditDialog(q)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(q)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded: Version History */}
                    {expandedRows.has(q.id) && (
                      <tr key={`${q.id}-history`} className="border-b border-white/5 bg-white/[0.01]">
                        <td colSpan={9} className="px-8 py-3">
                          <div className="space-y-2">
                            <h4 className="text-white/40 text-xs uppercase tracking-wider font-medium flex items-center gap-2">
                              <RefreshCw className="h-3 w-3" /> Version History
                            </h4>
                            {q.versionHistory.length === 0 ? (
                              <p className="text-white/30 text-xs">No history available</p>
                            ) : (
                              q.versionHistory.map((vh, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                  <span className="text-white/30">{formatDate(vh.date)}</span>
                                  <span className="text-white/50">{vh.changes}</span>
                                </div>
                              ))
                            )}
                            <div className="flex items-center gap-4 text-xs text-white/30 mt-2">
                              <span>Created: {formatDate(q.createdAt)}</span>
                              <span>Updated: {formatDate(q.updatedAt)}</span>
                              <span>Status: {q.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredQuestions.length > 25 && (
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              total={filteredQuestions.length}
              pageSize={25}
            />
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          ADD / EDIT QUESTION DIALOG
         ═══════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {editMode ? <Edit className="h-5 w-5 text-blue-400" /> : <Plus className="h-5 w-5 text-green-400" />}
              {editMode ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription className="text-white/40">
              {editMode ? 'Modify the question details below.' : 'Create a new question for the question bank.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Question text */}
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Question Text *</Label>
              <textarea
                value={formData.text}
                onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter the question text..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            {/* Type + Level + Skill row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Question Type</Label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={selectClass}
                >
                  {QUESTION_TYPES.map(qt => (
                    <option key={qt.value} value={qt.value} className={selectOptionClass}>{qt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">CEFR Level</Label>
                <select
                  value={formData.level}
                  onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className={selectClass}
                >
                  {CEFR_LEVELS.map(l => (
                    <option key={l} value={l} className={selectOptionClass}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Skill</Label>
                <select
                  value={formData.skill}
                  onChange={e => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                  className={selectClass}
                >
                  {SKILLS.map(s => (
                    <option key={s} value={s} className={selectOptionClass}>{SKILL_LABELS[s] || s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty slider */}
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Difficulty ({formData.difficulty}/5 — {DIFFICULTY_LABELS[formData.difficulty]})</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={formData.difficulty}
                  onChange={e => setFormData(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
                  className="flex-1 h-2 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < formData.difficulty ? 'bg-violet-500' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* MCQ Options */}
            {formData.type === 'mcq' && (
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Options (mark correct answer)</Label>
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, correctIndex: i }))}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          formData.correctIndex === i
                            ? 'border-green-400 bg-green-500/20 text-green-400'
                            : 'border-white/20 text-white/30 hover:border-white/40'
                        }`}
                      >
                        {label}
                      </button>
                      <Input
                        value={formData.options[i] || ''}
                        onChange={e => updateOption(i, e.target.value)}
                        placeholder={`Option ${label}`}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio URL */}
            {formData.type === 'audio' && (
              <div>
                <Label className="text-white/60 text-sm mb-2 block flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5" /> Audio File URL
                </Label>
                <Input
                  value={formData.audioUrl}
                  onChange={e => setFormData(prev => ({ ...prev, audioUrl: e.target.value }))}
                  placeholder="https://example.com/audio/question.mp3"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                />
              </div>
            )}

            {/* Image URL */}
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Image URL (optional)</Label>
              <Input
                value={formData.imageUrl}
                onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image/prompt.jpg"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
              />
            </div>

            {/* Explanation */}
            <div>
              <Label className="text-white/60 text-sm mb-2 block flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" /> Explanation (shown after answer)
              </Label>
              <textarea
                value={formData.explanation}
                onChange={e => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Explain why the correct answer is right..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="grammar, tenses, present-perfect"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
              <Button
                onClick={handleSaveQuestion}
                disabled={saving || !formData.text.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400"
              >
                {saving ? 'Saving...' : editMode ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
          PREVIEW DIALOG
         ═══════════════════════════════════════════════ */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" /> Question Preview
            </DialogTitle>
            <DialogDescription className="text-white/40">How this question appears to a test taker.</DialogDescription>
          </DialogHeader>

          {previewQuestion && (
            <div className="space-y-4 py-2">
              {/* Question header badges */}
              <div className="flex flex-wrap items-center gap-2">
                {cefrBadge(previewQuestion.level)}
                {typeBadge(previewQuestion.type)}
                <span className="text-white/40 text-xs">{SKILL_LABELS[previewQuestion.category] || previewQuestion.category}</span>
                <span className="text-white/20 text-xs">•</span>
                {difficultyDots(previewQuestion.difficultyTier)}
                <span className="text-white/30 text-xs">({previewQuestion.difficultyTier}/5)</span>
              </div>

              {/* Audio indicator */}
              {previewQuestion.audioUrl && (
                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3">
                  <Volume2 className="h-5 w-5 text-orange-400" />
                  <span className="text-orange-300 text-sm">Audio question — listen and respond</span>
                </div>
              )}

              {/* Question text */}
              <div className="glass-card p-5">
                <p className="text-white/90 text-sm leading-relaxed">{previewQuestion.text}</p>
              </div>

              {/* MCQ options preview */}
              {previewQuestion.type === 'mcq' && (() => {
                let opts: string[] = [];
                try { opts = JSON.parse(previewQuestion.options); } catch { /* */ }
                if (opts.length === 0) return null;
                return (
                  <div className="space-y-2">
                    {opts.map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                          i === previewQuestion.correctIndex
                            ? 'border-green-500/30 bg-green-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                          i === previewQuestion.correctIndex
                            ? 'border-green-400 text-green-400'
                            : 'border-white/20 text-white/30'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className={`text-sm ${i === previewQuestion.correctIndex ? 'text-green-300' : 'text-white/70'}`}>
                          {opt}
                        </span>
                        {i === previewQuestion.correctIndex && (
                          <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Speaking/Writing prompt indicators */}
              {previewQuestion.type === 'speaking' && (
                <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-4 py-3">
                  <Mic className="h-5 w-5 text-violet-400" />
                  <span className="text-violet-300 text-sm">Record your spoken response</span>
                </div>
              )}
              {previewQuestion.type === 'writing' && (
                <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-3">
                  <PenTool className="h-5 w-5 text-cyan-400" />
                  <span className="text-cyan-300 text-sm">Type your written response below</span>
                </div>
              )}

              {/* Explanation */}
              {previewQuestion.explanation && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
                  <p className="text-blue-300 text-xs font-medium mb-1 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5" /> Explanation
                  </p>
                  <p className="text-white/60 text-sm">{previewQuestion.explanation}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-xs text-white/30">
                <span>ID: {previewQuestion.id}</span>
                <span>Used: {previewQuestion.timesUsed} times</span>
                {previewQuestion.timesUsed > 0 && <span>Avg Score: {previewQuestion.avgScore}%</span>}
                <span>Created: {formatDate(previewQuestion.createdAt)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
          DELETE CONFIRM MODAL
         ═══════════════════════════════════════════════ */}
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        message={`Are you sure you want to delete this question? This action cannot be undone. The question has been used ${confirmDelete?.timesUsed || 0} times.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
