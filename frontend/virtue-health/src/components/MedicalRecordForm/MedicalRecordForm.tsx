import React from "react";
import { Form, Select, Input, Button, message } from "antd";
import {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  MedicalRecord,
  selectPhysicalActivityMap,
  selectPsychologicalAssessmentMap,
  selectDrugsAlcoholMap,
  selectMedicalConditionMap,
  selectInjuryIllnessMap,
  selectFamilyHistoryMap,
  selectTreatmentSurgeryMap,
  selectCurrentMedicationMap,
  selectAllergyMap,
  selectSideEffectsMap,
} from "../../services/medicalRecordService";

const { Option } = Select;

interface MedicalRecordFormProps {
  patientProfileId: number;
  medicalRecord: MedicalRecord | null;
  onSave: (record: MedicalRecord) => void;
  onCancel: () => void;
  onDelete: () => void; // Callback for handling deletion
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientProfileId,
  medicalRecord,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (
    values: Omit<MedicalRecord, "id" | "patient">
  ) => {
    try {
      let updatedRecord: MedicalRecord;

      if (medicalRecord && medicalRecord.id) {
        // Update the existing record
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

      onSave(updatedRecord); // Notify parent component
    } catch (error) {
      console.error("Failed to save medical record:", error);
      message.error("Error saving medical record. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!medicalRecord?.id) return;

    try {
      await deleteMedicalRecord(medicalRecord.id);
      message.success("Medical record deleted successfully!");
      onDelete(); // Notify parent component about deletion
    } catch (error) {
      console.error("Failed to delete medical record:", error);
      message.error("Error deleting medical record. Please try again.");
    }
  };

  const renderDropdownOptions = (options: { value: string; label: string }[]) =>
    options.map(({ value, label }) => (
      <Option key={value} value={value}>
        {label}
      </Option>
    ));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={{
        ...medicalRecord,
        physical_activity: medicalRecord?.physical_activity || "NONE",
        psychological_assessment:
          medicalRecord?.psychological_assessment || "NONE",
        drugs_alcohol: medicalRecord?.drugs_alcohol || "NONE",
        medical_condition: medicalRecord?.medical_condition || "NONE",
        injury_illness: medicalRecord?.injury_illness || "NONE",
        family_history: medicalRecord?.family_history || "NONE",
        treatment_surgery: medicalRecord?.treatment_surgery || "NONE",
        current_medication: medicalRecord?.current_medication || "NONE",
        allergy: medicalRecord?.allergy || "NONE",
        side_effects: medicalRecord?.side_effects || "NONE",
      }}
      style={{ width: 400 }}
    >
      <Form.Item
        name="height"
        label="Height"
        rules={[{ required: true, message: "Height is required!" }]}
      >
        <Input placeholder="Enter height (e.g., 6.1)" />
      </Form.Item>
      <Form.Item
        name="weight"
        label="Weight"
        rules={[{ required: true, message: "Weight is required!" }]}
      >
        <Input placeholder="Enter weight (e.g., 180)" />
      </Form.Item>
      <Form.Item
        name="physical_activity"
        label="Physical Activity"
        rules={[
          { required: true, message: "Please select physical activity!" },
        ]}
      >
        <Select placeholder="Select physical activity">
          {renderDropdownOptions(selectPhysicalActivityMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="psychological_assessment"
        label="Psychological Assessment"
        rules={[
          {
            required: true,
            message: "Please select a psychological assessment!",
          },
        ]}
      >
        <Select placeholder="Select psychological assessment">
          {renderDropdownOptions(selectPsychologicalAssessmentMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="drugs_alcohol"
        label="Drugs/Alcohol"
        rules={[
          { required: true, message: "Please select drugs/alcohol usage!" },
        ]}
      >
        <Select placeholder="Select drugs/alcohol usage">
          {renderDropdownOptions(selectDrugsAlcoholMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="medical_condition"
        label="Medical Conditions"
        rules={[
          { required: true, message: "Please select a medical condition!" },
        ]}
      >
        <Select placeholder="Select medical condition">
          {renderDropdownOptions(selectMedicalConditionMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="injury_illness"
        label="Injury/Illness"
        rules={[
          { required: true, message: "Please select an injury/illness!" },
        ]}
      >
        <Select placeholder="Select injury/illness">
          {renderDropdownOptions(selectInjuryIllnessMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="family_history"
        label="Family History"
        rules={[{ required: true, message: "Please select family history!" }]}
      >
        <Select placeholder="Select family medical history">
          {renderDropdownOptions(selectFamilyHistoryMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="treatment_surgery"
        label="Treatment/Surgery"
        rules={[
          { required: true, message: "Please select a treatment/surgery!" },
        ]}
      >
        <Select placeholder="Select treatment or surgery history">
          {renderDropdownOptions(selectTreatmentSurgeryMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="current_medication"
        label="Current Medication"
        rules={[
          { required: true, message: "Please select a current medication!" },
        ]}
      >
        <Select placeholder="Select current medication">
          {renderDropdownOptions(selectCurrentMedicationMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="allergy"
        label="Allergies"
        rules={[{ required: true, message: "Please select allergies!" }]}
      >
        <Select placeholder="Select allergies">
          {renderDropdownOptions(selectAllergyMap)}
        </Select>
      </Form.Item>
      <Form.Item
        name="side_effects"
        label="Side Effects"
        rules={[{ required: true, message: "Please select side effects!" }]}
      >
        <Select placeholder="Select side effects">
          {renderDropdownOptions(selectSideEffectsMap)}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          {medicalRecord ? "Save Changes" : "Create Record"}
        </Button>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        {medicalRecord && (
          <Button danger onClick={handleDelete}>
            Delete Record
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default MedicalRecordForm;
