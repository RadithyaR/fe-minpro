import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EventDetailView = () => {
  return (
    <Layout>
      <div className="flex flex-1 justify-center py-10">
        <div className="layout-content-container w-full max-w-5xl px-4">
          <div className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
              href="/"
            >
              Home
            </Link>
            <span className="text-[var(--text-secondary)]">/</span>
            <span className="text-[var(--text-primary)]">Tech Conference</span>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 overflow-hidden rounded-2xl shadow-lg">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/static/event.jpg"
                    alt="Tech Conference 2024"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-[var(--primary-color)]">
                  Hosted by Innovate Solutions
                </p>
                <h2 className="text-4xl font-bold tracking-tighter text-[var(--text-primary)]">
                  Tech Conference 2024
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)]">
                    About this event
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                    Join us for an exciting Tech Conference, a gathering of
                    industry leaders, innovators, and enthusiasts. Explore the
                    latest trends, technologies, and insights shaping the future
                    of tech. Engage in interactive sessions, workshops, and
                    networking opportunities. This conference is designed to
                    inspire, educate, and connect professionals from diverse
                    backgrounds within the tech industry. Whether you're a
                    seasoned expert or just starting your career, this event
                    offers valuable learning and growth opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)]">
                    What you'll learn
                  </h3>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[var(--primary-color)]">
                        check_circle
                      </span>
                      <span className="text-base text-[var(--text-secondary)]">
                        Latest trends in AI and Machine Learning
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[var(--primary-color)]">
                        check_circle
                      </span>
                      <span className="text-base text-[var(--text-secondary)]">
                        The future of Web3 and blockchain
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[var(--primary-color)]">
                        check_circle
                      </span>
                      <span className="text-base text-[var(--text-secondary)]">
                        Sustainable technology solutions
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[var(--primary-color)]">
                        check_circle
                      </span>
                      <span className="text-base text-[var(--text-secondary)]">
                        Cybersecurity best practices
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
                  Event Details
                </h3>
                <div className="space-y-2">
                  <div className="detail-item border-none pt-0">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">sell</span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Price</p>
                      <p className="detail-value text-lg font-semibold text-[var(--primary-color)]">
                        $199
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Date</p>
                      <p className="detail-value">July 15 - 17, 2024</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Time</p>
                      <p className="detail-value">9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">groups</span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Available Seats</p>
                      <p className="detail-value">500</p>
                    </div>
                  </div>
                </div>
                <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-bold btn-primary cursor-pointer bg-blue-700 hover:bg-blue-500">
                  <Link href="/event-detail/checkout">
                    <span className="truncate text-white">Buy Tickets</span>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailView;
