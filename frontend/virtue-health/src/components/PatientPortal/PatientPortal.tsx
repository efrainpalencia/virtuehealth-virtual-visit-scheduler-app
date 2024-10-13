import React from "react";
import { Card } from "antd";

const PatientPortal: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Welcome to the Patient Portal</h1>
      </div>
      <div>
        <Card
          title="Book A Virtual Health Visit"
          bordered={true}
          style={{ width: 500 }}
        >
          <p>
            We are committed to providing a user-friendly and reliable platform
            that prioritizes your health and well-being. Our team of dedicated
            professionals works tirelessly to ensure that VirtueHealth meets the
            highest standards of security and privacy, so you can focus on what
            matters most—your health.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PatientPortal;
