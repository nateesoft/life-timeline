import Header from '@/components/Header';
import Button from '@/components/Button';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="About Life Timeline" 
        subtitle="Learn more about our mission and features"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Life Timeline helps you visualize and track your personal journey through life. 
              Whether you're looking back at past achievements or planning for the future, 
              our platform provides an intuitive way to organize and understand your life's story.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Key Features
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>Interactive timeline visualization</li>
              <li>Milestone tracking and categorization</li>
              <li>Goal setting and progress monitoring</li>
              <li>Photo and memory attachments</li>
              <li>Data export and sharing capabilities</li>
            </ul>
            
            <Button variant="primary">
              Start Your Timeline
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}