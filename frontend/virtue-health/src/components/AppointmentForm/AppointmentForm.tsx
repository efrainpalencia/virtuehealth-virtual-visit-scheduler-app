import React, { useState, useEffect } from "react";
import { Button, Form, Checkbox, Select, Progress, Steps, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointment } from "../../services/appointmentService";
import { getIdFromToken } from "../../services/authService";
import { removeScheduleDate } from "../../services/doctorService";
import { sendAppointmentEmail } from "../../services/emailService";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { getPatient, Patient } from "../../services/patientService";

const { Step } = Steps;
const { Option } = Select;
dayjs.extend(utc);

interface Doctor {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
}

const reasonMap = [
  { value: "CHRONIC_CARE", label: "Chronic Care" },
  { value: "PREVENTATIVE_CARE", label: "Preventative Care" },
  { value: "SURGICAL_POST_OP", label: "Surgical Post-op" },
  { value: "OTHER", label: "Other" },
];

const reasonDisplayMap = {
  CHRONIC_CARE: "Chronic Care",
  PREVENTATIVE_CARE: "Preventative Care",
  SURGICAL_POST_OP: "Surgical Post-op",
  OTHER: "Other",
};

const AppointmentForm: React.FC = () => {
  const { state } = useLocation();
  const doctor: Doctor | undefined = state?.doctor;
  const selectedDate: Dayjs | undefined = state?.selectedDate
    ? dayjs(state.selectedDate)
    : undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    if (!doctor || !selectedDate) {
      message.error("Doctor or selected date is missing.");
      navigate("/patient-portal/doctor-list");
    }
    if (!patientId) {
      message.error("No patient ID found.");
      return;
    }
    const fetchData = async () => {
      try {
        const fetchedPatient = await getPatient(patientId);
        setPatient(fetchedPatient);
      } catch (error) {
        message.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, [doctor, selectedDate, navigate, patientId]);

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

  const handleSubmit = async (): Promise<void> => {
    if (!reason || !doctor || !selectedDate || !patientId) {
      message.error("Missing information for appointment booking.");
      return;
    }

    setLoading(true);
    const appointmentData = {
      doctor_id: doctor.id,
      date: selectedDate.toISOString(),
      reason,
      status: "PENDING",
      patient_id: patientId,
    };

    try {
      await createAppointment(appointmentData);

      const emailPayload = {
        type: "create",
        patient_email: patient?.email,
        doctor_email: doctor.email,
        context: {
          doctor_name: `${doctor.first_name} ${doctor.last_name}`,
          patient_name: `${patient?.first_name || ""} ${
            patient?.last_name || ""
          }`.trim(),
          patient_fullname: `${patient?.first_name} ${patient?.last_name}`,
          patient_email: patient?.email,
          doctor_email: doctor.email,
          appointment_date: selectedDate.format("YYYY-MM-DD"),
          appointment_time: selectedDate.format("HH:mm"),
          reason: reasonDisplayMap[reason],
        },
      };

      try {
        await sendAppointmentEmail(emailPayload);
        message.success("Email sent successfully!");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        message.error("Appointment created, but email notification failed.");
      }

      // Remove the selected date from the doctor's schedule
      const formattedDate = selectedDate.utc().toISOString();
      try {
        await removeScheduleDate(doctor.id, selectedDate.toDate());
        message.success("Doctor's schedule updated successfully!");
      } catch (scheduleError) {
        console.error("Failed to update doctor's schedule:", scheduleError);
        message.warning(
          "Appointment created, but doctor's schedule update failed."
        );
      }

      message.success("Appointment booked successfully!");
      navigate("/patient-portal");
    } catch (error) {
      console.error("Failed to book appointment:", error);
      message.error("Failed to book appointment.");
    } finally {
      setLoading(false);
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
                  you meet this age requirement.
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
            placeholder="Select your reason"
            onChange={(value) => setReason(value)}
            style={{ margin: "10px" }}
          >
            {reasonMap.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
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
            <strong>Reason for Visit:</strong>{" "}
            {reasonDisplayMap[reason] || "N/A"}
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
        status={
          currentStep === steps.length - 1 && loading ? "active" : undefined
        }
        showInfo={false}
      />
    </div>
  );
};

export default AppointmentForm;
