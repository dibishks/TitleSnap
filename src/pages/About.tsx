import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto container-padding py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          About Us
        </h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            We are passionate about creating innovative web applications that solve real-world
            problems. Our team combines cutting-edge technology with thoughtful design to deliver
            exceptional user experiences.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Founded in 2024, we specialize in modern web development using React, TypeScript, and
            other industry-leading technologies. Our mission is to build tools that empower
            businesses and individuals to achieve their goals.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Our Values
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>Innovation through technology</li>
            <li>User-centered design</li>
            <li>Quality and reliability</li>
            <li>Continuous learning and improvement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
