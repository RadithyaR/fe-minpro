import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";

const HomeView = () => {
  return (
    <Layout>
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              Upcoming Events
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover exciting events tailored to your interests.
            </p>
          </div>
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <input
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
                  placeholder="Search events by name..."
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  alt="Tech Conference"
                  src="/static/event.jpg"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tech Conference 2024
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  San Francisco, CA | Oct 15-17
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button className="text-[var(--primary-500)] transition-colors hover:text-[var(--primary-600)] cursor-pointer">
                    <Link href="/event-detail">
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeView;
