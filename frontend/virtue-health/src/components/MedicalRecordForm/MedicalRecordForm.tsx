import React from "react";
import { Form, Input, Button, message } from "antd";
import {
  createMedicalRecord,
  updateMedicalRecord,
  MedicalRecord,
} from "../../services/medicalRecordService";

interface MedicalRecordFormProps {
  patientProfileId: number;
  medicalRecord: MedicalRecord | null;
  onSave: (record: MedicalRecord) => void;
  onCancel: () => void;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientProfileId,
  medicalRecord,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (
    values: Omit<MedicalRecord, "id" | "patient">
  ) => {
    try {
      let updatedRecord: MedicalRecord;

      if (medicalRecord && medicalRecord.id) {
        // Update an existing record
        updatedRecord = await updateMedicalRecord(medicalRecord.id, values);
        message.success("Medical record updated successfully!");
      } else {
        // Create a new record
        updatedRecord = await createMedicalRecord({
          ...values,
          patient: patientProfileId,
        });
        message.success("Medical record created successfully!");
      }

      onSave(updatedRecord); // Call the onSave callback
    } catch (error) {
      console.error("Failed to save medical record:", error);
      message.error("Error saving medical record. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={medicalRecord || {}}
      style={{ width: 400 }}
    >
      <Form.Item name="height" label="Height">
        <Input placeholder="Enter height" />
      </Form.Item>
      <Form.Item name="weight" label="Weight">
        <Input placeholder="Enter weight" />
      </Form.Item>
      <Form.Item name="physical_activity" label="Physical Activity">
        <Input placeholder="Enter physical activity details" />
      </Form.Item>
      <Form.Item
        name="psychological_assessment"
        label="Psychological Assessment"
      >
        <Input placeholder="Enter psychological assessment" />
      </Form.Item>
      <Form.Item name="drugs_alcohol" label="Drugs/Alcohol">
        <Input placeholder="Enter drugs/alcohol usage" />
      </Form.Item>
      <Form.Item name="medical_condition" label="Medical Conditions">
        <Input placeholder="Enter medical conditions" />
      </Form.Item>
      <Form.Item name="injury_illness" label="Injury/Illness">
        <Input placeholder="Enter injury/illness details" />
      </Form.Item>
      <Form.Item name="family_history" label="Family History">
        <Input placeholder="Enter family medical history" />
      </Form.Item>
      <Form.Item name="treatment_surgery" label="Treatment/Surgery">
        <Input placeholder="Enter treatment or surgery history" />
      </Form.Item>
      <Form.Item name="current_medication" label="Current Medication">
        <Input placeholder="Enter current medications" />
      </Form.Item>
      <Form.Item name="allergy" label="Allergies">
        <Input placeholder="Enter allergies" />
      </Form.Item>
      <Form.Item name="side_effects" label="Side Effects">
        <Input placeholder="Enter side effects" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          {medicalRecord ? "Save Changes" : "Create Record"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default MedicalRecordForm;
