
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen-minus-nav-footer flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="text-center py-16 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Empower Your Future with <span className="text-blue-600">Cutting-Edge</span> Computer Education
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          American Academy Barhi offers comprehensive courses in programming, web development, data science, and more. Join us to unlock your potential.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/courses">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose American Academy Barhi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <i className="fas fa-graduation-cap text-blue-600 text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from industry professionals with years of experience.</p>
          </Card>
          <Card className="text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <i className="fas fa-desktop text-blue-600 text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Hands-on Learning</h3>
            <p className="text-gray-600">Practical, project-based curriculum for real-world skills.</p>
          </Card>
          <Card className="text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <i className="fas fa-certificate text-blue-600 text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Certified Excellence</h3>
            <p className="text-gray-600">Earn industry-recognized certificates upon completion.</p>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">
            Browse our diverse range of computer courses and take the first step towards a brighter career.
          </p>
          <Link to="/courses">
            <Button variant="secondary" size="lg" className="text-blue-600">View All Courses</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
