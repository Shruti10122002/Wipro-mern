// main.ts - for creating objects of Person and Student class and calling their methods
// main.ts
// Import Person and Student class from person.ts file
import { Person, Student } from "./person";

// Creating an object of Person class
const person1 = new Person("Alice", 30, "Wonderland University");
console.log(person1.greet());
console.log(`Person ID: ${person1.showId()}`);
console.log("---------------------------");
console.log("Person Counter:", Person.counter);

// Creating an object of Student class
const student1 = new Student("Bob", 20, "Builder Institute", ["JavaScript", "TypeScript"]);
console.log(student1.getStudentDetails());
student1.addSkill("React");
student1.display();
console.log(`Student ID: ${student1.showId()}`);
console.log("---------------------------");
console.log("Person Counter after creating Student:", Person.counter);

