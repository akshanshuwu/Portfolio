import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Frontend Engineer</h4>
                <h5>Skill Sync</h5>
              </div>
              <h3>2025-Still</h3>
            </div>
            <p>
              Built and optimized responsive web interfaces using modern frontend frameworks.
              Collaborated with designers and backend teams to deliver fast,
              scalable, and user-friendly features while maintaining clean code and performance best practices.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelancing</h4>
              
              </div>
              <h3>2025-Still</h3>
            </div>
            <p>
              Worked with startups and individuals to build modern websites and mobile applications. 
              Delivered end-to-end solutions—from UI/UX design to deployment—focusing on performance, 
              scalability, and business impact..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
