import React, { useState, Suspense } from 'react';
import Loader from './components/Loader.jsx';
import StatsCard from './components/StatsCard.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import BrokenProductCard from './components/BrokenProductCard.jsx';
import ModalPortal from './components/ModalPortal.jsx';

// Lazy loaded components
const CourseDetails = React.lazy(() => import('./pages/CourseDetails'));
const InstructorProfile = React.lazy(() => import('./pages/InstructorProfile'));

function App() {
  const [showCourse, setShowCourse] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [counter, setCounter] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => setCounter(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1 className="mb-3">Day 14: React Advanced Concepts</h1>

      {/* Lazy Loading */}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowCourse(!showCourse)}>
          View Course Details
        </button>
        <button className="btn btn-secondary" onClick={() => setShowInstructor(!showInstructor)}>
          View Instructor Profile
        </button>
      </div>
      <Suspense fallback={<Loader />}>
        {showCourse && <CourseDetails />}
        {showInstructor && <InstructorProfile />}
      </Suspense>

      {/* Pure Component */}
      <h3 className="mt-4">Pure Component Demo</h3>
      <StatsCard title="Counter" value={counter} />

      {/* Error Boundary */}
      <h3 className="mt-4">Error Boundary Demo</h3>
      <ErrorBoundary>
        <BrokenProductCard />
      </ErrorBoundary>

      {/* Portal / Modal */}
      <h3 className="mt-4">Modal Demo</h3>
      <button className="btn btn-success mb-2" onClick={() => setModalOpen(true)}>Open Modal</button>
      <ModalPortal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h5>Hello! I am a modal via Portal.</h5>
      </ModalPortal>
    </div>
  );
}

export default App;
