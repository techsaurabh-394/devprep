import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewReport from "./InterviewReport";

// Expanded local static questions for each profile
const QUESTION_BANK = {
  "SDE-1": [
    // Technical
    "What is object-oriented programming (OOP)?",
    "Explain the difference between let, var, and const in JavaScript.",
    "What is a closure? Give an example.",
    "How does the event loop work in JavaScript?",
    "What is REST API and why is it important?",
    "What is the difference between == and === in JavaScript?",
    "How do you optimize a website for performance?",
    "What is a callback function?",
    "What is a promise and how do you use it?",
    "Explain the concept of hoisting.",
    // Smartness/Behavioral
    "Tell me about a time you solved a difficult problem.",
    "How do you handle stress during tight deadlines?",
    "Describe a situation where you worked in a team.",
    "How do you approach learning a new technology?",
    "What motivates you as a developer?",
    "How do you handle feedback or criticism?",
    "Describe a time you made a mistake and how you handled it.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "What is your strategy for debugging code?",
    "How do you stay updated with new technologies?",
    "What is your greatest strength as a developer?",
    "What is your biggest weakness and how are you working on it?",
    "Why do you want to work as a software developer?",
    "How do you ensure code quality in your projects?",
    "Describe a project you are proud of.",
  ],
  "SDE-2": [
    // Technical
    "Explain the SOLID principles.",
    "What is dependency injection?",
    "How do you handle code reviews?",
    "Describe a microservices architecture.",
    "What is a design pattern you use often and why?",
    "How do you ensure scalability in your applications?",
    "What is a memory leak and how do you prevent it?",
    "How do you handle authentication and authorization?",
    "What is a load balancer and why is it used?",
    "Explain the CAP theorem.",
    // Smartness/Behavioral
    "Describe a time you led a team to success.",
    "How do you handle conflicts in a team?",
    "Tell me about a time you failed and what you learned.",
    "How do you mentor junior developers?",
    "What is your approach to learning new frameworks?",
    "How do you balance speed and quality in software delivery?",
    "Describe a challenging bug you fixed.",
    "How do you handle multiple priorities?",
    "What is your process for system design?",
    "How do you keep your team motivated?",
    "Describe a time you improved a process or workflow.",
    "How do you handle negative feedback?",
    "What is your biggest professional achievement?",
    "How do you ensure your code is production-ready?",
    "Describe a time you had to quickly learn a new technology.",
  ],
  "SDE-3": [
    // Technical
    "How do you architect large-scale systems?",
    "What is event-driven architecture?",
    "How do you ensure high availability?",
    "What is eventual consistency?",
    "How do you handle distributed transactions?",
    "What is a service mesh?",
    "How do you manage technical debt?",
    "What is your approach to system monitoring?",
    "How do you handle legacy code?",
    "What is your experience with cloud-native applications?",
    // Smartness/Behavioral
    "Describe your leadership style.",
    "How do you handle underperforming team members?",
    "Tell me about a time you managed a crisis.",
    "How do you foster innovation in your team?",
    "What is your approach to cross-team collaboration?",
    "Describe a time you influenced a major decision.",
    "How do you handle conflicting priorities from stakeholders?",
    "What is your strategy for mentoring senior engineers?",
    "How do you ensure knowledge sharing in your team?",
    "Describe a time you had to make a tough call.",
    "How do you handle burnout in your team?",
    "What is your biggest leadership challenge?",
    "How do you measure team success?",
    "Describe a time you drove organizational change.",
  ],
  "Data Analyst": [
    // Technical
    "What is data normalization?",
    "How do you handle missing data?",
    "What is a pivot table?",
    "Explain the difference between inner and outer join.",
    "What is data wrangling?",
    "How do you visualize data trends?",
    "What is a KPI?",
    "What is regression analysis?",
    "How do you use SQL for data analysis?",
    "What is a dashboard?",
    // Smartness/Behavioral
    "Describe a time you found an unexpected insight in data.",
    "How do you explain complex data to non-technical stakeholders?",
    "What is your process for validating data accuracy?",
    "How do you prioritize multiple data requests?",
    "Describe a challenging data project you worked on.",
    "How do you handle tight deadlines?",
    "What is your approach to learning new data tools?",
    "Describe a time you made a data-driven recommendation.",
    "How do you handle conflicting data sources?",
    "What is your biggest data analysis success?",
    "How do you ensure data privacy?",
    "Describe a time you automated a data process.",
    "How do you handle feedback on your analysis?",
    "What is your favorite data visualization tool and why?",
  ],
  "Data Scientist": [
    // Technical
    "What is supervised vs unsupervised learning?",
    "What is a confusion matrix?",
    "Explain feature engineering.",
    "What is regularization?",
    "What is a neural network?",
    "How do you handle imbalanced datasets?",
    "What is cross-validation?",
    "What is PCA?",
    "What is a random forest?",
    "What is model overfitting?",
    // Smartness/Behavioral
    "Describe a time you solved a business problem with data science.",
    "How do you explain a complex model to a non-technical audience?",
    "What is your process for model selection?",
    "How do you stay updated with new ML techniques?",
    "Describe a time you worked with a difficult dataset.",
    "How do you handle project deadlines?",
    "What is your approach to learning new algorithms?",
    "Describe a time you improved a model's accuracy.",
    "How do you handle feedback on your models?",
    "What is your biggest data science achievement?",
    "How do you ensure reproducibility in your work?",
    "Describe a time you collaborated with domain experts.",
    "How do you handle model deployment challenges?",
    "What is your favorite ML library and why?",
  ],
  "Cybersecurity Engineer": [
    // Technical
    "What is a firewall and how does it work?",
    "What is penetration testing?",
    "What is the difference between symmetric and asymmetric encryption?",
    "How do you secure a network?",
    "What is a DDoS attack?",
    "What is a vulnerability assessment?",
    "What is two-factor authentication?",
    "How do you handle a security breach?",
    "What is a honeypot?",
    "What is a security policy?",
    // Smartness/Behavioral
    "Describe a time you responded to a security incident.",
    "How do you stay updated with new threats?",
    "What is your process for risk assessment?",
    "How do you explain security risks to non-technical staff?",
    "Describe a time you found a critical vulnerability.",
    "How do you handle stress during a security crisis?",
    "What is your approach to learning new security tools?",
    "Describe a time you improved security in your organization.",
    "How do you handle feedback on your security practices?",
    "What is your biggest cybersecurity success?",
    "How do you ensure compliance with regulations?",
    "Describe a time you trained others on security.",
    "How do you handle conflicting security priorities?",
    "What is your favorite security tool and why?",
  ],
  "DevOps Engineer": [
    // Technical
    "What is CI/CD and why is it important?",
    "What is containerization?",
    "What is Kubernetes?",
    "How do you automate deployments?",
    "What is infrastructure as code?",
    "What is a service mesh?",
    "How do you monitor production systems?",
    "What is a blue-green deployment?",
    "What is a canary release?",
    "What is a load balancer?",
    // Smartness/Behavioral
    "Describe a time you automated a manual process.",
    "How do you handle deployment failures?",
    "What is your process for learning new DevOps tools?",
    "Describe a time you improved system reliability.",
    "How do you handle on-call duties?",
    "What is your approach to incident response?",
    "Describe a time you worked with developers to solve an issue.",
    "How do you handle feedback on your DevOps practices?",
    "What is your biggest DevOps achievement?",
    "How do you ensure security in your pipelines?",
    "Describe a time you managed infrastructure at scale.",
    "How do you handle conflicting priorities?",
    "What is your favorite DevOps tool and why?",
    "How do you ensure cost efficiency in cloud deployments?",
  ],
  "QA Engineer": [
    // Technical
    "What is the difference between manual and automated testing?",
    "How do you write effective test cases?",
    "What is regression testing?",
    "What is a test plan?",
    "How do you use Selenium?",
    "What is a bug life cycle?",
    "How do you prioritize bugs?",
    "What is continuous testing?",
    "What is a test suite?",
    "How do you ensure test coverage?",
    // Smartness/Behavioral
    "Describe a time you found a critical bug.",
    "How do you handle tight testing deadlines?",
    "What is your process for learning new testing tools?",
    "Describe a time you improved testing efficiency.",
    "How do you handle feedback on your testing?",
    "What is your biggest QA achievement?",
    "How do you ensure communication with developers?",
    "Describe a time you managed multiple testing projects.",
    "How do you handle conflicting priorities?",
    "What is your favorite testing tool and why?",
    "How do you ensure quality in agile teams?",
    "Describe a time you automated a manual test.",
    "How do you handle test data management?",
    "What is your approach to exploratory testing?",
  ],
  "UI/UX Designer": [
    // Technical
    "What is the difference between UI and UX?",
    "How do you conduct user research?",
    "What is a wireframe?",
    "How do you use Figma or Sketch?",
    "What is a user persona?",
    "How do you test usability?",
    "What is a design system?",
    "How do you ensure accessibility?",
    "What is a prototype?",
    "How do you handle design feedback?",
    // Smartness/Behavioral
    "Describe a time you improved a product's usability.",
    "How do you handle conflicting design opinions?",
    "What is your process for learning new design tools?",
    "Describe a time you worked with developers.",
    "How do you handle tight deadlines?",
    "What is your biggest design achievement?",
    "How do you ensure user-centric design?",
    "Describe a time you redesigned a product.",
    "How do you handle feedback from users?",
    "What is your favorite design tool and why?",
    "How do you ensure consistency in design?",
    "Describe a time you solved a design challenge.",
    "How do you handle multiple design projects?",
    "What is your approach to design thinking?",
  ],
  "Cloud Engineer": [
    // Technical
    "What is cloud computing?",
    "What is IaaS, PaaS, and SaaS?",
    "How do you design a scalable cloud architecture?",
    "What is serverless computing?",
    "How do you secure cloud resources?",
    "What is a VPC?",
    "How do you use AWS, Azure, or GCP?",
    "What is a load balancer?",
    "How do you automate cloud deployments?",
    "What is a cloud migration?",
    // Smartness/Behavioral
    "Describe a time you solved a cloud outage.",
    "How do you handle cost optimization in the cloud?",
    "What is your process for learning new cloud services?",
    "Describe a time you improved cloud security.",
    "How do you handle feedback on your cloud designs?",
    "What is your biggest cloud achievement?",
    "How do you ensure compliance in the cloud?",
    "Describe a time you managed a multi-cloud environment.",
    "How do you handle tight cloud project deadlines?",
    "What is your favorite cloud service and why?",
    "How do you ensure high availability in the cloud?",
    "Describe a time you automated a cloud process.",
    "How do you handle cloud monitoring?",
    "What is your approach to disaster recovery in the cloud?",
  ],
  "ML Engineer": [
    // Technical
    "What is supervised vs unsupervised learning?",
    "How do you build a neural network?",
    "What is model evaluation?",
    "How do you handle overfitting?",
    "What is feature selection?",
    "How do you deploy ML models?",
    "What is transfer learning?",
    "How do you use TensorFlow or PyTorch?",
    "What is a confusion matrix?",
    "How do you handle imbalanced data?",
    // Smartness/Behavioral
    "Describe a time you improved a model's accuracy.",
    "How do you explain ML concepts to non-technical people?",
    "What is your process for learning new ML techniques?",
    "Describe a time you solved a business problem with ML.",
    "How do you handle feedback on your models?",
    "What is your biggest ML achievement?",
    "How do you ensure reproducibility in ML projects?",
    "Describe a time you worked with a large dataset.",
    "How do you handle tight ML project deadlines?",
    "What is your favorite ML tool and why?",
    "How do you ensure model fairness?",
    "Describe a time you collaborated with data scientists.",
    "How do you handle model deployment challenges?",
    "What is your approach to ML research?",
  ],
  "Full Stack Developer": [
    // Technical
    "What is a full stack developer?",
    "What is the MERN stack?",
    "How do you design a RESTful API?",
    "What is server-side rendering?",
    "How do you manage state in React?",
    "What is GraphQL?",
    "How do you handle authentication in web apps?",
    "What is a microfrontend?",
    "How do you optimize web performance?",
    "What is a service worker?",
    // Smartness/Behavioral
    "Describe a time you built an end-to-end application.",
    "How do you handle conflicting requirements?",
    "What is your process for learning new frameworks?",
    "Describe a time you improved a web app's performance.",
    "How do you handle feedback from users?",
    "What is your biggest full stack achievement?",
    "How do you ensure code quality across the stack?",
    "Describe a time you worked with a cross-functional team.",
    "How do you handle tight deadlines?",
    "What is your favorite full stack tool and why?",
    "How do you ensure security in web apps?",
    "Describe a time you automated a full stack process.",
    "How do you handle deployment challenges?",
    "What is your approach to full stack research?",
  ],
};

// Map route role names to question bank keys
const ROLE_MAP = {
  "SDE-1": "SDE-1",
  "SDE-2": "SDE-2",
  "SDE-3": "SDE-2", // fallback to SDE-2
  "Data Analyst": "Data Science",
  "Data Scientist": "Data Science",
  "Cybersecurity Engineer": "Cybersecurity",
  "DevOps Engineer": "DevOps",
  "QA Engineer": "SDE-1", // fallback
  "UI/UX Designer": "Full Stack", // fallback
  "Cloud Engineer": "Cloud",
  "ML Engineer": "Machine Learning",
  "Full Stack Developer": "Full Stack",
};

function getRandomQuestions(role, min = 12, max = 15) {
  const mappedRole = ROLE_MAP[role] || role;
  const all = QUESTION_BANK[mappedRole] || [];
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = all.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to detect question type
function getQuestionType(question) {
  if (/sql/i.test(question)) return "SQL";
  if (/code|program|implement|function|method|write|algorithm/i.test(question))
    return "Coding";
  if (
    /data structure|array|tree|graph|sort|search|dsa|linked list|stack|queue|heap|trie|binary|bfs|dfs|recursion|dynamic programming/i.test(
      question
    )
  )
    return "DSA";
  if (
    /scenario|situation|case|team|project|experience|challenge|conflict|lead|mentor|feedback|collaborate|stakeholder|deadline|stress|mistake|failure|success|motivate|improve|learn|growth/i.test(
      question
    )
  )
    return "Behavioral";
  return "General";
}

const Interview = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Start interview: randomize questions
  const startInterview = () => {
    setQuestions(getRandomQuestions(role, 10));
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setSessionTime(0);
    setUserAnswers([]);
    setCurrentAnswer("");
    setFeedbackMsg("");
    setError(null);
  };

  // Timer for each question
  useEffect(() => {
    if (!interviewStarted) return;
    if (timeLeft > 0 && isRecording) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
  }, [timeLeft, isRecording, interviewStarted, stopRecording]);

  // Session timer
  useEffect(() => {
    if (!interviewStarted) return;
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewStarted]);

  // Webcam setup
  useEffect(() => {
    if (!interviewStarted) return;
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() =>
        setError(
          "Webcam access is required and was denied. Please allow webcam access and refresh the page."
        )
      );
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [interviewStarted]);

  // Recording logic (text only for now, can be extended to audio+cloudinary)
  const startRecording = () => {
    setIsRecording(true);
    setFeedbackMsg("");
  };
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setFeedbackMsg(
      "Answer recorded! Good job, review your answer for clarity and completeness."
    );
    handleAnswerSubmit(currentAnswer);
    // eslint-disable-next-line
  }, [currentAnswer]);

  // Handle answer submission and move to next question
  const handleAnswerSubmit = (answer) => {
    setUserAnswers((prev) => [...prev, answer]);
    setCurrentAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
    } else {
      setShowReport(true);
    }
  };

  // UI rendering
  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            {role} Interview
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Get ready for a real technical interview experience! You will have 1
            minute per question. Click below to begin.
          </p>
          <button
            onClick={startInterview}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Start Interview
          </button>
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  if (showReport) {
    // Generate dynamic feedback for each answer
    const questionAnalysis = questions.map((question, i) => {
      const answer = userAnswers[i] || "";
      const length = answer.length;
      const hasExample =
        /example|project|experience|once|case|situation|solved|handled/i.test(
          answer
        );
      const hasTech =
        /api|class|function|sql|cloud|security|test|model|data|design|pattern|architecture|deploy|bug|framework|tool|algorithm|database|frontend|backend|devops|ml|ai|ux|ui|server|client|code|debug|performance|optimize|feature|component|object|array|loop|variable|const|let|closure|promise|async|await|thread|process|docker|kubernetes|aws|azure|gcp|ci|cd|pipeline|microservice|monolith|cache|queue|message|broker|socket|rest|graphql|pwa|cdn|proxy|load balancer|auth|jwt|token|encryption|firewall|vpn|test|suite|coverage|regression|selenium|jest|mocha|chai|cypress|unit|integration|e2e|automation|manual|agile|scrum|kanban|jira|git|github|bitbucket|gitlab|branch|merge|pull|push|commit|review|lint|format|prettier|eslint|typescript|javascript|python|java|c#|c\+\+|php|ruby|go|rust|swift|kotlin|scala|dart|flutter|react|angular|vue|svelte|next|nuxt|node|express|spring|django|flask|laravel|rails|dotnet|asp|android|ios|mobile|web|desktop|cloud|serverless|lambda|function|api|endpoint|route|controller|service|repository|dao|orm|sql|nosql|mongodb|mysql|postgres|redis|elasticsearch|kafka|rabbitmq|sqs|sns|pubsub|event|listener|handler|callback|promise|observable|stream|buffer|queue|topic|partition|consumer|producer|subscriber|publisher|eventbus|eventstore|eventlog|eventsource|eventdriven|eventloop|eventemitter|eventhandler|eventlistener|eventsubscriber|eventpublisher|eventprocessor|eventaggregator|eventdispatcher|eventrouter|eventbroker|eventgateway|eventbridge|eventmesh|eventgrid|eventhub/i.test(
          answer
        );
      let score = 5 + Math.floor(Math.random() * 6); // 5-10
      let feedback = "";
      let improvements = [];
      if (!answer.trim()) {
        score = 0;
        feedback =
          "No answer provided. Please attempt every question for better feedback.";
        improvements = ["Write or record an answer next time."];
      } else if (length > 120 && hasExample && hasTech) {
        score = 9 + Math.floor(Math.random() * 2); // 9-10
        feedback =
          "Excellent! You gave a detailed, technical answer with a real example. This is the level expected in top interviews.";
        improvements = [
          "Keep up the depth and clarity.",
          "Consider adding even more real-world impact.",
        ];
      } else if (length > 60 && (hasExample || hasTech)) {
        score = 7 + Math.floor(Math.random() * 2); // 7-8
        feedback = hasExample
          ? "Good answer with a practical example. Try to add more technical details for a perfect response."
          : "Good technical answer. Add a real-world example to make it even stronger.";
        improvements = ["Add more detail or a real project experience."];
      } else if (length > 30) {
        score = 5 + Math.floor(Math.random() * 2); // 5-6
        feedback =
          "Decent answer, but you can elaborate more and give examples or technical depth.";
        improvements = [
          "Expand your answer.",
          "Give a real project or technical example.",
        ];
      } else {
        score = 3 + Math.floor(Math.random() * 2); // 3-4
        feedback =
          "Too short. Try to write or say more, and include technical details or a story.";
        improvements = [
          "Write a longer answer.",
          "Add technical terms and examples.",
        ];
      }
      return { question, answer, score, feedback, improvements };
    });
    const totalScore = questionAnalysis.reduce((sum, q) => sum + q.score, 0);
    const overallScore = Math.round(
      (totalScore / (questions.length * 10)) * 100
    );
    const strengths = [
      overallScore > 80 ? "Strong technical depth" : "Good effort",
      overallScore > 60 ? "Clear communication" : "Needs more detail",
    ];
    const areasToImprove = [
      overallScore < 90
        ? "Add more real-world examples"
        : "Keep up the great work!",
      overallScore < 70
        ? "Expand on technical details"
        : "Try to be even more concise",
    ];
    const recommendations =
      overallScore > 80
        ? "You are well prepared! Keep practicing with more scenario-based questions."
        : overallScore > 60
        ? "Focus on expanding your answers and relating them to real projects."
        : "Practice giving longer, more detailed answers with technical and real-world examples.";
    const overallSummary =
      overallScore > 80
        ? "Excellent performance! You have a strong grasp of both technical and behavioral aspects."
        : overallScore > 60
        ? "Good job! Keep practicing to add more depth and examples."
        : "Keep practicing to improve your answer length, technical depth, and use of examples.";
    return (
      <InterviewReport
        feedbackData={{
          overallSummary,
          questionAnalysis,
          overallScore,
          strengths,
          areasToImprove,
          recommendations,
        }}
        onClose={() => navigate("/interview")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-200">
        {/* Webcam always visible */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-4 right-4 w-32 h-24 rounded-xl border-4 border-purple-400 shadow-lg z-10 bg-black"
        />
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-purple-800 mb-2 md:mb-0 tracking-tight">
            Question {currentQuestionIndex + 1}{" "}
            <span className="text-lg font-normal text-gray-500">
              / {questions.length}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Time Left:</span>
            <span className="text-2xl font-mono text-blue-600 bg-blue-100 px-3 py-1 rounded-lg shadow-inner">
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-semibold text-gray-700 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-xl shadow-sm">
              {questions[currentQuestionIndex]}
            </h3>
            {/* Badge for question type */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${(() => {
                const type = getQuestionType(questions[currentQuestionIndex]);
                if (type === "Coding") return "bg-blue-700 text-white";
                if (type === "SQL") return "bg-green-600 text-white";
                if (type === "DSA") return "bg-orange-500 text-white";
                if (type === "Behavioral") return "bg-pink-400 text-white";
                return "bg-gray-300 text-gray-800";
              })()}`}
            >
              {getQuestionType(questions[currentQuestionIndex])}
            </span>
          </div>
          <textarea
            className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg shadow-sm resize-none font-${
              ["Coding", "SQL", "DSA"].includes(
                getQuestionType(questions[currentQuestionIndex])
              )
                ? "mono"
                : "sans"
            } ${
              ["Coding", "SQL", "DSA"].includes(
                getQuestionType(questions[currentQuestionIndex])
              )
                ? "bg-gray-900 text-green-200 border-blue-400 focus:ring-blue-600"
                : "border-purple-200 focus:ring-purple-400 text-gray-800 bg-white"
            }`}
            rows={4}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={
              getQuestionType(questions[currentQuestionIndex]) === "Coding"
                ? "Write your code here..."
                : getQuestionType(questions[currentQuestionIndex]) === "SQL"
                ? "Write your SQL query here..."
                : "Type your answer or use the mic..."
            }
            disabled={isRecording}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
            >
              {isRecording ? (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span>Start Recording</span>
                </>
              )}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-3 rounded-xl font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              <span>Stop Recording</span>
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => handleAnswerSubmit(currentAnswer)}
                disabled={isRecording || !currentAnswer.trim()}
                className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={() => handleAnswerSubmit(currentAnswer)}
                disabled={isRecording || !currentAnswer.trim()}
                className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-xl font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
              >
                Submit Interview
              </button>
            )}
          </div>
          {feedbackMsg && (
            <div className="mt-4 text-green-700 font-semibold bg-green-100 px-4 py-2 rounded-xl shadow-sm">
              {feedbackMsg}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between text-gray-500 text-base">
          <div>
            Answered:{" "}
            <span className="font-bold text-purple-700">
              {userAnswers.length}
            </span>{" "}
            / {questions.length}
          </div>
          <div>
            Session Time:{" "}
            <span className="font-bold text-blue-700">
              {Math.round(sessionTime / 60)}
            </span>{" "}
            min
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
