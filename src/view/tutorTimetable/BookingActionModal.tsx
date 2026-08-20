import { useState, useEffect } from 'react'
import type { BookingResponse } from '@/apis/fe2/booking.types'
import { bookingApi } from '@/apis/fe2/booking.api'

interface Props {
  isOpen: boolean
  booking: BookingResponse | null
  onClose: () => void
  onUpdated: (updated: BookingResponse) => void
}

type ActionMode = 'confirm' | 'reject' | 'complete' | null

const STATUS_COLOR: Record<string, string> = {
  Pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Rejected:  'bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400',
  Cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-800    dark:text-slate-400',
  Completed: 'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400',
}

function fmtUtc(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
}

export function BookingActionModal({ isOpen, booking, onClose, onUpdated }: Props) {
  const [mode, setMode] = useState<ActionMode>(null)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [tutorComment, setTutorComment] = useState('')
  const [goalProgress, setGoalProgress] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset toàn bộ form mỗi khi mở modal với booking mới
  useEffect(() => {
    if (isOpen && booking) {
      setMode(null)
      setMeetingUrl('')
      setRejectReason('')
      setTutorComment('')
      setGoalProgress(100)
      setError(null)
      setLoading(false)
    }
  }, [isOpen, booking?.id])

  // Đóng modal bằng Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !booking) return null

  const canConfirm  = booking.status === 'Pending'
  const canReject   = booking.status === 'Pending'
  const canComplete = booking.status === 'Confirmed'
  const hasActions  = canConfirm || canReject || canComplete

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await bookingApi.confirmBooking(booking!.id, meetingUrl ? { meetingUrl } : undefined)
      const updated = await bookingApi.getBookingById(booking!.id)
      onUpdated(updated)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Confirm failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) { setError('Please enter a reason.'); return }
    setLoading(true)
    setError(null)
    try {
      await bookingApi.rejectBooking(booking!.id, { reason: rejectReason })
      const updated = await bookingApi.getBookingById(booking!.id)
      onUpdated(updated)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reject failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleComplete() {
    if (!tutorComment.trim()) { setError('Please enter your session comment.'); return }
    setLoading(true)
    setError(null)
    try {
      await bookingApi.completeBooking(booking!.id, {
        learningGoalId: 0,
        goalProgressPercent: goalProgress,
        tutorComment,
      })
      const updated = await bookingApi.getBookingById(booking!.id)
      onUpdated(updated)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Complete failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Status bar at top */}
        <div className={`h-1.5 w-full ${
          booking.status === 'Pending'   ? 'bg-amber-400' :
          booking.status === 'Confirmed' ? 'bg-green-400' :
          booking.status === 'Completed' ? 'bg-blue-400'  :
          booking.status === 'Rejected'  ? 'bg-red-400'   : 'bg-slate-300'
        }`} />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Booking #{booking.id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_COLOR[booking.status]}`}>
                  {booking.status === 'Pending'   && '⏳ Pending'}
                  {booking.status === 'Confirmed' && '✅ Confirmed'}
                  {booking.status === 'Completed' && '🏁 Completed'}
                  {booking.status === 'Rejected'  && '❌ Rejected'}
                  {booking.status === 'Cancelled' && '🚫 Cancelled'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {fmtUtc(booking.startTimeUtc)} → {fmtUtc(booking.endTimeUtc)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm">
            <InfoRow label="Credit Cost" value={`${booking.creditCost} credits`} />
            <InfoRow label="Subject ID" value={`#${booking.tutorSubjectId}`} />
            {booking.studentNote && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Student Note</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{booking.studentNote}"</p>
              </div>
            )}
            {booking.meetingUrl && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Meeting Link</p>
                <a
                  href={booking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-500 hover:underline text-sm font-medium break-all"
                >
                  {booking.meetingUrl}
                </a>
              </div>
            )}
            {booking.statusReason && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Status Reason</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{booking.statusReason}</p>
              </div>
            )}
          </div>

          {/* ── Action buttons (default view, mode === null) ── */}
          {mode === null && hasActions && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</p>
              <div className="flex flex-wrap gap-2">
                {canConfirm && (
                  <button
                    onClick={() => setMode('confirm')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold shadow-md shadow-green-500/20 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Booking
                  </button>
                )}
                {canReject && (
                  <button
                    onClick={() => setMode('reject')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md shadow-red-500/20 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Booking
                  </button>
                )}
                {canComplete && (
                  <button
                    onClick={() => setMode('complete')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Confirm form ── */}
          {mode === 'confirm' && (
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Confirm this booking</p>
                <p className="text-xs text-slate-500 mt-0.5">You can optionally add a Google Meet link now — or update it later.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Google Meet Link (optional)
                </label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <div className="flex gap-2">
                <button onClick={() => { setMode(null); setError(null) }} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Back
                </button>
                <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold shadow-md shadow-green-500/20 transition disabled:opacity-60">
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* ── Reject form ── */}
          {mode === 'reject' && (
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Reject this booking</p>
                <p className="text-xs text-slate-500 mt-0.5">The student will see this reason — please be clear and polite.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. I have a prior commitment that day..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-none"
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <div className="flex gap-2">
                <button onClick={() => { setMode(null); setError(null) }} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Back
                </button>
                <button onClick={handleReject} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md shadow-red-500/20 transition disabled:opacity-60">
                  {loading ? 'Rejecting...' : 'Reject Booking'}
                </button>
              </div>
            </div>
          )}

          {/* ── Complete form ── */}
          {mode === 'complete' && (
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Mark session as completed</p>
                <p className="text-xs text-slate-500 mt-0.5">Leave a summary of this session for the student's record.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Goal Progress: <span className="text-brand-500 font-bold">{goalProgress}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={goalProgress}
                  onChange={(e) => setGoalProgress(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Session Comment <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={tutorComment}
                  onChange={(e) => setTutorComment(e.target.value)}
                  rows={4}
                  placeholder="Summarize what was covered, the student's understanding, homework assigned..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <div className="flex gap-2">
                <button onClick={() => { setMode(null); setError(null) }} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Back
                </button>
                <button onClick={handleComplete} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition disabled:opacity-60">
                  {loading ? 'Saving...' : 'Mark Completed'}
                </button>
              </div>
            </div>
          )}

          {/* No actions available */}
          {mode === null && !hasActions && (
            <p className="text-xs text-slate-400 text-center py-2 italic">
              No actions available for this booking status.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{value}</p>
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-100 dark:border-red-800">
      {msg}
    </p>
  )
}
