
import React from 'react';
import Card from '../../components/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About American Academy Barhi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col justify-center">
          <p className="text-lg text-gray-700 mb-4">
            American Academy Barhi is a leading computer institute dedicated to providing high-quality,
            practical computer education to empower individuals for the digital age. Established in [Year],
            we have been at the forefront of technological training, helping thousands of students achieve their career goals.
          </p>
          <p className="text-lg text-gray-700">
            Our commitment is to foster a learning environment that encourages innovation, critical thinking,
            and hands-on experience, preparing our students for real-world challenges in the fast-evolving tech industry.
          </p>
        </div>
        <div>
          <img
            src="https://picsum.photos/600/400?random=1"
            alt="About Us"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission & Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To deliver accessible and cutting-edge computer education that equips students with essential
              technical skills, fosters problem-solving abilities, and promotes lifelong learning,
              enabling them to excel in their chosen careers.
            </p>
          </Card>
          <Card>
            <h3 className="text-2xl font-semibold text-blue-600 mb-3">Our Vision</h3>
            <p className="text-gray-700">
              To be the premier computer training institute, recognized for our innovative curriculum,
              exceptional faculty, and the success of our graduates in shaping the technological landscape.
            </p>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <i className="fas fa-lightbulb text-blue-600 text-4xl mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">Constantly updating our curriculum to reflect the latest industry trends.</p>
          </Card>
          <Card className="text-center">
            <i className="fas fa-user-tie text-blue-600 text-4xl mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">Striving for the highest standards in teaching and student achievement.</p>
          </Card>
          <Card className="text-center">
            <i className="fas fa-users text-blue-600 text-4xl mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">Building a supportive and collaborative learning environment.</p>
          </Card>
          <Card className="text-center">
            <i className="fas fa-hands-helping text-blue-600 text-4xl mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Integrity</h3>
            <p className="text-gray-600">Operating with honesty and transparency in all our endeavors.</p>
          </Card>
          <Card className="text-center">
            <i className="fas fa-chart-line text-blue-600 text-4xl mb-3"></i>
            <h3 className="text-xl font-semibold mb-2">Growth</h3>
            <p className="text-gray-600">Encouraging continuous personal and professional development.</p>
          </Card>
        </div>
      </section>

      <section className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Our dedicated team of educators, administrators, and support staff are committed
          to providing an exceptional learning experience for every student.
        </p>
        {/* Placeholder for team members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="text-center">
                <img src="https://picsum.photos/150/150?person=1" alt="Team Member 1" className="rounded-full w-24 h-24 mx-auto mb-4 object-cover" />
                <h4 className="font-semibold text-lg">Jane Doe</h4>
                <p className="text-blue-600">Director</p>
            </Card>
            <Card className="text-center">
                <img src="https://picsum.photos/150/150?person=2" alt="Team Member 2" className="rounded-full w-24 h-24 mx-auto mb-4 object-cover" />
                <h4 className="font-semibold text-lg">John Smith</h4>
                <p className="text-blue-600">Lead Instructor</p>
            </Card>
            <Card className="text-center">
                <img src="https://picsum.photos/150/150?person=3" alt="Team Member 3" className="rounded-full w-24 h-24 mx-auto mb-4 object-cover" />
                <h4 className="font-semibold text-lg">Emily White</h4>
                <p className="text-blue-600">Admissions Officer</p>
            </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
