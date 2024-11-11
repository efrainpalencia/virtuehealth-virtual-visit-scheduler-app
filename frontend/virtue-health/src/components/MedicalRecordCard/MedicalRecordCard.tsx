import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spin,
  message,
  Descriptions,
  Row,
  Breadcrumb,
} from "antd";
import {
  getMedicalRecord,
  MedicalRecord,
} from "../../services/medicalRecordService";
import { getPatient } from "../../services/patientService";
import MedicalRecordForm from "../MedicalRecordForm/MedicalRecordForm";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getIdFromToken } from "../../services/authService";

interface MedicalRecordCardProps {}

const MedicalRecordCard: React.FC = () => {
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [patientName, setPatientName] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const patientId = getIdFromToken(localStorage.getItem("access_token") || "");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const records = await getMedicalRecord(patientId);
        setMedicalRecord(records[0] || null);
      } catch (error) {
        message.error("No medical record found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [patientId]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await getPatient(patientId);
        console.log("Patient: ", patient);
        if (patient) {
          setPatientName({
            firstName: patient.first_name,
            lastName: patient.last_name,
          });
        }
      } catch (error) {
        message.error("Failed to fetch patient details.");
      }
    };
    fetchPatient();
  }, [patientId]);

  const handleSave = (updatedRecord: MedicalRecord) => {
    setMedicalRecord(updatedRecord);
    setIsEditing(false);
    message.success("Medical record saved successfully!");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDateTime = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(
      `Medical Record for ${patientName?.firstName || ""} ${
        patientName?.lastName || ""
      }`,
      14,
      10
    );
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDateTime}`, 14, 16);

    const recordData = [
      ["Height", medicalRecord?.height || "Not provided"],
      ["Weight", medicalRecord?.weight || "Not provided"],
      ["Physical Activity", medicalRecord?.physical_activity || "Not provided"],
      [
        "Psychological Assessment",
        medicalRecord?.psychological_assessment || "Not provided",
      ],
      ["Drugs/Alcohol", medicalRecord?.drugs_alcohol || "Not provided"],
      ["Medical Condition", medicalRecord?.medical_condition || "Not provided"],
      ["Injury/Illness", medicalRecord?.injury_illness || "Not provided"],
      ["Family History", medicalRecord?.family_history || "Not provided"],
      ["Treatment/Surgery", medicalRecord?.treatment_surgery || "Not provided"],
      [
        "Current Medication",
        medicalRecord?.current_medication || "Not provided",
      ],
      ["Allergies", medicalRecord?.allergy || "Not provided"],
      ["Side Effects", medicalRecord?.side_effects || "Not provided"],
    ];

    doc.autoTable({
      head: [["Field", "Details"]],
      body: recordData,
      startY: 22,
    });

    doc.save(
      `Medical_Record_${patientName?.firstName || ""}_${
        patientName?.lastName || ""
      }.pdf`
    );
  };

  const items = [
    { label: "Height", content: medicalRecord?.height || "Not provided" },
    { label: "Weight", content: medicalRecord?.weight || "Not provided" },
    {
      label: "Physical Activity",
      content: medicalRecord?.physical_activity || "Not provided",
    },
    {
      label: "Psychological Assessment",
      content: medicalRecord?.psychological_assessment || "Not provided",
    },
    {
      label: "Drugs/Alcohol",
      content: medicalRecord?.drugs_alcohol || "Not provided",
    },
    {
      label: "Medical Condition",
      content: medicalRecord?.medical_condition || "Not provided",
    },
    {
      label: "Injury/Illness",
      content: medicalRecord?.injury_illness || "Not provided",
    },
    {
      label: "Family History",
      content: medicalRecord?.family_history || "Not provided",
    },
    {
      label: "Treatment/Surgery",
      content: medicalRecord?.treatment_surgery || "Not provided",
    },
    {
      label: "Current Medication",
      content: medicalRecord?.current_medication || "Not provided",
    },
    { label: "Allergies", content: medicalRecord?.allergy || "Not provided" },
    {
      label: "Side Effects",
      content: medicalRecord?.side_effects || "Not provided",
    },
  ];

  if (loading) {
    return <Spin tip="Loading medical record..." />;
  }

  return (
    <div>
      <Row style={{ paddingBottom: "0" }}>
        <Breadcrumb
          items={[{ title: "Home" }, { title: "My Medical Records" }]}
        />
      </Row>
      {medicalRecord && !isEditing ? (
        <Card
          title="Medical Record"
          extra={
            <>
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Edit Record
              </Button>
              <Button onClick={handleDownloadPDF} style={{ marginLeft: 8 }}>
                Download as PDF
              </Button>
            </>
          }
          style={{ textAlign: "start", marginTop: "10px" }}
        >
          <Descriptions bordered column={3}>
            {items.map((item) => (
              <Descriptions.Item label={item.label} key={item.label}>
                {item.content}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      ) : isEditing ? (
        <MedicalRecordForm
          patientProfileId={patientId}
          medicalRecord={medicalRecord}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p>No medical record found.</p>
          <Button type="primary" onClick={() => setIsEditing(true)}>
            Create Medical Record
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordCard;
