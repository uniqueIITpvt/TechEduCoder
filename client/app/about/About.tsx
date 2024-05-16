import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">TechEduCoder?</span>
      </h1>
     

      <div className="w-[95%] 800px:w-[85%] m-auto">

      <p>
        Welcome to TechEduCoder, your premier destination for high-quality technical education. Our mission is to empower individuals with the skills and knowledge they need to succeed in today’s fast-paced, technology-driven world. At TechEduCoder, we believe that learning should be accessible, engaging, and tailored to meet the needs of modern learners.
      </p>
   
      <p>
        TechEduCoder is a dedicated Learning Management System (LMS) designed to offer a wide range of technical courses, eBooks, and insightful blogs. Founded by passionate educators and industry experts, we are committed to providing top-tier educational resources that cater to learners of all levels, from beginners to professionals.
      </p>
      <br />
      <h2 className="text-[18px] text-black opacity-90  font-poppins font-[600]">Our Offerings</h2>
      <br />
      <h3>Courses:</h3>
      <p>
        Our expertly crafted courses cover a diverse array of technical topics, including programming, web development, data science, app development, and many more. Each course is designed to provide practical, hands-on learning experiences that prepare you for real-world challenges.
      </p>
      <br />
      <h3>eBooks:</h3>
      <p>
        Dive into our extensive collection of eBooks, which provide in-depth knowledge on various technical subjects. Whether you’re looking to deepen your understanding of a specific topic or explore new areas, our eBooks are a valuable resource for continuous learning.
      </p>
      <br />
      <h3>Blogs:</h3>
      <p>
        Stay up-to-date with the latest trends, tips, and insights in the tech world through our engaging blogs. Written by industry professionals, our blogs offer valuable perspectives and advice to help you stay ahead in your career.
      </p>
      <br />
      <h2>Our Vision</h2>
      <p>
        At TechEduCoder, we envision a world where education is not confined to traditional classrooms. We strive to create an inclusive and dynamic learning environment that leverages technology to break down barriers and provide opportunities for everyone. Our platform is designed to adapt to your learning style and pace, ensuring a personalized and effective learning experience.
      </p>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;

