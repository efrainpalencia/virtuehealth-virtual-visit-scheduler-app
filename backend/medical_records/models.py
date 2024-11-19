from django.db import models


class MedicalRecord(models.Model):
    patient = models.OneToOneField(
        'user.Patient', on_delete=models.CASCADE, related_name='medical_record_detail')
    height = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)

    class PhysicalActivity(models.TextChoices):
        NONE = "NONE", "None"
        ONE_TO_THREE_DAYS = "ONE_TO_THREE_DAYS", "One to Three Days"
        THREE_OR_MORE_DAYS = "THREE_OR_MORE_DAYS", "Three or More Days"

    physical_activity = models.CharField(
        max_length=251, choices=PhysicalActivity.choices, null=True, blank=False)

    class PsychologicalAssessment(models.TextChoices):
        NONE = "NONE", "None"
        OBSESSIVE_COMPULSIVE_DISORDER = "OBSESSIVE_COMPULSIVE_DISORDER", "Obsessive-compulsive Disorder"
        PANIC_DISORDER = "PANIC_DISORDER", "Panic Disorder"
        SOCIAL_ANXIETY_DISORDER = "SOCIAL_ANXIETY_DISORDER", "Social Anxiety Disorder"
        BIPOLAR_DISORDER = "BIPOLAR_DISORDER", "Bipolar Disorder",
        SCHIZOID_PERSONALITY_DISORDER = "SCHIZOID_PERSONALITY_DISORDER", "Schizoid Personality Disorder"
        BINGE_EATING_DISORDER = "BINGE_EATING_DISORDER", "Binge Eating Disorder"
        PICA = "PICA", "Pica"
        OTHER = "OTHER", "Other"

    psychological_assessment = models.CharField(
        max_length=500, choices=PsychologicalAssessment.choices, null=True, blank=False)

    class DrugsAlcohol(models.TextChoices):
        NONE = "NONE", "None"
        ALCOHOL = "ALCOHOL", "Alcohol"
        CANNABIS = "CANNABIS", "Cannabis"
        COCAINE = "COCAINE", "Cocaine"
        FENTANYL = "FENTANYL", "Fentanyl"
        HALLUCINOGINS = "HALLUCINOGINS", "Hallucinogens"
        HEROIN = "HEROIN", "Heroin"
        KETAMINE = "KETAMINE", "Ketamine"
        METHAMPHETAMINE = "METHAMPHETAMINE", "Methamphetamine"
        OXYCONTIN = "OXYCONTIN", "Oxycontin"
        TOBACCO = "TOBACCO", "Tobacco"
        OTHER = "OTHER", "Other"

    drugs_alcohol = models.CharField(
        max_length=500, choices=DrugsAlcohol.choices, null=True, blank=False)

    class MedicalCondition(models.TextChoices):
        NONE = "NONE", "None"
        HYPERLIPIDEMIA = "HYPERLIPIDEMIA", "Hyperlipidemia"
        LOW_BACK_PAIN = "LOW_BACK_PAIN", "Low Back Pain"
        GASTROESOPHAGEAL_REFLUX_DISORDER = "GASTROESOPHAGEAL_REFLUX_DISORDER", "Gastroesophageal Reflux Disorder"
        URINARY_TRACT_INFECTION = "URINARY_TRACT_INFECTION", "Urinary Tract Infection"
        CHEST_PAIN = "CHEST_PAIN", "Chest Pain"
        HYPOTHYROIDISM = "HYPOTHYROIDISM", "Hypothyroidism"
        ACUTE_BRONCHITIS = "ACUTE_BRONCHITIS", "Acute Bronchitis"
        TYPE_II_DIABETES_MELLITUS_WITHOUT_COMPLICATIONS = "TYPE_II_DIABETES_MELLITUS_WITHOUT_COMPLICATIONS", "Type II Diabetes Mellitus Without Complications"
        PAIN_IN_UNSPECIFIED_LIMB = "PAIN_IN_UNSPECIFIED_LIMB", "Pain in Unspecified Limb"
        OTHER = "OTHER", "Other"

    medical_condition = models.CharField(
        max_length=1000, choices=MedicalCondition.choices, null=True, blank=False)

    class InjuryIllness(models.TextChoices):
        NONE = "NONE", "None"
        SPRAIN_STRAIN = "SPRAIN_STRAIN", "Sprain/strain"
        KNEE_INJURY = "KNEE_INJURY", "Knee injury"
        SWOLLEN_MUSCLES = "SWOLLEN_MUSCLES", "Swollen muscles"
        ACHILLES_INJURY = "ACHILLES_INJURY", "Achilles injury"
        ROTATOR_CUFF_INJURY = "ROTATOR_CUFF_INJURY", "Rotator cuff injury"
        FRACTURE = "FRACTURE", "fracture"
        DISLOCATION = "DISLOCATION", "Dislocation"
        OTHER = "OTHER", "Other"

    injury_illness = models.CharField(
        max_length=750, choices=InjuryIllness.choices, null=True, blank=False)

    class FamilyHistory(models.TextChoices):
        NONE = "NONE", "None"
        HEART_DISEASE = "HEART_DISEASE", "Heart disease"
        DIABETES = "DIABETES", "Diabetes"
        KIDNEY_DISEASE = "KIDNEY_DISEASE", "Kidney disease"
        BLEEDING_DISEASE = "BLEEDING_DISEASE", "Bleeding disease"
        LUNG_DISEASE = "LUNG_DISEASE", "Lung disease"
        HIGH_BLOOD_PRESSURE = "HIGH_BLOOD_PRESSURE", "High blood pressure"
        HIGH_CHOLESTEROL = "HIGH_CHOLESTEROL", "High cholesterol"
        ASTHMA = "ASTHMA", "Asthma"
        CANCER = "CANCER", "Cancer"
        STROKE = "STROKE", "Stroke"
        ALZHEIMERS_DEMENTIA = "ALZHEIMERS_DEMENTIA", "Alzheimer's/Dementia"
        OTHER = "OTHER", "Other"

    family_history = models.CharField(
        max_length=500, choices=FamilyHistory.choices, null=True, blank=False)

    class TreatmentSurgery(models.TextChoices):
        NONE = "NONE", "None"
        APPENDECTOMY = "APPENDECTOMY", "Appendectomy"
        BREAST_BIOPSY = "BREAST_BIOPSY", "Breast biopsy"
        CATARACT_SURGERY = "CATARACT_SURGERY", "Cataract surgery"
        CESAREAN_SECTION = "CESAREAN_SECTION", "Cesarean section"
        CORONARY_ARTERTY_BYPASS = "CORONARY_ARTERTY_BYPASS", "Coronary artery bypass"
        HYSTERECTOMY = "HYSTERECTOMY", "Hysterectomy"
        LOW_BACK_PAIN_SURGERY = "LOW_BACK_PAIN_SURGERY", "Low back pain surgery"
        MASTECTOMY = "MASTECTOMY", "Mastectomy"
        PROSTECTOMY = "PROSTECTOMY", "Prostectomy"
        OTHER = "OTHER", "Other"

    treatment_surgery = models.CharField(
        max_length=750, choices=TreatmentSurgery.choices, null=True, blank=False)

    class CurrentMedication(models.TextChoices):
        NONE = "NONE", "None"
        ATORVASTATIN = "ATORVASTATIN", "Atorvastatin"
        METFORMIN = "METFORMIN", "Metformin"
        LISINOPRIL = "LISINOPRIL", "Lisinopril"
        LEVOTHROXINE = "LEVOTHROXINE", "Levothroxine"
        AMLODIPINE = "AMLODIPINE", "Amlodipine"
        METOPROLOL = "METOPROLOL", "Metoprolol"
        ALBUTEROL = "ALBUTEROL", "Albuterol"
        OTHER = "OTHER", "Other"

    current_medication = models.CharField(
        max_length=250, choices=CurrentMedication.choices, null=True, blank=False)

    class Allergy(models.TextChoices):
        NONE = "NONE", "None"
        FISH = "FISH", "Fish"
        SHELLFISH = "SHELLFISH", "Shellfish"
        TREE_NUTS = "TREE_NUTS", "Tree nuts"
        PEANUTS = "PEANUTS", "Peanuts"
        DAIRY = "DAIRY", "Dairy"
        EGGS = "EGGS", "Eggs"
        ANTIBIOTICS = "ANTIBIOTICS", "Antibiotics"
        ASPIRIN = "ASPIRIN", "Aspirin"
        CHEMOTHERAPY_MEDICATIONS = "CHEMOTHERAPY_MEDICATIONS", "Chemotherapy medications"
        ANTICONVULSANTS = "ANTICONVULSANTS", "Anticonvulsants"
        OTHER = "OTHER", "Other"

    allergy = models.CharField(
        max_length=250, choices=Allergy.choices, null=True, blank=False)

    class SideEffect(models.TextChoices):
        NONE = "NONE", "None"
        NAUSEA = "NAUSEA", "Nausea"
        SKIN_IRRITATION = "SKIN_IRRITATION", "Skin irritation"
        DRY_MOUTH = "DRY_MOUTH", "Dry mouth"
        DROWSINESS = "DROWSINESS", "Drowsiness"
        OTHER = "OTHER", "Other"

    side_effects = models.CharField(
        max_length=250, choices=SideEffect.choices, null=True, blank=False)

    def __str__(self):
        # Access email via the PatientProfile's user field
        return f"Medical Record for {self.patient.user.email}"
