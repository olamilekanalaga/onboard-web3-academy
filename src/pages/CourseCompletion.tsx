
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseProgression } from '@/hooks/useCourseProgression';
import { courses } from '@/data/courses';
import CourseCompletion from '@/components/CourseCompletion';
import Header from '@/components/Header';

const CourseCompletionPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isCourseCompleted, getCourseProgress } = useCourseProgression();

  useEffect(() => {
    // Redirect if course is not completed or doesn't exist
    if (!courseId || !isCourseCompleted(courseId)) {
      navigate('/courses');
      return;
    }
  }, [courseId, isCourseCompleted, navigate]);

  if (!courseId || !courses[courseId]) {
    return null;
  }

  const course = courses[courseId];
  const progress = getCourseProgress(courseId);

  const handleUnlockNext = () => {
    // The CourseCompletion component will handle the navigation
    console.log('Unlocking next course...');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="py-16 px-4 md:px-6">
        <CourseCompletion
          courseId={courseId}
          courseName={course.title}
          xpEarned={progress?.xpEarned || course.totalXP}
          onUnlockNext={handleUnlockNext}
        />
      </div>
    </div>
  );
};

export default CourseCompletionPage;
