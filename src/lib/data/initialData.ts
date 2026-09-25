import { 
  Profile, 
  Skill, 
  Project, 
  Certificate, 
  Education, 
  Experience, 
  Achievement, 
  SocialLink, 
  PortfolioSettings 
} from '../supabase/types';

export const initialProfile: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "[YOUR NAME]",
  tagline: "AI & Machine Learning Student | Developer | Problem Solver",
  short_bio: "I am a B.Tech Artificial Intelligence & Machine Learning student passionate about Artificial Intelligence, Machine Learning, software development, and building real-world applications.",
  career_objective: "Seeking internship and placement opportunities in AI, Machine Learning, and Software Development to leverage analytical problem-solving skills, deep learning architectures, and modern full-stack technologies to build scalable intelligent software.",
  degree: "B.Tech",
  branch: "Artificial Intelligence & Machine Learning",
  college: "[YOUR COLLEGE]",
  location: "[LOCATION]",
  email: "[YOUR EMAIL]",
  profile_photo_url: null,
  career_interests: [
    "Artificial Intelligence",
    "Machine Learning Engineering",
    "Deep Learning & Computer Vision",
    "Generative AI & LLMs",
    "Full Stack Web Development"
  ],
  technical_interests: [
    "Neural Network Optimization",
    "Autonomous Agents & RAG",
    "Distributed Model Training",
    "API Design & Cloud Architecture",
    "Real-time Computer Vision Pipelines"
  ],
  github_username: "[GITHUB USERNAME]",
  linkedin_url: "https://linkedin.com/in/[LINKEDIN URL]",
  resume_url: null
};

export const initialSkills: Skill[] = [
  // Programming
  { id: "s-1", name: "Python", category: "Programming", icon_name: "Code2", proficiency_level: "Advanced", order_index: 1 },
  { id: "s-2", name: "Java", category: "Programming", icon_name: "Coffee", proficiency_level: "Intermediate", order_index: 2 },
  { id: "s-3", name: "C", category: "Programming", icon_name: "Cpu", proficiency_level: "Intermediate", order_index: 3 },
  { id: "s-4", name: "JavaScript", category: "Programming", icon_name: "FileCode2", proficiency_level: "Advanced", order_index: 4 },

  // Web Development
  { id: "s-5", name: "HTML", category: "Web Development", icon_name: "Globe", proficiency_level: "Advanced", order_index: 5 },
  { id: "s-6", name: "CSS", category: "Web Development", icon_name: "Palette", proficiency_level: "Advanced", order_index: 6 },
  { id: "s-7", name: "React", category: "Web Development", icon_name: "Atom", proficiency_level: "Advanced", order_index: 7 },
  { id: "s-8", name: "Next.js", category: "Web Development", icon_name: "Layers", proficiency_level: "Advanced", order_index: 8 },
  { id: "s-9", name: "Tailwind CSS", category: "Web Development", icon_name: "Wind", proficiency_level: "Advanced", order_index: 9 },

  // AI & Machine Learning
  { id: "s-10", name: "Machine Learning", category: "AI & Machine Learning", icon_name: "BrainCircuit", proficiency_level: "Advanced", order_index: 10 },
  { id: "s-11", name: "Deep Learning", category: "AI & Machine Learning", icon_name: "Network", proficiency_level: "Advanced", order_index: 11 },
  { id: "s-12", name: "NLP", category: "AI & Machine Learning", icon_name: "Sparkles", proficiency_level: "Intermediate", order_index: 12 },
  { id: "s-13", name: "Generative AI", category: "AI & Machine Learning", icon_name: "Bot", proficiency_level: "Advanced", order_index: 13 },
  { id: "s-14", name: "Computer Vision", category: "AI & Machine Learning", icon_name: "Eye", proficiency_level: "Intermediate", order_index: 14 },

  // Database
  { id: "s-15", name: "SQL", category: "Database", icon_name: "Database", proficiency_level: "Advanced", order_index: 15 },
  { id: "s-16", name: "MySQL", category: "Database", icon_name: "Server", proficiency_level: "Advanced", order_index: 16 },
  { id: "s-17", name: "MongoDB", category: "Database", icon_name: "HardDrive", proficiency_level: "Intermediate", order_index: 17 },

  // Tools
  { id: "s-18", name: "Git", category: "Tools", icon_name: "GitBranch", proficiency_level: "Advanced", order_index: 18 },
  { id: "s-19", name: "GitHub", category: "Tools", icon_name: "Github", proficiency_level: "Advanced", order_index: 19 },
  { id: "s-20", name: "VS Code", category: "Tools", icon_name: "Terminal", proficiency_level: "Expert", order_index: 20 },
  { id: "s-21", name: "Power BI", category: "Tools", icon_name: "BarChart3", proficiency_level: "Intermediate", order_index: 21 },
];

export const initialProjects: Project[] = [
  {
    id: "p-1",
    title: "Autonomous Medical Vision & Diagnostic Classifier",
    short_description: "Deep learning convolutional neural network pipeline for multi-label thoracic disease diagnosis from digital chest X-rays with Grad-CAM visual heatmaps.",
    detailed_description: "Developed an end-to-end medical image classification pipeline using DenseNet121 and ResNet-50 transfer learning. Integrated Grad-CAM explainability heatmaps to highlight anatomical regions contributing to predictions, increasing clinician interpretability and trust. Built an interactive inference interface with FastAPI and Next.js.",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    technologies: ["Python", "PyTorch", "OpenCV", "FastAPI", "React", "Docker"],
    category: "AI/ML",
    features: [
      "Multi-label classification of 14 thoracic pathologies with 92.4% AUROC",
      "Grad-CAM visual explanation overlay for transparent radiological insights",
      "Sub-200ms latency inference API with ONNX runtime acceleration",
      "HIPAA-conscious data processing pipeline with automated anonymization"
    ],
    github_url: "https://github.com/[GITHUB USERNAME]/medical-vision-classifier",
    live_demo_url: "https://medical-vision-demo.vercel.app",
    date: "2024",
    is_featured: true,
    order_index: 1
  },
  {
    id: "p-2",
    title: "NeuroVoice: Real-Time Multimodal LLM Agent",
    short_description: "Zero-latency conversational voice agent leveraging streaming speech recognition, LangChain retrieval, and neural speech synthesis.",
    detailed_description: "Architected a full-duplex conversational voice application using WebRTC, OpenAI Whisper streaming, and Llama-3 with Retrieval-Augmented Generation (RAG). The system provides context-aware answers from enterprise knowledge documents with natural voice interruptions and emotional pacing.",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    technologies: ["Python", "Generative AI", "LangChain", "Next.js", "WebRTC", "ChromaDB"],
    category: "Generative AI",
    features: [
      "Ultra-low latency streaming voice input and real-time audio playback",
      "Vector embeddings search with hybrid semantic ranking in ChromaDB",
      "Dynamic interrupt-handling protocol via WebSockets and Web Audio API",
      "Role-specific prompt conditioning with robust guardrails"
    ],
    github_url: "https://github.com/[GITHUB USERNAME]/neurovoice-agent",
    live_demo_url: "https://neurovoice.vercel.app",
    date: "2024",
    is_featured: true,
    order_index: 2
  },
  {
    id: "p-3",
    title: "EdgeVision: Autonomous Lane & Object Detection",
    short_description: "Real-time edge computer vision pipeline for self-driving simulations, detecting road boundaries, pedestrians, and traffic signs at 45+ FPS.",
    detailed_description: "Implemented a hybrid lane detection and obstacle recognition system combining traditional perspective warping and edge filters with lightweight YOLOv8 object detection. Optimized using TensorRT for embedded microcomputers and edge deployment.",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80",
    technologies: ["Python", "Computer Vision", "YOLOv8", "OpenCV", "TensorRT"],
    category: "AI/ML",
    features: [
      "Real-time polynomial lane curvature estimation and lane departure warning",
      "YOLOv8 vehicle, cyclist, and pedestrian detection with 45+ FPS processing",
      "TensorRT FP16 quantization reducing model footprint by 65%",
      "Tested on CARLA simulator benchmark datasets across varied weather conditions"
    ],
    github_url: "https://github.com/[GITHUB USERNAME]/edgevision-autonomous",
    live_demo_url: "",
    date: "2024",
    is_featured: true,
    order_index: 3
  },
  {
    id: "p-4",
    title: "Algorithmic Market Anomaly & Fraud Detection Engine",
    short_description: "High-throughput streaming analytics platform detecting fraudulent transactions using Isolation Forests, XGBoost, and Graph Neural Networks.",
    detailed_description: "Constructed an anomaly detection pipeline capable of evaluating thousands of synthetic payment transactions per second. Evaluates both tabular transaction attributes and graph-based wallet relationship networks to detect fraud rings with high precision.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    technologies: ["Python", "Data Science", "Scikit-Learn", "XGBoost", "FastAPI", "PostgreSQL"],
    category: "Data Science",
    features: [
      "Ensemble scoring combining Isolation Forest and tuned XGBoost classifiers",
      "Sub-50ms transaction risk evaluation with automated flag thresholds",
      "Interactive analytics dashboard built with React and Tailwind CSS",
      "Synthetic transaction generator generating realistic fraud signatures"
    ],
    github_url: "https://github.com/[GITHUB USERNAME]/fraud-detection-engine",
    live_demo_url: "https://fraud-detection-demo.vercel.app",
    date: "2023",
    is_featured: false,
    order_index: 4
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: "c-1",
    title: "Deep Learning Specialization",
    issuing_organization: "DeepLearning.AI / Coursera",
    issue_date: "2024",
    credential_id: "DL-SPEC-982143",
    certificate_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    verification_url: "https://coursera.org/verify/specialization/EXAMPLE",
    description: "Mastered foundational deep learning: Convolutional Neural Networks, Sequence Models, Hyperparameter Tuning, Optimization Algorithms, and Structuring ML Projects.",
    skills: ["Deep Learning", "Neural Networks", "PyTorch", "TensorFlow", "Hyperparameter Tuning"],
    category: "AI/ML"
  },
  {
    id: "c-2",
    title: "Machine Learning Specialization",
    issuing_organization: "Stanford University & DeepLearning.AI",
    issue_date: "2023",
    credential_id: "ML-STANFORD-56291",
    certificate_image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    verification_url: "https://coursera.org/verify/EXAMPLE2",
    description: "Comprehensive study of supervised learning, decision trees, neural networks, unsupervised clustering, anomaly detection, and recommender systems.",
    skills: ["Machine Learning", "Supervised Learning", "Scikit-Learn", "Clustering"],
    category: "AI/ML"
  },
  {
    id: "c-3",
    title: "AWS Certified Cloud Practitioner",
    issuing_organization: "Amazon Web Services",
    issue_date: "2024",
    credential_id: "AWS-CCP-8472910",
    certificate_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    verification_url: "https://aws.amazon.com/verification",
    description: "Validated fundamental cloud computing concepts, AWS security, core compute/storage/database services, and cloud architecture best practices.",
    skills: ["Cloud Computing", "AWS", "S3", "EC2", "IAM"],
    category: "Cloud"
  }
];

export const initialEducation: Education[] = [
  {
    id: "e-1",
    degree: "Bachelor of Technology (B.Tech)",
    institution: "[YOUR COLLEGE]",
    branch: "Artificial Intelligence & Machine Learning",
    start_year: "2023",
    end_year: "2027",
    grade: "CGPA: 8.8 / 10.0 (Current)",
    description: "Focused on core computer science foundations alongside specialized coursework in artificial intelligence, neural networks, computational statistics, and algorithm design.",
    coursework: [
      "Data Structures & Algorithms",
      "Machine Learning & Pattern Recognition",
      "Deep Learning Architectures",
      "Database Management Systems (DBMS)",
      "Design & Analysis of Algorithms",
      "Probability, Statistics & Linear Algebra",
      "Computer Networks & Operating Systems"
    ],
    achievements: [
      "Selected as Technical Core Team Member of College AI & Coding Society",
      "Consistently in Top 10% of Department Academic Standing",
      "Conducted student peer workshop on Python for Machine Learning"
    ],
    order_index: 1
  }
];

// Experience is strictly empty by default as required:
// "Never invent internships or work experience. If there is no experience, display: 'Currently seeking internship opportunities.'"
export const initialExperience: Experience[] = [];

export const initialAchievements: Achievement[] = [
  {
    id: "a-1",
    title: "1st Runner Up - National AI Hackathon",
    category: "Hackathon",
    organization: "National Innovation Challenge",
    date: "2024",
    description: "Built an intelligent assistive diagnostic system in 36 hours, evaluated by industry leaders across technical complexity, scalability, and impact.",
    link_url: "https://github.com/[GITHUB USERNAME]",
    order_index: 1
  },
  {
    id: "a-2",
    title: "Solved 350+ DSA & Algorithm Problems",
    category: "Coding",
    organization: "LeetCode & GeeksforGeeks",
    date: "2023 - Present",
    description: "Consistent problem solver focusing on graph theory, dynamic programming, binary search trees, and computational complexity.",
    link_url: "https://leetcode.com",
    order_index: 2
  },
  {
    id: "a-3",
    title: "Lead Organizer - Campus ML BootCamp",
    category: "Workshop",
    organization: "AI Student Chapter",
    date: "2024",
    description: "Mentored 120+ first and second-year undergraduate engineering students through hands-on Python, pandas, and scikit-learn coding sessions.",
    order_index: 3
  }
];

export const initialSocialLinks: SocialLink[] = [
  { id: "sl-1", platform: "GitHub", url: "https://github.com/[GITHUB USERNAME]", icon: "Github", is_active: true, order_index: 1 },
  { id: "sl-2", platform: "LinkedIn", url: "https://linkedin.com/in/[LINKEDIN URL]", icon: "Linkedin", is_active: true, order_index: 2 },
  { id: "sl-3", platform: "Email", url: "mailto:[YOUR EMAIL]", icon: "Mail", is_active: true, order_index: 3 }
];

export const initialSettings: PortfolioSettings = {
  github_username: "[GITHUB USERNAME]",
  site_title: "[YOUR NAME] | AI & Machine Learning Student | Developer",
  site_description: "Portfolio of [YOUR NAME], B.Tech AI & ML Student preparing for internships and placements. Explore cutting-edge AI/ML projects, skills, certifications, and technical experience.",
  keywords: ["AI Engineer", "Machine Learning", "Deep Learning", "B.Tech AIML", "Software Developer", "Student Portfolio", "Python", "Next.js"],
  allow_contact_form: true
};
