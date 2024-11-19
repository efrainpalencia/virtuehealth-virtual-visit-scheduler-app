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
import {
  physicalActivityMap,
  psychologicalAssessmentMap,
  drugsAlcoholMap,
  medicalConditionMap,
  injuryIllnessMap,
  familyHistoryMap,
  treatmentSurgeryMap,
  currentMedicationMap,
  allergyMap,
  sideEffectsMap,
} from "../../services/medicalRecordService";
import { getPatient } from "../../services/patientService";
import MedicalRecordForm from "../MedicalRecordForm/MedicalRecordForm";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getIdFromToken, getRoleFromToken } from "../../services/authService";

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
  const [role, setRole] = useState<string | null>(null);

  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    if (token) {
      const roleFromToken = getRoleFromToken(token);
      const idFromToken = getIdFromToken(token);

      console.log("User Role:", roleFromToken);
      console.log("User ID:", idFromToken);

      setRole(roleFromToken);
      fetchRecord(idFromToken);
      fetchPatient(idFromToken);
    } else {
      message.error("No valid token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const fetchRecord = async (patientId: number) => {
    try {
      const record = await getMedicalRecord(patientId);
      console.log("Fetched Medical Record:", record);
      setMedicalRecord(record);
    } catch (error) {
      console.error("Error fetching medical record:", error);
      message.error("No medical record found.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatient = async (patientId: number) => {
    try {
      const patient = await getPatient(patientId);
      if (patient) {
        setPatientName({
          firstName: patient.first_name,
          lastName: patient.last_name,
        });
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      message.error("Failed to fetch patient details.");
    }
  };

  const handleSave = (updatedRecord: MedicalRecord) => {
    setMedicalRecord(updatedRecord);
    setIsEditing(false);
    message.success("Medical record saved successfully!");
  };

  const handleDelete = () => {
    setMedicalRecord(null); // Clear the record after deletion
    message.info("You can create a new medical record now.");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDateTime = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(
      `Medical Report for ${patientName?.firstName || ""} ${
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
      [
        "Physical Activity",
        physicalActivityMap[medicalRecord?.physical_activity || "NONE"],
      ],
      [
        "Psychological Assessment",
        psychologicalAssessmentMap[
          medicalRecord?.psychological_assessment || "NONE"
        ],
      ],
      [
        "Drugs/Alcohol",
        drugsAlcoholMap[medicalRecord?.drugs_alcohol || "NONE"],
      ],
      [
        "Medical Condition",
        medicalConditionMap[medicalRecord?.medical_condition || "NONE"],
      ],
      [
        "Injury/Illness",
        injuryIllnessMap[medicalRecord?.injury_illness || "NONE"],
      ],
      [
        "Family History",
        familyHistoryMap[medicalRecord?.family_history || "NONE"],
      ],
      [
        "Treatment/Surgery",
        treatmentSurgeryMap[medicalRecord?.treatment_surgery || "NONE"],
      ],
      [
        "Current Medication",
        currentMedicationMap[medicalRecord?.current_medication || "NONE"],
      ],
      ["Allergies", allergyMap[medicalRecord?.allergy || "NONE"]],
      ["Side Effects", sideEffectsMap[medicalRecord?.side_effects || "NONE"]],
    ];

    doc.autoTable({
      head: [["Field", "Details"]],
      body: recordData,
      startY: 22,
    });

    doc.save(
      `Medical_Report_${patientName?.firstName || ""}_${
        patientName?.lastName || ""
      }.pdf`
    );
  };

  const items = [
    { label: "Height", content: medicalRecord?.height || "Not provided" },
    { label: "Weight", content: medicalRecord?.weight || "Not provided" },
    {
      label: "Physical Activity",
      content: physicalActivityMap[medicalRecord?.physical_activity || "NONE"],
    },
    {
      label: "Psychological Assessment",
      content:
        psychologicalAssessmentMap[
          medicalRecord?.psychological_assessment || "NONE"
        ],
    },
    {
      label: "Drugs/Alcohol",
      content: drugsAlcoholMap[medicalRecord?.drugs_alcohol || "NONE"],
    },
    {
      label: "Medical Condition",
      content: medicalConditionMap[medicalRecord?.medical_condition || "NONE"],
    },
    {
      label: "Injury/Illness",
      content: injuryIllnessMap[medicalRecord?.injury_illness || "NONE"],
    },
    {
      label: "Family History",
      content: familyHistoryMap[medicalRecord?.family_history || "NONE"],
    },
    {
      label: "Treatment/Surgery",
      content: treatmentSurgeryMap[medicalRecord?.treatment_surgery || "NONE"],
    },
    {
      label: "Current Medication",
      content:
        currentMedicationMap[medicalRecord?.current_medication || "NONE"],
    },
    {
      label: "Allergies",
      content: allergyMap[medicalRecord?.allergy || "NONE"],
    },
    {
      label: "Side Effects",
      content: sideEffectsMap[medicalRecord?.side_effects || "NONE"],
    },
  ];

  if (loading) {
    return <Spin tip="Loading medical record..." />;
  }

  return (
    <div>
      <Row style={{ paddingBottom: "0" }}>
        <Breadcrumb
          items={[{ title: "Home" }, { title: "My Medical Report" }]}
        />
      </Row>
      {medicalRecord && !isEditing ? (
        <Card
          title="Medical Report"
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
          patientProfileId={getIdFromToken(token)}
          medicalRecord={medicalRecord}
          onSave={handleSave}
          onDelete={handleDelete}
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
