/**
 * app.ts
 * Online Course Management (mini console app)
 *
 * Requirements used:
 * - Maps, Arrays, Tuples
 * - Interfaces
 * - Enums
 * - Iterators
 * - Decorators (method decorator for logging)
 * - Type annotations, any type
 * - Declaration usage (declare ... )
 */

/* ---------- Declarations ----------
   We declare APP_NAME to demonstrate a declaration file concept.
   We then assign it at runtime via globalThis so TypeScript knows the name exists.
*/
declare const APP_NAME: string; // declaration (assume provided)
(globalThis as any).APP_NAME = "OnlineCourseApp"; // runtime assignment to satisfy declare

/* ---------- Enums ---------- */
enum Category {
  DEVELOPMENT = "Development",
  DESIGN = "Design",
  MARKETING = "Marketing",
  DATA = "Data Science",
}

/* ---------- Interfaces ---------- */
interface Course {
  id: number;
  title: string;
  category: Category;
  instructorId?: number;
  // using 'any' for flexible metadata
  metadata?: any;
}

interface Instructor {
  id: number;
  name: string;
  bio?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  // A tuple storing [courseId, enrollmentDate]
  enrollments: [number, string][];
}

/* ---------- Decorator: Method logger ----------
   Logs action name, method name, arguments and result.
   Demonstrates Decorator usage.
*/
function LogAction(actionName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const time = new Date().toISOString();
      console.log(`\n[${APP_NAME}] [${time}] Action: ${actionName} -> ${propertyKey}`);
      console.log(`Arguments:`, args);
      const result = original.apply(this, args);
      console.log(`Result:`, result);
      return result;
    };
    return descriptor;
  };
}

/* ---------- Storage: Maps and Arrays ----------
   - courses: Map<number, Course>
   - instructors: Map<number, Instructor>
   - students: array (we also build an iterable wrapper for students)
*/
const courses = new Map<number, Course>();
const instructors = new Map<number, Instructor>();
const studentsArray: Student[] = [];

/* ---------- ID generators ----------
   Simple counters for IDs (could be improved with UUIDs)
*/
let courseCounter = 0;
let instructorCounter = 0;
let studentCounter = 0;

/* ---------- StudentCollection: implements Iterable ----------
   Demonstrates iterator usage so we can use `for..of` on students
*/
class StudentCollection implements Iterable<Student> {
  constructor(private students: Student[]) {}

  [Symbol.iterator](): Iterator<Student> {
    let idx = 0;
    const arr = this.students;
    return {
      next(): IteratorResult<Student> {
        if (idx < arr.length) {
          return { value: arr[idx++], done: false };
        }
        return { value: undefined as any, done: true };
      },
    };
  }

  // convenience method
  findById(id: number): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

  add(student: Student) {
    this.students.push(student);
  }
}

const studentCollection = new StudentCollection(studentsArray);

/* ---------- App manager class: operations ---------- */
class CourseManager {
  @LogAction("CreateCourse")
  createCourse(title: string, category: Category, metadata?: any): Course {
    const id = ++courseCounter;
    // demonstrate tuple usage: create a short tuple for preview [id, title]
    const previewTuple: [number, string] = [id, title];
    const course: Course = {
      id,
      title,
      category,
      metadata: metadata ?? { createdAt: new Date().toISOString() },
    };
    courses.set(id, course);
    // return a copy to avoid external mutation
    return { ...course, metadata: { ...course.metadata, preview: previewTuple } };
  }

  @LogAction("AddInstructor")
  addInstructor(name: string, bio?: string): Instructor {
    const id = ++instructorCounter;
    const ins: Instructor = { id, name, bio };
    instructors.set(id, ins);
    return ins;
  }

  @LogAction("AssignInstructor")
  assignInstructorToCourse(courseId: number, instructorId: number): Course | null {
    const course = courses.get(courseId);
    const instr = instructors.get(instructorId);
    if (!course) throw new Error(`Course ${courseId} not found`);
    if (!instr) throw new Error(`Instructor ${instructorId} not found`);
    course.instructorId = instructorId;
    courses.set(courseId, course);
    return course;
  }

  @LogAction("RegisterStudent")
  registerStudent(name: string, email: string): Student {
    const id = ++studentCounter;
    const student: Student = { id, name, email, enrollments: [] };
    studentCollection.add(student);
    return student;
  }

  @LogAction("EnrollStudent")
  enrollStudent(studentId: number, courseId: number): [number, string] {
    const student = studentCollection.findById(studentId);
    const course = courses.get(courseId);
    if (!student) throw new Error(`Student ${studentId} not found`);
    if (!course) throw new Error(`Course ${courseId} not found`);
    const enrollDate = new Date().toISOString();
    const enrollmentTuple: [number, string] = [courseId, enrollDate];
    student.enrollments.push(enrollmentTuple);
    return enrollmentTuple;
  }

  @LogAction("ListCourses")
  listCourses(): Course[] {
    return Array.from(courses.values());
  }

  @LogAction("ListInstructors")
  listInstructors(): Instructor[] {
    return Array.from(instructors.values());
  }

  @LogAction("ListStudents")
  listStudents(): Student[] {
    return Array.from(studentCollection);
  }

  // Demo custom iterator capture: list students enrolled in a courseId
  @LogAction("StudentsInCourse")
  studentsInCourse(courseId: number): Student[] {
    const list: Student[] = [];
    for (const student of studentCollection) {
      for (const [cId] of student.enrollments) {
        if (cId === courseId) {
          list.push(student);
          break;
        }
      }
    }
    return list;
  }
}

/* ---------- Demo run ----------
   This simulates usage from a console. All actions will be logged via the decorator.
*/
function demo() {
  const manager = new CourseManager();

  // Create instructors
  const i1 = manager.addInstructor("Dr. Asha", "Data Science expert");
  const i2 = manager.addInstructor("Mr. Rahul", "Front-end developer");

  // Create courses with categories and some 'any' metadata
  const c1 = manager.createCourse("Intro to TypeScript", Category.DEVELOPMENT, { level: "Beginner" });
  const c2 = manager.createCourse("React & Advanced Patterns", Category.DEVELOPMENT, { level: "Intermediate" });
  const c3 = manager.createCourse("UI/UX Basics", Category.DESIGN, { tools: ["Figma", "Sketch"] });

  // Assign instructors
  manager.assignInstructorToCourse(c1.id, i2.id);
  manager.assignInstructorToCourse(c3.id, i1.id);

  // Register students
  const s1 = manager.registerStudent("Shruti", "shruti@example.com");
  const s2 = manager.registerStudent("Aman", "aman@example.com");

  // Enroll students (tuples used: [courseId, date])
  manager.enrollStudent(s1.id, c1.id);
  manager.enrollStudent(s1.id, c2.id);
  manager.enrollStudent(s2.id, c3.id);

  // Show lists
  const allCourses = manager.listCourses();
  const allInstructors = manager.listInstructors();
  const allStudents = manager.listStudents();

  console.log("\n--- Courses (Map -> array) ---");
  console.table(allCourses);

  console.log("\n--- Instructors (Map -> array) ---");
  console.table(allInstructors);

  console.log("\n--- Students (Iterable) ---");
  console.table(allStudents);

  // Show students in a particular course
  const studentsInC1 = manager.studentsInCourse(c1.id);
  console.log(`\nStudents enrolled in course '${c1.title}':`, studentsInC1.map(s => s.name));
}

/* Run demo if this file is executed directly */
demo();
