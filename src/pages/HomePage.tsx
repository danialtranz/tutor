import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

export function HomePage() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="relative flex flex-col gap-20">
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-14 text-white shadow-xl shadow-brand-600/20 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          {/* Animated glow */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-white/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
          />

          {/* Grid pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Hero content */}
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Kết nối học tập thông minh
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Tìm đúng gia sư.
                <br />
                <span className="text-white/75">Học đúng hướng.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                Kết Nối Gia Sư giúp học viên tìm kiếm gia sư phù hợp với nhu
                cầu học tập, đồng thời giúp gia sư tiếp cận những học viên phù
                hợp với chuyên môn của mình.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register/student"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Tìm gia sư
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/register/tutor"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Trở thành gia sư
                </Link>
              </div>
            </div>

            {/* Floating visual */}
            <div className="relative hidden min-h-[330px] lg:block">
              {/* Main card */}
              <div className="absolute right-5 top-10 w-72 rotate-2 rounded-2xl border border-white/20 bg-white/95 p-5 text-gray-900 shadow-2xl shadow-black/20 backdrop-blur-xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl">
                    👨‍🏫
                  </div>

                  <div>
                    <p className="font-semibold">Gia sư phù hợp</p>
                    <p className="text-sm text-gray-500">
                      Toán học · Đại học
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Đánh giá</p>
                    <p className="font-semibold">⭐ 4.9 / 5</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Kinh nghiệm</p>
                    <p className="font-semibold">3+ năm</p>
                  </div>
                </div>
              </div>

              {/* Floating match card */}
              <div className="absolute bottom-8 left-4 w-60 -rotate-3 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-500 hover:rotate-0 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    ✨
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Kết nối thành công
                    </p>
                    <p className="text-xs text-gray-500">
                      Phù hợp với mục tiêu học tập
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative orb */}
              <div className="absolute bottom-16 right-0 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-2xl" />
            </div>
          </div>
        </section>

        {/* =========================================================
            STATS
        ========================================================= */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['100+', 'Gia sư'],
            ['500+', 'Học viên'],
            ['20+', 'Môn học'],
            ['4.8/5', 'Đánh giá'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-2xl font-black text-brand-600 sm:text-3xl">
                {value}
              </p>

              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </section>

        {/* =========================================================
            FEATURES
        ========================================================= */}
        <section>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Tại sao chọn chúng tôi?
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Một nền tảng cho toàn bộ hành trình học tập
            </h2>

            <p className="mt-4 text-gray-500">
              Từ tìm kiếm gia sư đến theo dõi tiến độ, mọi thứ được kết nối
              trong một trải nghiệm đơn giản.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon="🔎"
              title="Tìm gia sư phù hợp"
              description="Khám phá và lựa chọn gia sư dựa trên môn học, chuyên môn và nhu cầu học tập."
            />

            <FeatureCard
              icon="🤝"
              title="Kết nối dễ dàng"
              description="Tạo kết nối giữa học viên và gia sư một cách thuận tiện, rõ ràng và minh bạch."
            />

            <FeatureCard
              icon="📈"
              title="Theo dõi tiến độ"
              description="Theo dõi quá trình học tập và kết quả để liên tục cải thiện hiệu quả."
            />
          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}
        <section>
          <div className="mb-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Cách hoạt động
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Bắt đầu chỉ với vài bước
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Tạo tài khoản',
                description:
                  'Đăng ký với tư cách học viên hoặc gia sư để bắt đầu sử dụng nền tảng.',
              },
              {
                number: '02',
                title: 'Tìm kiếm & kết nối',
                description:
                  'Tìm kiếm đối tượng phù hợp và bắt đầu quá trình kết nối.',
              },
              {
                number: '03',
                title: 'Bắt đầu học tập',
                description:
                  'Thực hiện quá trình học và theo dõi tiến độ trên nền tảng.',
              },
            ].map((step) => (
              <Card
                key={step.number}
                className="group relative overflow-hidden border-gray-100 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 font-bold text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  {step.number}
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>

                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-150" />
              </Card>
            ))}
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-14 text-white sm:px-10 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-300">
                BẮT ĐẦU NGAY HÔM NAY
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Sẵn sàng tìm người đồng hành trong hành trình học tập?
              </h2>

              <p className="mt-4 text-gray-400">
                Tạo tài khoản miễn phí và bắt đầu kết nối với cộng đồng học
                tập.
              </p>
            </div>

            <Link
              to="/register/student"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500 hover:shadow-xl"
            >
              Bắt đầu ngay
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <Card className="group relative overflow-hidden border-gray-100 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-brand-100 hover:shadow-xl">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-brand-100">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-600">
        Tìm hiểu thêm
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>

      <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-brand-50/70 transition-transform duration-500 group-hover:scale-150" />
    </Card>
  )
}