// Mock subject data for three university courses
import {Subject} from '../types';
export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "An introductory course covering fundamental concepts of computer science including algorithms, data structures, and programming basics.",
    department: "Computer Science",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Advanced Mathematics",
    code: "MATH301",
    description: "A comprehensive study of advanced mathematical concepts including calculus, linear algebra, and differential equations for engineering students.",
    department: "Mathematics",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Principles of Economics",
    code: "ECON201",
    description: "Introduction to economic theory covering microeconomics and macroeconomics, including supply and demand, market structures, and monetary policy.",
    department: "Economics",
    createdAt: "2024-03-10T09:00:00Z",
  },
];