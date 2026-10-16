'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  WEBSITE_CRITERIA_LIST,
  CRITERIA_CATEGORIES,
  CriterionItem,
  CriteriaCategory,
} from '@/lib/criteria-data';
import { CodeBlock } from '@/components/docs/CodeBlock';
import {
  Check,
  Copy,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  Code2,
  Layers,
  Database,
  GitBranch,
  Monitor,
} from 'lucide-react';

const STORAGE_KEY = 'pbl_website_criteria_checks';

export function CriteriaView() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [coreOnlyFilter, setCoreOnlyFilter] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCheckedMap(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle single item
  const toggleItem = (id: string) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle card snippet expansion
  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Expand all / Collapse all snippets
  const toggleExpandAll = () => {
    const allExpanded = WEBSITE_CRITERIA_LIST.every((c) => expandedCards[c.id]);
    const nextState: Record<string, boolean> = {};
    WEBSITE_CRITERIA_LIST.forEach((c) => {
      nextState[c.id] = !allExpanded;
    });
    setExpandedCards(nextState);
  };

  // Reset checklist
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh ceklis kriteria?')) {
      setCheckedMap({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      showToast('Seluruh ceklis kriteria telah direset.');
    }
  };

  // Mark all current visible items as done
  const handleMarkAllVisibleDone = () => {
    setCheckedMap((prev) => {
      const next = { ...prev };
      filteredItems.forEach((item) => {
        next[item.id] = true;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`${filteredItems.length} kriteria ditandai selesai.`);
  };

  // Export / Copy markdown summary
  const handleCopyReport = async () => {
    const totalCount = WEBSITE_CRITERIA_LIST.length;
    const completedCount = WEBSITE_CRITERIA_LIST.filter((c) => checkedMap[c.id]).length;
    const percent = Math.round((completedCount / totalCount) * 100);

    let report = `# LAPORAN EVALUASI KESIAPAN WEBSITE PROYEK (PBL)\n`;
    report += `Status Total: ${completedCount}/${totalCount} Kriteria Terpenuhi (${percent}%)\n\n`;

    CRITERIA_CATEGORIES.forEach((cat) => {
      const catItems = WEBSITE_CRITERIA_LIST.filter((c) => c.category === cat.id);
      const catDone = catItems.filter((c) => checkedMap[c.id]).length;
      const catPct = Math.round((catDone / catItems.length) * 100);

      report += `## ${cat.name} (${catDone}/${catItems.length} · ${catPct}%)\n`;
      catItems.forEach((item) => {
        const isDone = Boolean(checkedMap[item.id]);
        report += `- [${isDone ? 'x' : ' '}] ${item.title} (${item.isCore ? 'Wajib' : 'Lanjutan'})\n`;
      });
      report += `\n`;
    });

    report += `\nDisalin pada: ${new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;

    try {
      await navigator.clipboard.writeText(report);
      showToast('Laporan berhasil disalin ke clipboard dalam format Markdown!');
    } catch {
      showToast('Gagal menyalin ke clipboard.');
    }
  };

  // Calculate statistics
  const totalCount = WEBSITE_CRITERIA_LIST.length;
  const completedCount = useMemo(() => {
    return WEBSITE_CRITERIA_LIST.filter((c) => checkedMap[c.id]).length;
  }, [checkedMap]);

  const totalPercent = Math.round((completedCount / totalCount) * 100);

  // Stats per category
  const categoryStats = useMemo(() => {
    return CRITERIA_CATEGORIES.map((cat) => {
      const items = WEBSITE_CRITERIA_LIST.filter((c) => c.category === cat.id);
      const done = items.filter((c) => checkedMap[c.id]).length;
      const percent = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
      return {
        ...cat,
        total: items.length,
        done,
        percent,
      };
    });
  }, [checkedMap]);

  // Readiness label
  const readinessStatus = useMemo(() => {
    if (totalPercent === 100) {
      return {
        label: 'Standar Penuh (Siap Rilis & Penilaian)',
        badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        barColor: 'bg-emerald-500',
      };
    }
    if (totalPercent >= 75) {
      return {
        label: 'Kesiapan Tinggi (Siap Pra-Sidang / Review)',
        badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
        barColor: 'bg-blue-500',
      };
    }
    if (totalPercent >= 45) {
      return {
        label: 'Tahap Implementasi Inti',
        badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        barColor: 'bg-amber-500',
      };
    }
    return {
      label: 'Tahap Pondasi Awal',
      badgeColor: 'bg-zinc-800 border-zinc-700 text-zinc-400',
      barColor: 'bg-zinc-600',
    };
  }, [totalPercent]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return WEBSITE_CRITERIA_LIST.filter((item) => {
      // Category tab
      if (activeTab !== 'all' && item.category !== activeTab) {
        return false;
      }

      // Status filter
      const isDone = Boolean(checkedMap[item.id]);
      if (statusFilter === 'todo' && isDone) return false;
      if (statusFilter === 'done' && !isDone) return false;

      // Core only filter
      if (coreOnlyFilter && !item.isCore) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.shortDesc.toLowerCase().includes(query);
        const matchesVerify = item.howToVerify.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesVerify && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, statusFilter, coreOnlyFilter, searchQuery, checkedMap]);

  const getCategoryIcon = (catId: CriteriaCategory) => {
    switch (catId) {
      case 'frontend':
        return <Monitor className="w-4 h-4" />;
      case 'backend':
        return <Layers className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'engineering':
        return <GitBranch className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 font-sidebar max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-850">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Rubrik Evaluasi Standar Proyek PBL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cek Kriteria Websitemu
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-content max-w-2xl leading-relaxed">
              Daftar periksa (checklist) kepatuhan arsitektur untuk tim mahasiswa. Centang setiap kriteria saat proyekmu telah mengimplementasikannya, dan gunakan panduan verifikasi untuk persiapan demo di hadapan dosen.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 hover:text-white text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              title="Salin ringkasan ke clipboard untuk laporan"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Salin Laporan</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-800/40 text-zinc-400 hover:text-red-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset semua ceklis"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar & Status Pill */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-white font-mono">
                {totalPercent}%
              </span>
              <div className="text-xs">
                <span className="text-zinc-400 block">Kriteria Terpenuhi:</span>
                <span className="font-mono font-bold text-zinc-200">
                  {completedCount} dari {totalCount} Item
                </span>
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold self-start sm:self-auto ${readinessStatus.badgeColor}`}>
              {readinessStatus.label}
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${readinessStatus.barColor}`}
              style={{ width: `${totalPercent}%` }}
            />
          </div>

          {/* 4 Category Quick Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            {categoryStats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-zinc-900/90 border-blue-500/50 ring-1 ring-blue-500/20'
                    : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900/70 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    {getCategoryIcon(cat.id)}
                    <span className="uppercase tracking-wider font-mono text-[10px]">
                      {cat.shortCode}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-zinc-300">
                    {cat.done}/{cat.total}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-200 truncate">
                  {cat.name.split(' ')[0]}
                </div>
                {/* Mini track */}
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter, Search & Tab Controls Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            Semua ({totalCount})
          </button>

          {CRITERIA_CATEGORIES.map((cat) => {
            const count = WEBSITE_CRITERIA_LIST.filter((c) => c.category === cat.id).length;
            const isTabActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search, Status & View Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kriteria (misal: route group, zod, n+1, req.user)..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-content"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 px-1 py-0.5 rounded"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setStatusFilter('todo')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === 'todo'
                    ? 'bg-zinc-800 text-amber-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Belum
              </button>
              <button
                onClick={() => setStatusFilter('done')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === 'done'
                    ? 'bg-zinc-800 text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Selesai
              </button>
            </div>

            {/* Toggle Core Only */}
            <button
              onClick={() => setCoreOnlyFilter(!coreOnlyFilter)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                coreOnlyFilter
                  ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hanya Wajib (Core)
            </button>

            {/* Expand / Collapse All Code Snippets */}
            <button
              onClick={toggleExpandAll}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Buka/Tutup Contoh
            </button>

            {/* Mark Visible as Done */}
            <button
              onClick={handleMarkAllVisibleDone}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
              title="Tandai semua yang tampil sebagai selesai"
            >
              Ceklis Yang Tampil
            </button>
          </div>
        </div>
      </div>

      {/* Criteria Cards Stream */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-850">
          <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-300">Tidak ada kriteria yang sesuai</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-content">
            Coba sesuaikan kata kunci pencarian atau ubah filter status di bagian atas.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setStatusFilter('all');
              setCoreOnlyFilter(false);
            }}
            className="mt-4 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-blue-400 hover:text-blue-300"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isDone = Boolean(checkedMap[item.id]);
            const isExpanded = Boolean(expandedCards[item.id]);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  isDone
                    ? 'bg-zinc-950/90 border-emerald-800/50 shadow-xs'
                    : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
                  {/* Interactive Big Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600'
                        : 'border-2 border-zinc-700 bg-zinc-900 text-transparent hover:border-zinc-500 hover:bg-zinc-850'
                    }`}
                    title={isDone ? 'Batalkan ceklis' : 'Tandai kriteria ini selesai'}
                  >
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
                  </button>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {item.categoryLabel} #{item.number}
                      </span>

                      {/* Core vs Advanced */}
                      {item.isCore ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/25 font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                          WAJIB (CORE)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/25 font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          LANJUTAN
                        </span>
                      )}

                      {/* Status indicator */}
                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-900/60 font-mono text-[10px] text-emerald-400 font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>TERVERIFIKASI</span>
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => toggleItem(item.id)}
                      className={`text-base sm:text-lg font-bold tracking-tight cursor-pointer select-none transition-colors ${
                        isDone ? 'text-zinc-200' : 'text-white hover:text-blue-300'
                      }`}
                    >
                      {item.title}
                    </h2>

                    <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-content leading-relaxed">
                      {item.shortDesc}
                    </p>

                    {/* How to verify callout box */}
                    <div className="mt-3.5 p-3 sm:p-3.5 rounded-xl bg-[#0c0d12] border border-zinc-850">
                      <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cara Cek Mandiri (Evaluasi Dosen & Mahasiswa):</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-content leading-relaxed">
                        {item.howToVerify}
                      </p>
                    </div>

                    {/* Code Snippet Drawer / Toggle */}
                    {item.codeSnippetExample && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                        >
                          <Code2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>
                            {isExpanded ? 'Sembunyikan Contoh Kode' : 'Lihat Contoh Implementasi'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <CodeBlock
                              filename={item.codeSnippetExample.filename}
                              code={item.codeSnippetExample.code}
                              language="typescript"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Related Guide Module Link */}
                    {item.relatedModuleSlug && (
                      <div className="mt-3 pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-zinc-500 font-content">
                          Belum paham cara buatnya?
                        </span>
                        <Link
                          href={`/docs/${item.relatedModuleSlug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>Pelajari di {item.relatedModuleTitle}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Callout */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
        <h3 className="text-base font-bold text-white">
          Siap Mempertanggungjawabkan Arsitektur di Depan Penguji?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-content leading-relaxed">
          Checklist ini dirancang sebagai standar objektif agar seluruh tim PBL memiliki kualitas kode setara dengan standar industri. Selalu pastikan kriteria wajib (Core) selesai sebelum menambahkan fitur pemanis.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Copy className="w-4 h-4" />
            <span>Salin Format Laporan ke Dosen</span>
          </button>
          <Link
            href="/docs/01-setup-project"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            Buka Modul Dokumentasi &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
