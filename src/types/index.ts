
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  price: string;
  image: string;
  tags: string[];
  chapters: Chapter[];
  progress: number;
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  duration: string;
}
