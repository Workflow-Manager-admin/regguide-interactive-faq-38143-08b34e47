import React, { useState } from "react";
import "./MainContainer.css";

// Design theme colors
const COLORS = {
  primary: "#123d7d",
  secondary: "#F4F5F7",
  accent: "#2a6f52"
};

// Example questions and options for guided flow
const QUESTIONS = [
  {
    id: "regType",
    question: "What would you like to register?",
    options: [
      { label: "Business", value: "business" },
      { label: "Company", value: "company" }
    ]
  },
  {
    id: "businessType",
    question: "What type of business are you registering?",
    options: [
      { label: "Sole Proprietorship", value: "sole" },
      { label: "Partnership", value: "partnership" }
    ],
    dependsOn: { regType: "business" }
  },
  {
    id: "companyType",
    question: "Which company type do you want?",
    options: [
      { label: "Private Limited", value: "private" },
      { label: "Public Limited", value: "public" }
    ],
    dependsOn: { regType: "company" }
  }
];

// Document checklist sample data keyed by registration answers
const DOCUMENTS = {
  business: [
    { label: "Identification Card (IC)", icon: "🪪" },
    { label: "Business Address Proof", icon: "📄" }
  ],
  company: [
    { label: "Company Constitution", icon: "📜" },
    { label: "Director's IC", icon: "🪪" }
  ]
};

// FAQ sample
const FAQS = {
  business: [
    { question: "How long does registration take?", answer: "Typically 1-2 days." },
    { question: "Is a business name required?", answer: "Yes, a unique name is needed." }
  ],
  company: [
    { question: "What is a company constitution?", answer: "A document outlining company rules." },
    { question: "What are the fees?", answer: "Depends on company type." }
  ]
};

/**
 * Stepper-like interaction: progressive disclosure of questions, dynamic FAQ/checklist.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * This is the main interactive FAQ container.
   * - Guides user through step-by-step registration questions
   * - Once answered, reveals relevant FAQ and required documents checklist
   * - Uses a light modern theme with the provided color scheme for a professional look
   */
  // State
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Helper to get which step to display next
  function getVisibleQuestions() {
    // Reveal questions one-by-one, with dependency awareness
    const visible = [];
    for (let i = 0; i < QUESTIONS.length; ++i) {
      const q = QUESTIONS[i];
      if (q.dependsOn) {
        // Check all dependency keys for 'dependsOn'
        const depKeys = Object.keys(q.dependsOn);
        const depSatisfied = depKeys.every(
          k => answers[k] === q.dependsOn[k]
        );
        if (!depSatisfied) continue;
      }
      visible.push(q);
      // Stop at first unanswered
      if (!(q.id in answers)) break;
    }
    return visible;
  }

  const visibleQuestions = getVisibleQuestions();

  // What to show after completion
  function getPersona() {
    if (answers.regType === "business") return "business";
    if (answers.regType === "company") return "company";
    return null;
  }

  const persona = getPersona();

  // Event: answer question
  function handleSelect(qid, value) {
    setAnswers(prev => {
      // Remove answers to dependent questions if switching decision path
      const next = { ...prev, [qid]: value };
      // Remove irrelevant answers when branching
      if (qid === "regType") {
        delete next.businessType;
        delete next.companyType;
      }
      return next;
    });
    // Step forward if not last
    if (visibleQuestions.length === QUESTIONS.length - 1) {
      setCompleted(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  // Stepper/progressive question UI
  return (
    <div className="regguide-container" data-theme="light">
      <div className="rg-card">
        <h2 className="rg-title">RegGuide Interactive FAQ</h2>
        <div className="rg-progress">
          <span>
            Step {completed ? QUESTIONS.length : visibleQuestions.length} of {QUESTIONS.length}
          </span>
          <progress
            max={QUESTIONS.length}
            value={completed ? QUESTIONS.length : visibleQuestions.length}
            style={{ width: 120, verticalAlign: "middle" }}
          />
        </div>
        <div className="rg-flow">
          {visibleQuestions.map((q, idx) => (
            <div
              className={`rg-qblock${answers[q.id] ? " answered" : ""}`}
              key={q.id}
            >
              <div className="rg-question">
                <span className="rg-qnum">{idx + 1}.</span>
                <span>{q.question}</span>
              </div>
              {!answers[q.id] && (
                <div className="rg-options">
                  {q.options.map(opt => (
                    <button
                      className="rg-btn"
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      style={{
                        background: COLORS.primary,
                        color: "#fff"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {answers[q.id] && (
                <div className="rg-answer">
                  <span className="rg-chip">{q.options.find(o => o.value === answers[q.id])?.label}</span>
                </div>
              )}
            </div>
          ))}

          {/* When completed, show checklist & FAQ */}
          {completed && persona && (
            <div className="rg-results">
              <h3 className="rg-section-title" style={{ color: COLORS.primary }}>
                📄 Document Checklist
              </h3>
              <ul className="rg-doc-list">
                {DOCUMENTS[persona].map((doc, i) => (
                  <li className="rg-doc-item" key={i}>
                    <span className="rg-doc-icon">{doc.icon}</span>
                    <span>{doc.label}</span>
                  </li>
                ))}
              </ul>
              <h3 className="rg-section-title" style={{ color: COLORS.accent }}>
                ❓ Frequently Asked Questions
              </h3>
              <div className="rg-faq-list">
                {FAQS[persona].map((f, i) => (
                  <details className="rg-faq" key={i}>
                    <summary className="rg-faq-q">{f.question}</summary>
                    <div className="rg-faq-a">{f.answer}</div>
                  </details>
                ))}
              </div>
              <div className="rg-reset-block">
                <button
                  className="rg-btn"
                  style={{ background: COLORS.accent, color: "#fff" }}
                  onClick={() => {
                    setAnswers({});
                    setCurrentStep(0);
                    setCompleted(false);
                  }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
