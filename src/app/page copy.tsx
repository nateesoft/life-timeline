export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Life Timeline
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your personal journey visualization tool
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Track Milestones
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Record important life events and achievements
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Visualize Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                See your journey unfold through interactive timelines
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Plan Ahead
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Set goals and plan for future milestones
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Get Started
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
