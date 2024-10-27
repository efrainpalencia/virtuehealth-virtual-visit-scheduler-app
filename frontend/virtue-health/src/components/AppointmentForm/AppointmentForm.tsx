// AppointmentForm.tsx

import React, { useState, useEffect } from "react";
import { Button, Form, Checkbox, Select, Progress, Steps, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointment } from "../../services/appointmentService";
import { getIdFromToken } from "../../services/authService";
import dayjs, { Dayjs } from "dayjs";

const { Step } = Steps;
const { Option } = Select;

interface Doctor {
  id: number;
  last_name: string;
  first_name: string;
}

const AppointmentForm: React.FC = () => {
  const { state } = useLocation();
  const doctor: Doctor | undefined = state?.doctor;
  const selectedDate: Dayjs | undefined = state?.selectedDate
    ? dayjs(state.selectedDate) // Convert ISO string to Dayjs
    : undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const navigate = useNavigate();

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!doctor || !selectedDate) {
      message.error("Doctor or selected date is missing.");
      navigate("/patient-portal/doctor-list");
    }
  }, [doctor, selectedDate, navigate]);

  const next = () => {
    if (currentStep === 0 && !termsAccepted) {
      message.error("Please accept the terms before proceeding.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!reason || !doctor || !selectedDate || !patientId) {
      message.error("Missing information for appointment booking.");
      return;
    }

    const appointmentData = {
      doctor_id: doctor.id,
      date: selectedDate.toISOString(),
      reason,
      status: "PENDING",
      patient_id: patientId,
    };

    try {
      await createAppointment(appointmentData);
      message.success("Appointment booked successfully!");
      navigate("/patient-portal");
    } catch (error) {
      message.error("Failed to book appointment.");
    }
  };

  const steps = [
    {
      title: "Terms of Service",
      content: (
        <div>
          <h3>Agree to the Terms and Conditions</h3>

          <Form>
            <Form.Item>
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "12px",
                  borderRadius: "4px",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                <p style={{ margin: 0 }}>
                  By using our service, you agree to comply with and be bound by
                  the following terms and conditions. Please review them
                  carefully. You must be at least 18 years old to use our
                  service. By using our service, you represent and warrant that
                  you meet this age requirement. Our virtual health appointment
                  service allows you to schedule and conduct virtual
                  consultations with healthcare providers. The service is
                  intended for non-emergency medical issues. For emergencies,
                  please call 911 or visit the nearest emergency room. As a
                  user, you are responsible for providing accurate and complete
                  information during registration and appointment scheduling.
                  You must ensure a stable internet connection and a suitable
                  device for virtual consultations. Additionally, you are
                  expected to follow the healthcare provider’s instructions and
                  recommendations.
                </p>
              </div>
            </Form.Item>
            <Form.Item>
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              >
                I agree to the terms and conditions
              </Checkbox>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: "Reason for Visit",
      content: (
        <div>
          <h3>Select the reason for your visit</h3>
          <Select
            style={{ width: 300 }}
            placeholder="Select a reason"
            onChange={(value) => setReason(value)}
          >
            <Option value="CHRONIC_CARE">Chronic Care</Option>
            <Option value="PREVENTATIVE_CARE">Preventative Care</Option>
            <Option value="SURGICAL_POST_OP">Surgical Post-op</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </div>
      ),
    },
    {
      title: "Review Appointment",
      content: (
        <div>
          <h3>Review and Confirm Your Appointment</h3>
          <p>
            <strong>Doctor:</strong> Dr. {doctor?.last_name || "N/A"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {selectedDate ? selectedDate.format("YYYY-MM-DD HH:mm") : "N/A"}
          </p>
          <p>
            <strong>Reason for Visit:</strong> {reason || "N/A"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Steps current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content" style={{ marginTop: "24px" }}>
        {steps[currentStep].content}
      </div>

      <div className="steps-action" style={{ marginTop: "24px" }}>
        {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Confirm Appointment
          </Button>
        )}
      </div>

      <Progress
        style={{ marginTop: "16px" }}
        percent={((currentStep + 1) / steps.length) * 100}
        showInfo={false}
      />
    </div>
  );
};

export default AppointmentForm;
