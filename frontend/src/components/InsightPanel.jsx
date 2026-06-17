import {
  Brain,
  TrendingUp,
  Heart,
  Activity,
  FileText,
  MessageSquare,
  VolumeX,
  EyeOff,
  Handshake,
  Zap,
  BookOpen,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Star,
  CloudLightning,
  Wind,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';

/* ── Mood config ────────────────────────────────────────────── */
const MOOD_CONFIG = {
  happy:      { Icon: Smile,         text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   from: '#f59e0b', to: '#f97316' },
  sad:        { Icon: Frown,         text: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    from: '#3b82f6', to: '#06b6d4' },
  anxious:    { Icon: AlertCircle,   text: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  from: '#f97316', to: '#ef4444' },
  neutral:    { Icon: Meh,           text: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200',    from: '#6b7280', to: '#9ca3af' },
  frustrated: { Icon: CloudLightning,text: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     from: '#ef4444', to: '#f43f5e' },
  hopeful:    { Icon: Star,          text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', from: '#10b981', to: '#14b8a6' },
  overwhelmed:{ Icon: Wind,          text: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200',  from: '#8b5cf6', to: '#ec4899' },
  calm:       { Icon: Heart,         text: 'text-sky-600',     bg: 'bg-sky-50',     border: 'border-sky-200',     from: '#38bdf8', to: '#6366f1' },
};

/* ── Behavior config ────────────────────────────────────────── */
const BEHAVIOR_CONFIG = {
  expressive: { Icon: MessageSquare, text: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-200'  },
  withdrawn:  { Icon: VolumeX,       text: 'text-gray-500',   bg: 'bg-gray-50',    border: 'border-gray-200'    },
  avoidant:   { Icon: EyeOff,        text: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200'   },
  engaged:    { Icon: Handshake,     text: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200' },
  agitated:   { Icon: Zap,           text: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200'     },
  reflective: { Icon: BookOpen,      text: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-200'  },
};

/* ── Anxiety config ─────────────────────────────────────────── */
const ANXIETY_CONFIG = {
  low:      { label: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: { from: '#34d399', to: '#2dd4bf' } },
  moderate: { label: 'bg-amber-100   text-amber-700   border-amber-200',   bar: { from: '#fbbf24', to: '#fb923c' } },
  high:     { label: 'bg-red-100     text-red-700     border-red-200',      bar: { from: '#f87171', to: '#fb7185' } },
};

/* ── Sub-components ─────────────────────────────────────────── */

function Label({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
      {children}
    </p>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {children}
    </div>
  );
}

function GradientBar({ value, from, to }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${v}%`, background: `linear-gradient(to right, ${from}, ${to})` }}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
      <div className="skeleton h-2.5 w-20 rounded" />
      <div className="skeleton h-5 w-28 rounded" />
      <div className="skeleton h-1.5 w-full rounded-full" />
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */

export default function InsightPanel({ insights, isAnalyzing }) {
  const mood     = insights ? (MOOD_CONFIG[insights.mood]               || MOOD_CONFIG.neutral)       : null;
  const behavior = insights ? (BEHAVIOR_CONFIG[insights.behaviorPattern]|| BEHAVIOR_CONFIG.expressive): null;
  const anxiety  = insights ? (ANXIETY_CONFIG[insights.anxietyLevel]    || ANXIETY_CONFIG.moderate)   : null;

  const MoodIcon     = mood?.Icon;
  const BehaviorIcon = behavior?.Icon;

  return (
    <div className="h-full flex flex-col min-h-0">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
              <Brain className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-gray-800 font-bold text-sm">Mental Analysis</h2>
              <p className="text-gray-400 text-[10px]">AI-powered insights</p>
            </div>
          </div>

          {insights && (
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1">
              {insights.confidence}% sure
            </span>
          )}
        </div>

        {isAnalyzing && (
          <div className="flex items-center gap-2 mt-2">
            <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
            <p className="text-indigo-500 text-xs font-medium">Analyzing conversation…</p>
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto insight-scroll px-4 py-4 space-y-3 min-h-0">

        {/* Empty state */}
        {!insights && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 select-none">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 shadow-sm">
              <MessageCircle className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">No insights yet</p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[180px]">
              Keep chatting — insights unlock after a few messages.
            </p>
          </div>
        )}

        {/* Skeleton */}
        {isAnalyzing && !insights && (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        )}

        {/* Cards */}
        {insights && (
          <div className="space-y-3 insight-fade">

            {/* Anxiety */}
            <Card>
              <Label>Anxiety Level</Label>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border capitalize ${anxiety.label}`}>
                    {insights.anxietyLevel}
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-mono">{insights.anxietyScore} / 100</span>
              </div>
              <GradientBar value={insights.anxietyScore} from={anxiety.bar.from} to={anxiety.bar.to} />
            </Card>

            {/* Mood */}
            <Card>
              <Label>Current Mood</Label>
              <div className="flex items-center gap-3 mb-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${mood.bg} ${mood.border}`}
                >
                  {MoodIcon && <MoodIcon className={`w-5 h-5 ${mood.text}`} strokeWidth={2} />}
                </div>
                <div>
                  <p className={`font-bold capitalize text-sm ${mood.text}`}>{insights.mood}</p>
                  <p className="text-gray-400 text-[11px]">Intensity {insights.moodIntensity}%</p>
                </div>
              </div>
              <GradientBar value={insights.moodIntensity} from={mood.from} to={mood.to} />
            </Card>

            {/* Behavior */}
            <Card>
              <Label>Behavior Pattern</Label>
              <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${behavior.bg} ${behavior.border}`}>
                {BehaviorIcon && <BehaviorIcon className={`w-5 h-5 ${behavior.text} flex-shrink-0`} strokeWidth={2} />}
                <span className={`font-bold capitalize text-sm ${behavior.text}`}>
                  {insights.behaviorPattern}
                </span>
              </div>
            </Card>

            {/* Doctor recommendation — shown when anxiety is moderate or high */}
            {(insights.anxietyLevel === 'moderate' || insights.anxietyLevel === 'high') && (
              <div className={`rounded-2xl border p-4 ${
                insights.anxietyLevel === 'high'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    insights.anxietyLevel === 'high'
                      ? 'bg-red-100 border border-red-200'
                      : 'bg-amber-100 border border-amber-200'
                  }`}>
                    <Stethoscope className={`w-5 h-5 ${
                      insights.anxietyLevel === 'high' ? 'text-red-500' : 'text-amber-500'
                    }`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm mb-1 ${
                      insights.anxietyLevel === 'high' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {insights.anxietyLevel === 'high'
                        ? 'We recommend seeing a doctor'
                        : 'Consider speaking to a professional'}
                    </p>
                    <p className={`text-xs leading-relaxed ${
                      insights.anxietyLevel === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {insights.anxietyLevel === 'high'
                        ? 'Your responses suggest elevated anxiety. Please consider reaching out to a mental health professional or doctor — you deserve proper support.'
                        : 'Some signs of anxiety have been noticed. Talking to a counselor or doctor can be a great step toward feeling better.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                <Label>Summary</Label>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {insights.summary}
              </p>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}
