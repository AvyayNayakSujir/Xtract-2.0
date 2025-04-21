import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mt-11 mx-auto px-6 py-12 max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Project Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Xtract is a comprehensive machine learning platform designed to
              simplify the process of data analysis and model building. Our
              platform enables users to upload datasets, preprocess data, train
              various machine learning models, and visualize results—all through
              an intuitive user interface.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This application was developed as a major project by final year
              students of the Information Science and Engineering department at
              NMAMIT, Nitte, under the guidance of our faculty advisors.
            </p>
          </div>
          <div className="md:w-1/2 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center bg-blue-500/10 rounded-full mb-4">
                <Image
                  src="/nitte.jpeg"
                  alt="NMAMIT Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                NMAMIT, Nitte
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nitte Mahalinga Adyanthaya Memorial Institute of Technology
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 dark:text-purple-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Simplified Data Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easy drag-and-drop interface for uploading CSV and Excel datasets
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600 dark:text-blue-400"
              >
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Interactive Visualizations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Dynamic charts and graphs to understand data patterns and model
              performance
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600 dark:text-green-400"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" x2="2" y1="8" y2="22"></line>
                <line x1="17.5" x2="9" y1="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Guided Model Building
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Step-by-step workflow to select and configure the right ML models
              for your data
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Project Team
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Team Members
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      1
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Avyay Nayak Sujir - NNM22IS029
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      2
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Karthik Mallya N - NNM22IS066
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      3
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    K Anirudh Shetty - NNM22IS064
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      4
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    A Dhame Amuthan - NNM22IS001
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Project Guides
              </h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Dr. Deepa Shetty
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Associate Professor
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Department of ISE, NMAMIT
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-8 text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
          About NMAMIT
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          Nitte Mahalinga Adyanthaya Memorial Institute of Technology (NMAMIT),
          established in 1986, is a leading engineering college in Nitte,
          Karnataka, India. The institute is affiliated with Visvesvaraya
          Technological University and is recognized for excellence in technical
          education, research, and innovation.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 Xtract ML Platform | Major Project - Information Science and
          Engineering
        </p>
      </div>
    </div>
  );
}
