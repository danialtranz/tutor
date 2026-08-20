import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  PauseCircle,
  Play,
  X,
  Check,
  AlertCircle,
  Hourglass,
  XCircle,
  Flag,
  Calendar,
  ClipboardList,
} from 'lucide-react'

import { tutorAvailabilityApi } from '@/apis/fe2/tutorAvailability.api'
import { bookingApi } from '@/apis/fe2/booking.api'
import type { TutorAvailabilityResponse, DayOfWeek } from '@/apis/fe2/tutorAvailability.types'
import type { BookingResponse, BookingStatus } from '@/apis/fe2/booking.types'
import { SlotFormModal } from './SlotFormModal'
import { BookingActionModal } from './BookingActionModal'
import { tutorCard } from '../tutorProfile/profileTheme'

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS: { value: DayOfWeek; short: string }[] = [
  { value: 1, short: 'MON' },
  { value: 2, short: 'TUE' },
  { value: 3, short: 'WED' },
  { value: 4, short: 'THU' },
  { value: 5, short: 'FRI' },
  { value: 6, short: 'SAT' },
  { value: 0, short: 'SUN' },
]

// Mock giống ảnh: 18 - 24 Aug 2025
const WEEK_DATE_LABELS: Record<DayOfWeek, string> = {
  1: '18 Aug',
  2: '19 Aug',
  3: '20 Aug',
  4: '21 Aug',
  5: '22 Aug',
  6: '23 Aug',
  0: '24 Aug',
}

const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  Pending: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
  Confirmed: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-200 border-red-500/20',
  Cancelled: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  Completed: 'bg-sky-500/10 text-sky-200 border-sky-500/20',
}

const BOOKING_CARD_THEME: Record<
  BookingStatus,
  {
    strip: string
    iconBg: string
    icon: ReactNode
    tagBg: string
    tagText: string
    priceColor: string
    cardBorder: string
  }
> = {
  Pending: {
    strip: 'bg-amber-500',
    iconBg: 'bg-amber-500/15 border-amber-500/25',
    icon: <Hourglass className="h-6 w-6 text-amber-400" strokeWidth={1.75} />,
    tagBg: 'bg-amber-500/20 border-amber-500/30',
    tagText: 'text-amber-300',
    priceColor: 'text-amber-400',
    cardBorder: 'border-amber-500/15',
  },
  Confirmed: {
    strip: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/15 border-emerald-500/25',
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-400" strokeWidth={1.75} />,
    tagBg: 'bg-emerald-500/20 border-emerald-500/30',
    tagText: 'text-emerald-300',
    priceColor: 'text-emerald-400',
    cardBorder: 'border-emerald-500/15',
  },
  Rejected: {
    strip: 'bg-red-500',
    iconBg: 'bg-red-500/15 border-red-500/25',
    icon: <XCircle className="h-6 w-6 text-red-400" strokeWidth={1.75} />,
    tagBg: 'bg-red-500/20 border-red-500/30',
    tagText: 'text-red-300',
    priceColor: 'text-red-400',
    cardBorder: 'border-red-500/15',
  },
  Cancelled: {
    strip: 'bg-slate-500',
    iconBg: 'bg-slate-500/15 border-slate-500/25',
    icon: <XCircle className="h-6 w-6 text-slate-400" strokeWidth={1.75} />,
    tagBg: 'bg-slate-500/20 border-slate-500/30',
    tagText: 'text-slate-300',
    priceColor: 'text-slate-400',
    cardBorder: 'border-slate-500/15',
  },
  Completed: {
    strip: 'bg-sky-500',
    iconBg: 'bg-sky-500/15 border-sky-500/25',
    icon: <Flag className="h-6 w-6 text-sky-400" strokeWidth={1.75} />,
    tagBg: 'bg-sky-500/20 border-sky-500/30',
    tagText: 'text-sky-300',
    priceColor: 'text-sky-400',
    cardBorder: 'border-sky-500/15',
  },
}

const BOOKING_STATUS_ICON: Record<BookingStatus, ReactNode> = {
  Pending: <Clock className="h-3.5 w-3.5" />,
  Confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <X className="h-3.5 w-3.5" />,
  Cancelled: <X className="h-3.5 w-3.5" />,
  Completed: <FileText className="h-3.5 w-3.5" />,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(t: string) {
  // Input: "HH:mm:ss"
  return t.slice(0, 5)
}

function getDuration(start: string, end: string): string {
  // start/end: "HH:mm:ss"
  const [shStr, smStr] = start.slice(0, 5).split(':')
  const [ehStr, emStr] = end.slice(0, 5).split(':')
  const sh = Number(shStr)
  const sm = Number(smStr)
  const eh = Number(ehStr)
  const em = Number(emStr)
  if (![sh, sm, eh, em].every(Number.isFinite)) return ''
  const totalMin = eh * 60 + em - (sh * 60 + sm)
  if (totalMin <= 0) return ''
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function getDayOfWeekVN(iso: string): number {
  const d = new Date(iso)
  const vnStr = d.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  const map: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }
  return map[vnStr] ?? -1
}

function formatBookingDateTime(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  const date = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  return `${time} • ${date}`
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string
  value: string
  icon: ReactNode
  iconBg: string
}) {
  return (
    <div className={`${tutorCard} flex items-center gap-3.5 px-5 py-4`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold leading-tight text-white">{value}</p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function TimetableView() {
  const [slots, setSlots] = useState<TutorAvailabilityResponse[]>([])
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Slot modal
  const [slotModalOpen, setSlotModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TutorAvailabilityResponse | null>(null)
  const [modalInitialDay, setModalInitialDay] = useState<DayOfWeek>(1)

  // Slot delete
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  // Booking modal
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null)

  // Tab + filter
  const [activeTab, setActiveTab] = useState<'timetable' | 'bookings'>('timetable')
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'All'>('All')

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [slotData, bookingData] = await Promise.all([
        tutorAvailabilityApi.getMyAvailabilities(),
        bookingApi.getMyBookings(),
      ])
      setSlots(slotData)
      setBookings(bookingData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  // ── Slot CRUD ────────────────────────────────────────────────────────────────

  function openAddSlotModal(day: DayOfWeek) {
    setEditingSlot(null)
    setModalInitialDay(day)
    setSlotModalOpen(true)
  }

  function openEditSlotModal(slot: TutorAvailabilityResponse) {
    setEditingSlot(slot)
    setModalInitialDay(slot.dayOfWeek)
    setSlotModalOpen(true)
  }

  async function handleSaveSlot(day: DayOfWeek, startTime: string, endTime: string) {
    if (editingSlot) {
      const updated = await tutorAvailabilityApi.updateAvailability(editingSlot.id, {
        dayOfWeek: day,
        startTime,
        endTime,
      })
      setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } else {
      const created = await tutorAvailabilityApi.createAvailability({ dayOfWeek: day, startTime, endTime })
      setSlots((prev) => [...prev, created])
    }
  }

  async function handleToggleSlot(slot: TutorAvailabilityResponse) {
    setTogglingId(slot.id)
    try {
      const updated = await tutorAvailabilityApi.setAvailabilityStatus(slot.id, { isActive: !slot.isActive })
      setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteSlot(id: number) {
    setDeletingId(id)
    try {
      await tutorAvailabilityApi.setAvailabilityStatus(id, { isActive: false })
      setSlots((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  function handleBookingUpdated(updated: BookingResponse) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
    setSelectedBooking(null)
  }

  const pendingCount = useMemo(() => bookings.filter((b) => b.status === 'Pending').length, [bookings])
  const confirmedCount = useMemo(() => bookings.filter((b) => b.status === 'Confirmed').length, [bookings])
  const activeSlotCount = useMemo(() => slots.filter((s) => s.isActive).length, [slots])

  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'All') return bookings
    return bookings.filter((b) => b.status === bookingFilter)
  }, [bookingFilter, bookings])

  // ── Render guards ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Đang tải lịch giảng dạy...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[420px] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-300" />
          </div>
          <p className="mt-3 text-sm font-semibold text-white">{error}</p>
          <button type="button" onClick={loadAll} className="mt-2 text-xs font-semibold text-brand-300 hover:underline">
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-[#0b0e14] px-2 sm:px-4 lg:px-6 py-6">
      <div className="mx-auto max-w-[1220px] space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-white sm:text-[1.65rem]">Teaching Timetable</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">Manage your weekly availability and respond to student bookings.</p>
          </div>

          {activeTab === 'timetable' && (
            <button
              type="button"
              onClick={() => openAddSlotModal(1)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-brand-600/30 transition hover:bg-brand-500"
            >
              <Plus className="h-4 w-4" />
              Add New Slot
            </button>
          )}
        </div>

        {/* Summary cards — hiển thị cả 2 tab như mockup */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="ACTIVE SLOTS"
            value={String(activeSlotCount)}
            icon={<CalendarDays className="h-5 w-5 text-brand-300" />}
            iconBg="bg-brand-500/10 border-brand-500/20"
          />
          <StatCard
            label="PENDING BOOKINGS"
            value={String(pendingCount)}
            icon={<Hourglass className="h-5 w-5 text-amber-300" />}
            iconBg="bg-amber-500/10 border-amber-500/20"
          />
          <StatCard
            label="CONFIRMED"
            value={String(confirmedCount)}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
            iconBg="bg-emerald-500/10 border-emerald-500/20"
          />
          <StatCard
            label="TOTAL BOOKINGS"
            value={String(bookings.length)}
            icon={<ClipboardList className="h-5 w-5 text-sky-300" />}
            iconBg="bg-sky-500/10 border-sky-500/20"
          />
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-white/[0.06]">
          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className={`relative flex items-center gap-2 px-4 py-3 text-xs font-extrabold transition ${
              activeTab === 'timetable'
                ? 'text-brand-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Weekly Schedule
            {activeTab === 'timetable' && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`relative flex items-center gap-2 px-4 py-3 text-xs font-extrabold transition ${
              activeTab === 'bookings'
                ? 'text-brand-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            Bookings
            {pendingCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-extrabold text-white">
                {pendingCount}
              </span>
            )}
            {activeTab === 'bookings' && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        </div>

        {activeTab === 'timetable' ? (
          // ── Weekly availability panel ──
          <div className={`${tutorCard} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-brand-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">WEEKLY AVAILABILITY</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition px-2 py-1 rounded-lg">
                  Today
                </button>
                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]">
                  <ChevronLeft className="h-4 w-4 text-slate-300" />
                </button>
                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]">
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>

                <select
                  value="18-24Aug2025"
                  onChange={() => undefined}
                  className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-semibold text-slate-300 outline-none"
                >
                  <option value="18-24Aug2025">18 - 24 Aug 2025</option>
                </select>
              </div>
            </div>

            <div className="px-3 py-4">
              <div className="space-y-1">
                {DAYS.map(({ value: dayValue, short }) => {
                  const daySlots = slots.filter((s) => s.dayOfWeek === dayValue)
                  const dayBookings = bookings.filter((b) => getDayOfWeekVN(b.startTimeUtc) === dayValue)

                  return (
                    <div key={dayValue} className="grid grid-cols-[98px_1fr_44px] items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/[0.02]">
                      <div>
                        <div className="text-xs font-extrabold tracking-wider text-slate-500">{short}</div>
                        <div className="mt-1 text-xs font-semibold text-slate-400">{WEEK_DATE_LABELS[dayValue]}</div>
                        {dayBookings.length > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">
                            <Clock className="h-3 w-3 text-amber-300" />
                            <span className="text-[11px] font-extrabold text-amber-200">{dayBookings.length}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {daySlots.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => openAddSlotModal(dayValue)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add slot
                          </button>
                        ) : (
                          daySlots.map((slot) => (
                            <SlotChip
                              key={slot.id}
                              slot={slot}
                              isDeleting={deletingId === slot.id}
                              isToggling={togglingId === slot.id}
                              onEdit={() => openEditSlotModal(slot)}
                              onToggle={() => handleToggleSlot(slot)}
                              onDelete={() => handleDeleteSlot(slot.id)}
                            />
                          ))
                        )}

                        {dayBookings.length > 0 &&
                          dayBookings.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-extrabold transition hover:bg-white/[0.03] ${BOOKING_STATUS_STYLE[b.status]}`}
                              title={`Booking #${b.id}`}
                            >
                              {BOOKING_STATUS_ICON[b.status]}
                              <span className="whitespace-nowrap">{formatTime(b.startTimeUtc)}</span>
                            </button>
                          ))}

                        {daySlots.length > 0 && (
                          <button
                            type="button"
                            onClick={() => openAddSlotModal(dayValue)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add slot
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] transition"
                          aria-label="More"
                          onClick={() => undefined}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.06] px-6 py-4">
              <LegendItem tone="bg-emerald-500/20 border border-emerald-500/30" dot="bg-emerald-400" text="Active slot" />
              <LegendItem tone="bg-red-500/20 border border-red-500/30" dot="bg-red-400" text="Inactive slot" />
              <LegendItem tone="bg-amber-500/20 border border-amber-500/30" dot="bg-amber-400" text="Pending booking" />
              <LegendItem tone="bg-emerald-500/20 border border-emerald-500/30" dot="bg-emerald-400" text="Confirmed" />
            </div>
          </div>
        ) : (
          // ── Bookings tab ──
          <div className="space-y-4">
            {/* Status filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'Pending', 'Confirmed', 'Completed', 'Rejected', 'Cancelled'] as const).map((f) => {
                const count = f === 'All' ? bookings.length : bookings.filter((b) => b.status === f).length
                const isActive = bookingFilter === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setBookingFilter(f)}
                    className={`rounded-full border px-4 py-2 text-xs font-extrabold transition ${
                      isActive
                        ? 'border-brand-500/40 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                        : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:text-slate-200'
                    }`}
                  >
                    {f === 'All' ? 'All' : `${f} (${count})`}
                  </button>
                )
              })}
            </div>

            {filteredBookings.length === 0 ? (
              <div className={`${tutorCard} py-14 text-center`}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                  <ClipboardList className="h-6 w-6 text-slate-500" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-300">No bookings found for this filter.</p>
                <p className="mt-1 text-xs text-slate-500">Bookings from students will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings
                  .slice()
                  .sort((a, b) => new Date(b.startTimeUtc).getTime() - new Date(a.startTimeUtc).getTime())
                  .map((b) => (
                    <BookingCard key={b.id} booking={b} onClick={() => setSelectedBooking(b)} />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <SlotFormModal
          isOpen={slotModalOpen}
          initialDay={modalInitialDay}
          editing={editingSlot}
          onClose={() => setSlotModalOpen(false)}
          onSave={handleSaveSlot}
        />
        <BookingActionModal
          isOpen={selectedBooking !== null}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={handleBookingUpdated}
        />
      </div>
    </div>
  )
}

function LegendItem({ tone, dot, text }: { tone: string; dot: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-6 w-6 items-center justify-center rounded-xl ${tone}`}>
        <div className={`h-2 w-2 rounded-full ${dot}`} />
      </div>
      <span className="text-xs font-semibold text-slate-400">{text}</span>
    </div>
  )
}

function SlotChip({
  slot,
  isDeleting,
  isToggling,
  onEdit,
  onToggle,
  onDelete,
}: {
  slot: TutorAvailabilityResponse
  isDeleting: boolean
  isToggling: boolean
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const active = slot.isActive
  const base =
    'group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-extrabold transition'

  return (
    <div className={`${base} ${active ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-red-500/20 bg-red-500/10 text-red-200'}`}>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-red-400'}`} />
      <span className="whitespace-nowrap">
        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
      </span>
      <span className="opacity-70 whitespace-nowrap">({getDuration(slot.startTime, slot.endTime)})</span>

      {/* actions - chỉ hiện khi hover */}
      <div className="ml-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${active ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100' : 'border-red-500/20 bg-red-500/5 text-red-100'} hover:bg-white/[0.03]`}
          title="Edit"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          disabled={isToggling}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${
            active ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100' : 'border-red-500/20 bg-red-500/5 text-red-100'
          } hover:bg-white/[0.03] disabled:opacity-60 disabled:cursor-not-allowed`}
          title={active ? 'Deactivate' : 'Activate'}
          aria-label="Toggle"
        >
          {isToggling ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : active ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        {confirmDelete ? (
          <>
            <button
              type="button"
              onClick={() => {
                onDelete()
                setConfirmDelete(false)
              }}
              disabled={isDeleting}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 text-red-100 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Confirm delete"
              aria-label="Confirm delete"
            >
              {isDeleting ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-100 border-t-transparent" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.05]"
              title="Cancel"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:text-red-200 hover:bg-red-500/10 hover:border-red-500/20"
            title="Delete"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, onClick }: { booking: BookingResponse; onClick: () => void }) {
  const theme = BOOKING_CARD_THEME[booking.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full overflow-hidden rounded-2xl border bg-[#151921]/90 text-left transition hover:bg-[#151921] ${theme.cardBorder}`}
    >
      {/* Left status strip */}
      <div className={`w-1 shrink-0 ${theme.strip}`} />

      <div className="flex flex-1 items-start gap-4 p-4 sm:p-5">
        {/* Status icon */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${theme.iconBg}`}>
          {theme.icon}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-white">Booking #{booking.id}</span>
            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-extrabold ${theme.tagBg} ${theme.tagText}`}>
              {booking.status}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>{formatBookingDateTime(booking.startTimeUtc)}</span>
          </div>

          {booking.studentNote && (
            <p className="mt-1.5 text-xs italic text-slate-500">&ldquo;{booking.studentNote}&rdquo;</p>
          )}

          {booking.status === 'Pending' && (
            <p className="mt-3 text-[11px] font-semibold text-amber-400/90">
              Action required — tap to confirm or reject
            </p>
          )}
        </div>

        {/* Right: price + chevron */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className={`text-sm font-extrabold ${theme.priceColor}`}>{booking.creditCost} cr</p>
            {booking.meetingUrl && (
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">Has meeting link</p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-slate-600 transition group-hover:text-slate-400" />
        </div>
      </div>
    </button>
  )
}

