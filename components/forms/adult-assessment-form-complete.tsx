// components/forms/adult-assessment-form-complete.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Home, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import all section components
import { PatientInfoSection } from "./sections/patient-info-section";
import { PrimaryDiagnosisSection } from "./sections/primary-diagnosis-section";
import { RiskFactorSection } from "./sections/risk-factor-section";
import { AsthmaSection } from "./sections/asthma-section";
import { COPDSection } from "./sections/copd-section";
import { ARSection } from "./sections/ar-section";
import { ComplianceSection } from "./sections/compliance-section";
import { InhalerTechniqueSection } from "./sections/inhaler-technique-section";
import { NonComplianceReasonsSection } from "./sections/non-compliance-reasons-section";
import { DRPsSection } from "./sections/drps-section";
import { SideEffectsSection } from "./sections/side-effects-section";
import { MedicationsSection } from "./sections/medications-section";

// Type definitions
interface FormData {
  assessmentDate: string;
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  age: string;
  alcohol: "YES" | "NO" | "";
  alcoholAmount: string;
  smoking: "YES" | "NO" | "";
  smokingAmount: string;
  primaryDiagnosis: string;
  note: string;
  asthma: {
    pef: string;
    pefPercent: string;
    day: string;
    night: string;
    rescue: string;
    er: string;
    admit: string;
    controlLevel: string;
  };
  copd: {
    mMRC: string;
    cat: string;
    exacerbPerYear: string;
    fev1: string;
    sixMWD: string;
    stage: string;
  };
  ar: {
    symptoms: string;
    severity: "MILD" | "MOD_SEVERE" | "";
    pattern: "INTERMITTENT" | "PERSISTENT" | "";
  };
  compliance: {
    complianceStatus:
      | "GOOD_COMPLIANCE"
      | "FIRST_USE"
      | "CANNOT_ASSESS"
      | "NON_COMPLIANCE"
      | "";
    cannotAssessReason: string;
    compliancePercent: string;
    nonComplianceReasons: {
      incorrectTechnique: boolean;
      incorrectDosage: boolean;
    };
  };
  technique: {
    techniqueCorrect: boolean | null;
    techniqueSteps: {
      prepare: {
        [device: string]: {
          status: "correct" | "incorrect" | "none";
          note: string;
        };
      };
      inhale: {
        [device: string]: {
          status: "correct" | "incorrect" | "none";
          note: string;
        };
      };
      rinse: {
        [device: string]: {
          status: "correct" | "incorrect" | "none";
          note: string;
        };
      };
      empty: {
        [device: string]: {
          status: "correct" | "incorrect" | "none";
          note: string;
        };
      };
    };
    spacerType: string;
  };
  nonComplianceReasons: {
    lessThan: boolean;
    lessThanDetail: string;
    moreThan: boolean;
    moreThanDetail: string;
    lackKnowledge: boolean;
    notReadLabel: boolean;
    elderly: boolean;
    forget: boolean;
    fearSideEffects: boolean;
    other: string;
  };
  drps: string;
  sideEffects: {
    hasSideEffects: boolean | null;
    oralCandidiasis: boolean;
    hoarseVoice: boolean;
    palpitation: boolean;
    other: string;
    management: string;
  };
  medications: {
    medicationStatus: "NO_REMAINING" | "HAS_REMAINING" | "";
    items: Array<{
      id: string;
      name: string;
      quantity: number;
    }>;
  };
}

interface PatientVisit {
  id: string;
  assessmentDate: string;
  primaryDiagnosis: string;
  compliancePercent: number;
  assessedBy: string;
}

interface PatientData {
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  age: number | null;
  assessments: PatientVisit[];
}

const getInitialFormData = (): FormData => ({
  assessmentDate: new Date().toISOString().split("T")[0],
  hospitalNumber: "",
  firstName: "",
  lastName: "",
  age: "",
  alcohol: "",
  alcoholAmount: "",
  smoking: "",
  smokingAmount: "",
  primaryDiagnosis: "",
  note: "",
  asthma: {
    pef: "",
    pefPercent: "",
    day: "",
    night: "",
    rescue: "",
    er: "",
    admit: "",
    controlLevel: "",
  },
  copd: {
    mMRC: "",
    cat: "",
    exacerbPerYear: "",
    fev1: "",
    sixMWD: "",
    stage: "",
  },
  ar: {
    symptoms: "",
    severity: "",
    pattern: "",
  },
  compliance: {
    complianceStatus: "",
    cannotAssessReason: "",
    compliancePercent: "",
    nonComplianceReasons: {
      incorrectTechnique: false,
      incorrectDosage: false,
    },
  },
  technique: {
    techniqueCorrect: null,
    techniqueSteps: {
      prepare: {},
      inhale: {},
      rinse: {},
      empty: {},
    },
    spacerType: "",
  },
  nonComplianceReasons: {
    lessThan: false,
    lessThanDetail: "",
    moreThan: false,
    moreThanDetail: "",
    lackKnowledge: false,
    notReadLabel: false,
    elderly: false,
    forget: false,
    fearSideEffects: false,
    other: "",
  },
  drps: "",
  sideEffects: {
    hasSideEffects: null,
    oralCandidiasis: false,
    hoarseVoice: false,
    palpitation: false,
    other: "",
    management: "",
  },
  medications: {
    medicationStatus: "",
    items: [],
  },
});

export function AdultAssessmentFormComplete() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("User");
  const [originalAssessedBy, setOriginalAssessedBy] = useState("");
  const [searchHN, setSearchHN] = useState("");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  // Get username from cookie
  useEffect(() => {
    console.log("=== DEBUG COOKIE START ===");
    console.log("All cookies:", document.cookie);

    const cookies = document.cookie.split(";");
    console.log("Cookies array:", cookies);

    const authCookie = cookies.find((c) => c.trim().startsWith("auth="));
    console.log("Auth cookie found:", authCookie);

    if (authCookie) {
      try {
        const authValue = decodeURIComponent(authCookie.split("=")[1]);
        console.log("Decoded auth value:", authValue);

        const authData = JSON.parse(authValue);
        console.log("Parsed auth data:", authData);
        console.log("Username:", authData.username);

        setCurrentUsername(authData.username || "User");
      } catch (error) {
        console.error("❌ Failed to parse auth cookie:", error);
        setCurrentUsername("User");
      }
    } else {
      console.warn("⚠️ No auth cookie found!");
    }
    console.log("=== DEBUG COOKIE END ===");
  }, []);

  const searchPatientByHN = async () => {
    if (!searchHN.trim()) {
      toast.error("กรุณากรอก HN");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/patients/search?hn=${searchHN.trim()}`);
      if (res.ok) {
        const patient: PatientData = await res.json();
        setPatientData(patient);

        // ✅ Sync ค่า HN จากช่องค้นหาไปยัง formData
        const newFormData = getInitialFormData();
        newFormData.hospitalNumber = searchHN.trim(); // ใช้ค่าจาก searchHN
        newFormData.firstName = patient.firstName || "";
        newFormData.lastName = patient.lastName || "";
        newFormData.age = patient.age?.toString() || "";
        setFormData(newFormData);

        setSelectedVisitId("");
        setIsEditMode(false);
        setOriginalAssessedBy("");
        toast.success(
          `พบข้อมูลผู้ป่วย: ${patient.firstName} ${patient.lastName} (${patient.assessments.length} visits)`
        );
      } else {
        setPatientData(null);
        setSelectedVisitId("");
        setIsEditMode(false);
        setOriginalAssessedBy("");

        // ✅ ถ้าไม่พบข้อมูล ให้ clear form แต่เก็บ HN ที่ค้นหาไว้
        const newFormData = getInitialFormData();
        newFormData.hospitalNumber = searchHN.trim(); // เก็บ HN ที่ค้นหา
        setFormData(newFormData);

        toast.info("ไม่พบข้อมูลผู้ป่วย จะสร้างข้อมูลใหม่");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setIsSearching(false);
    }
  };

  // components/forms/adult-assessment-form-complete.tsx
// ส่วนที่ต้องแก้ไข

const loadVisitData = async (visitId: string) => {
  if (!visitId || visitId === "new") {
    setIsEditMode(false);
    setSelectedVisitId("new");
    setOriginalAssessedBy("");

    const newFormData = getInitialFormData();
    if (patientData) {
      newFormData.hospitalNumber = patientData.hospitalNumber;
      newFormData.firstName = patientData.firstName || "";
      newFormData.lastName = patientData.lastName || "";
      newFormData.age = patientData.age?.toString() || "";
    }
    setFormData(newFormData);
    return;
  }

  setIsLoading(true);
  try {
    const res = await fetch(`/api/assessments/${visitId}`);
    if (res.ok) {
      const assessment = await res.json();

      setIsEditMode(true);
      setOriginalAssessedBy(assessment.assessedBy || "ไม่ระบุ");

      setFormData({
        assessmentDate: assessment.assessmentDate
          ? new Date(assessment.assessmentDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        hospitalNumber: assessment.patient.hospitalNumber || "",
        firstName: assessment.patient.firstName || "",
        lastName: assessment.patient.lastName || "",
        age: assessment.patient.age?.toString() || "",
        alcohol:
          assessment.alcohol === true
            ? "YES"
            : assessment.alcohol === false
            ? "NO"
            : "",
        alcoholAmount: assessment.alcoholAmount || "",
        smoking:
          assessment.smoking === true
            ? "YES"
            : assessment.smoking === false
            ? "NO"
            : "",
        smokingAmount: assessment.smokingAmount || "",
        primaryDiagnosis: assessment.primaryDiagnosis || "",
        note: assessment.note || "",
        asthma: {
          pef: assessment.asthmaData?.pef || "",
          pefPercent: assessment.asthmaData?.pefPercent || "",
          day: assessment.asthmaData?.day || "",
          night: assessment.asthmaData?.night || "",
          rescue: assessment.asthmaData?.rescue || "",
          er: assessment.asthmaData?.er || "",
          admit: assessment.asthmaData?.admit || "",
          controlLevel: assessment.asthmaData?.controlLevel || "",
        },
        copd: {
          mMRC: assessment.copdData?.mMRC || "",
          cat: assessment.copdData?.cat || "",
          exacerbPerYear: assessment.copdData?.exacerbPerYear || "",
          fev1: assessment.copdData?.fev1 || "",
          sixMWD: assessment.copdData?.sixMWD || "",
          stage: assessment.copdData?.stage || "",
        },
        ar: {
          symptoms: assessment.arData?.symptoms || "",
          severity: assessment.arData?.severity || "",
          pattern: assessment.arData?.pattern || "",
        },
        compliance: {
          complianceStatus: assessment.complianceStatus || "",
          cannotAssessReason: assessment.cannotAssessReason || "",
          compliancePercent: assessment.compliancePercent?.toString() || "",
          nonComplianceReasons: {
            incorrectTechnique:
              assessment.nonComplianceReasons?.includes(
                "INCORRECT_TECHNIQUE"
              ) || false,
            incorrectDosage:
              assessment.nonComplianceReasons?.includes("INCORRECT_DOSAGE") ||
              false,
          },
        },
        technique: {
          // ✅ FIX: ต้องรักษา null state ไว้ ไม่ใช่ใช้ || null
          techniqueCorrect: assessment.techniqueCorrect === true 
            ? true 
            : assessment.techniqueCorrect === false 
            ? false 
            : null,
          techniqueSteps: assessment.techniqueSteps || {
            prepare: {},
            inhale: {},
            rinse: {},
            empty: {},
          },
          spacerType: assessment.spacerType || "",
        },
        nonComplianceReasons: {
          lessThan:
            assessment.nonComplianceReasons?.includes("LESS_THAN") || false,
          lessThanDetail: assessment.lessThanDetail || "",
          moreThan:
            assessment.nonComplianceReasons?.includes("MORE_THAN") || false,
          moreThanDetail: assessment.moreThanDetail || "",
          lackKnowledge:
            assessment.nonComplianceReasons?.includes("LACK_KNOWLEDGE") ||
            false,
          notReadLabel:
            assessment.nonComplianceReasons?.includes("NOT_READ_LABEL") ||
            false,
          elderly:
            assessment.nonComplianceReasons?.includes("ELDERLY") || false,
          forget:
            assessment.nonComplianceReasons?.includes("FORGET") || false,
          fearSideEffects:
            assessment.nonComplianceReasons?.includes("FEAR_SIDE_EFFECTS") ||
            false,
          other: assessment.nonComplianceOther || "",
        },
        drps: assessment.drps || "",
        sideEffects: {
          // ✅ FIX: ต้องรักษา false state ไว้ (เหมือนกับ techniqueCorrect)
          hasSideEffects: assessment.hasSideEffects === true
            ? true
            : assessment.hasSideEffects === false
            ? false
            : null,
          oralCandidiasis:
            assessment.sideEffects?.includes("ORAL_CANDIDIASIS") || false,
          hoarseVoice:
            assessment.sideEffects?.includes("HOARSE_VOICE") || false,
          palpitation:
            assessment.sideEffects?.includes("PALPITATION") || false,
          other: assessment.sideEffectsOther || "",
          management: assessment.sideEffectsManagement || "",
        },
        medications: {
          medicationStatus: assessment.medicationStatus || "",
          items: assessment.medications || [],
        },
      });

      toast.success("โหลดข้อมูลการเข้ารับการรักษาสำเร็จ");
    } else {
      toast.error("ไม่สามารถโหลดข้อมูลการเข้ารับการรักษาได้");
    }
  } catch (error) {
    console.error("Load visit error:", error);
    toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hospitalNumber) {
      toast.error("กรุณากรอก HN");
      return;
    }

    setIsLoading(true);
    try {
      const apiData = {
        hospitalNumber: formData.hospitalNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age ? parseInt(formData.age) : null,
        assessmentDate: formData.assessmentDate,
        alcohol: formData.alcohol === "YES",
        alcoholAmount: formData.alcoholAmount || null,
        smoking: formData.smoking === "YES",
        smokingAmount: formData.smokingAmount || null,
        primaryDiagnosis: formData.primaryDiagnosis || null,
        secondaryDiagnoses: [],
        note: formData.note || null,
        asthmaData: {
          pef: formData.asthma.pef || null,
          pefPercent: formData.asthma.pefPercent || null,
          day: formData.asthma.day || null,
          night: formData.asthma.night || null,
          rescue: formData.asthma.rescue || null,
          er: formData.asthma.er || null,
          admit: formData.asthma.admit || null,
          controlLevel: formData.asthma.controlLevel || null,
        },
        copdData: {
          mMRC: formData.copd.mMRC || null,
          cat: formData.copd.cat || null,
          exacerbPerYear: formData.copd.exacerbPerYear || null,
          fev1: formData.copd.fev1 || null,
          sixMWD: formData.copd.sixMWD || null,
          stage: formData.copd.stage || null,
        },
        arData: {
          symptoms: formData.ar.symptoms || null,
          severity: formData.ar.severity || null,
          pattern: formData.ar.pattern || null,
        },
        complianceStatus: formData.compliance.complianceStatus || null,
        compliancePercent: parseInt(formData.compliance.compliancePercent) || 0,
        cannotAssessReason: formData.compliance.cannotAssessReason || null,
        nonComplianceReasons: [
          ...(formData.compliance.nonComplianceReasons.incorrectTechnique
            ? ["INCORRECT_TECHNIQUE"]
            : []),
          ...(formData.compliance.nonComplianceReasons.incorrectDosage
            ? ["INCORRECT_DOSAGE"]
            : []),
          ...(formData.nonComplianceReasons.lessThan ? ["LESS_THAN"] : []),
          ...(formData.nonComplianceReasons.moreThan ? ["MORE_THAN"] : []),
          ...(formData.nonComplianceReasons.lackKnowledge
            ? ["LACK_KNOWLEDGE"]
            : []),
          ...(formData.nonComplianceReasons.notReadLabel
            ? ["NOT_READ_LABEL"]
            : []),
          ...(formData.nonComplianceReasons.elderly ? ["ELDERLY"] : []),
          ...(formData.nonComplianceReasons.forget ? ["FORGET"] : []),
          ...(formData.nonComplianceReasons.fearSideEffects
            ? ["FEAR_SIDE_EFFECTS"]
            : []),
        ],
        lessThanDetail: formData.nonComplianceReasons.lessThanDetail || null,
        moreThanDetail: formData.nonComplianceReasons.moreThanDetail || null,
        nonComplianceOther: formData.nonComplianceReasons.other || null,
        hasSideEffects: formData.sideEffects.hasSideEffects,
        sideEffects: [
          ...(formData.sideEffects.oralCandidiasis ? ["ORAL_CANDIDIASIS"] : []),
          ...(formData.sideEffects.hoarseVoice ? ["HOARSE_VOICE"] : []),
          ...(formData.sideEffects.palpitation ? ["PALPITATION"] : []),
        ],
        sideEffectsOther: formData.sideEffects.other || null,
        sideEffectsManagement: formData.sideEffects.management || null,
        drps: formData.drps || null,
        medicationStatus: formData.medications.medicationStatus || null,
        unopenedMedication:
          formData.medications.medicationStatus === "HAS_REMAINING",
        techniqueCorrect: formData.technique.techniqueCorrect,
        inhalerDevices: Object.keys(
          formData.technique.techniqueSteps.prepare || {}
        ).filter((device) =>
          Object.values(formData.technique.techniqueSteps).some(
            (step) => step[device]?.status !== "none"
          )
        ),
        techniqueSteps: formData.technique.techniqueSteps,
        spacerType: formData.technique.spacerType || null,
        medications: formData.medications.items,
      };

      let res;
      if (isEditMode && selectedVisitId && selectedVisitId !== "new") {
        res = await fetch(`/api/assessments/${selectedVisitId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      } else {
        res = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      }

      if (res.ok) {
        toast.success(isEditMode ? "แก้ไขข้อมูลสำเร็จ" : "บันทึกข้อมูลสำเร็จ");
        router.push("/form/success");
      } else {
        const error = await res.json();
        toast.error("เกิดข้อผิดพลาด", {
          description: error.error || "ไม่สามารถบันทึกข้อมูลได้",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถเชื่อมต่อกับระบบได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                แบบบันทึกการติดตามดูแลผู้ป่วย Asthma/COPD
                {isEditMode && (
                  <span className="text-sm text-orange-600 ml-2">
                    (กำลังแก้ไข)
                  </span>
                )}
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              {patientData && patientData.assessments.length > 0 && (
                <Select
                  value={selectedVisitId}
                  onValueChange={(value) => {
                    setSelectedVisitId(value);
                    loadVisitData(value);
                  }}
                >
                  <SelectTrigger className="h-9 text-sm w-48">
                    <SelectValue placeholder="เพิ่ม Visit ใหม่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">เพิ่ม Visit ใหม่</SelectItem>
                    {patientData.assessments.map((visit) => (
                      <SelectItem key={visit.id} value={visit.id}>
                        {new Date(visit.assessmentDate).toLocaleDateString(
                          "th-TH",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-1 items-center">
                <Input
                  value={searchHN}
                  onChange={(e) => setSearchHN(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchPatientByHN()}
                  className="h-9 text-sm w-32"
                  placeholder="ค้นหา HN"
                  disabled={isSearching}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={searchPatientByHN}
                  disabled={isSearching}
                  variant="outline"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                กลับหน้าหลัก
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2">
              <PrimaryDiagnosisSection
                primaryDiagnosis={formData.primaryDiagnosis}
                onDiagnosisChange={(value) =>
                  setFormData((prev) => ({ ...prev, primaryDiagnosis: value }))
                }
              />
            </div>

            <div className="col-span-2 row-span-2 col-start-3">
              <PatientInfoSection
                hospitalNumber={formData.hospitalNumber}
                firstName={formData.firstName}
                lastName={formData.lastName}
                age={formData.age}
                alcohol={formData.alcohol}
                alcoholAmount={formData.alcoholAmount}
                smoking={formData.smoking}
                smokingAmount={formData.smokingAmount}
                onFirstNameChange={(value) =>
                  setFormData((prev) => ({ ...prev, firstName: value }))
                }
                onLastNameChange={(value) =>
                  setFormData((prev) => ({ ...prev, lastName: value }))
                }
                onAgeChange={(value) =>
                  setFormData((prev) => ({ ...prev, age: value }))
                }
                onAlcoholChange={(value) =>
                  setFormData((prev) => ({ ...prev, alcohol: value }))
                }
                onAlcoholAmountChange={(value) =>
                  setFormData((prev) => ({ ...prev, alcoholAmount: value }))
                }
                onSmokingChange={(value) =>
                  setFormData((prev) => ({ ...prev, smoking: value }))
                }
                onSmokingAmountChange={(value) =>
                  setFormData((prev) => ({ ...prev, smokingAmount: value }))
                }
              />
            </div>

            <div className="col-span-2 row-start-2">
              <RiskFactorSection
                note={formData.note}
                onNoteChange={(value) =>
                  setFormData((prev) => ({ ...prev, note: value }))
                }
              />
            </div>

            <div className="row-span-2 row-start-3">
              <AsthmaSection
                asthma={formData.asthma}
                onAsthmaChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    asthma: { ...prev.asthma, ...data },
                  }))
                }
              />
            </div>

            <div className="row-start-3">
              <COPDSection
                copd={formData.copd}
                onCOPDChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    copd: { ...prev.copd, ...data },
                  }))
                }
              />
            </div>

            <div className="col-start-2 row-start-4">
              <ARSection
                ar={formData.ar}
                onARChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    ar: { ...prev.ar, ...data },
                  }))
                }
              />
            </div>

            <div className="col-span-2 row-span-2 col-start-3 row-start-3">
              <NonComplianceReasonsSection
                reasons={formData.nonComplianceReasons}
                compliancePercent={formData.compliance.compliancePercent}
                onReasonsChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    nonComplianceReasons: {
                      ...prev.nonComplianceReasons,
                      ...data,
                    },
                  }))
                }
                onCompliancePercentChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    compliance: {
                      ...prev.compliance,
                      compliancePercent: value,
                    },
                  }))
                }
              />
            </div>

            <div className="col-span-2 col-start-3 row-start-5">
              <SideEffectsSection
                sideEffects={formData.sideEffects}
                onSideEffectsChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    sideEffects: { ...prev.sideEffects, ...data },
                  }))
                }
              />
            </div>

            <div className="col-span-2 row-start-5">
              <ComplianceSection
                compliance={formData.compliance}
                onComplianceChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    compliance: { ...prev.compliance, ...data },
                  }))
                }
              />
            </div>

            <div className="col-span-1 col-start-4 row-start-6">
              <DRPsSection
                drps={formData.drps}
                onDRPsChange={(value) =>
                  setFormData((prev) => ({ ...prev, drps: value }))
                }
              />
            </div>

            <div className="col-span-3 row-span-2 row-start-6">
              <InhalerTechniqueSection
                technique={formData.technique}
                onTechniqueChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    technique: { ...prev.technique, ...data },
                  }))
                }
              />
            </div>

            <div className="col-span-1 row-span-2 col-start-4 row-start-7">
              <MedicationsSection
                medications={formData.medications}
                onMedicationsChange={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    medications: { ...prev.medications, ...data },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Footer - ย้ายออกนอก form และใช้ structure เหมือน Header */}
      <div className="sticky bottom-0 bg-white border-t shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isEditMode && originalAssessedBy ? (
                <>
                  <User className="w-4 h-4" />
                  <span>
                    ฟอร์มนี้บันทึกโดย:{" "}
                    <span className="font-medium text-gray-900">
                      {originalAssessedBy}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-gray-400">ฟอร์มใหม่</span>
              )}
            </div>

            {/* Right side */}
            <div className="flex gap-2 items-center">
              <div className="text-sm text-gray-600">
                {isEditMode ? "แก้ไขโดย" : "จะบันทึกในชื่อ"}:{" "}
                <span className="font-medium text-gray-900">
                  {currentUsername}
                </span>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("form")?.requestSubmit();
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "กำลังแก้ไข..." : "กำลังบันทึก..."}
                  </>
                ) : isEditMode ? (
                  "บันทึกการแก้ไข"
                ) : (
                  "บันทึกข้อมูล"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}