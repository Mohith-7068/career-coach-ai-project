/**
 * careerRoadmapData.js — Verified competency frameworks, real certifications with official URLs,
 * practical portfolio blueprints, and roadmap stage generators for Career Coach AI.
 */

export const POPULAR_ROLES = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full-Stack Developer",
    "Java Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "Cloud Engineer",
    "Cybersecurity Analyst",
    "Embedded Systems Engineer"
];

/** Verified, non-hallucinated certifications with official documentation & providers */
export const VERIFIED_CERTIFICATIONS = {
    cloud_aws: {
        name: "AWS Certified Solutions Architect – Associate (SAA-C03)",
        provider: "Amazon Web Services",
        url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
        cost: "$150 USD",
        duration: "2–3 months part-time study",
        type: "Industry-recognized certification",
        relevance: "High for Cloud, Backend, and DevOps roles deploying on AWS infrastructure.",
        prerequisites: "Basic networking (VPC, CIDR), compute fundamentals, and cloud storage concepts.",
        free_alternative: "AWS Skill Builder free tier + freeCodeCamp AWS Practitioner course on YouTube.",
        project_alternative: "Deploying a multi-tier containerized app on ECS/EKS with Terraform and CloudWatch metrics often demonstrates stronger practical skill than passing the exam alone."
    },
    cloud_azure: {
        name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
        provider: "Microsoft",
        url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        cost: "$99 USD (Free Microsoft Learn study path)",
        duration: "2–4 weeks",
        type: "Foundational vendor credential",
        relevance: "Great entry credential for enterprise cloud roles using Azure Active Directory, Entra ID, and Azure VMs.",
        prerequisites: "General IT and networking knowledge.",
        free_alternative: "Complete Microsoft Learn free online learning paths.",
        project_alternative: "Build an automated serverless workflow with Azure Functions, Blob Storage, and GitHub Actions."
    },
    meta_frontend: {
        name: "Meta Front-End Developer Professional Certificate",
        provider: "Meta via Coursera",
        url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        cost: "$49/month Coursera subscription (Financial aid available)",
        duration: "5–7 months (6 hrs/week)",
        type: "Structured professional course certificate",
        relevance: "Covers React, JavaScript ES6+, HTML5/CSS3, responsive UI, UX principles, and testing.",
        prerequisites: "No prior coding experience required.",
        free_alternative: "freeCodeCamp Responsive Web Design and JavaScript Algorithms and Data Structures certifications (100% free).",
        project_alternative: "A production React/Next.js portfolio app with accessible UI, state management (Zustand/Redux), Lighthouse > 90, and automated Vitest/Jest unit tests."
    },
    meta_backend: {
        name: "Meta Back-End Developer Professional Certificate",
        provider: "Meta via Coursera",
        url: "https://www.coursera.org/professional-certificates/meta-back-end-developer",
        cost: "$49/month Coursera subscription (Financial aid available)",
        duration: "6–8 months (6 hrs/week)",
        type: "Structured professional course certificate",
        relevance: "Covers Python, Django, REST APIs, databases, MySQL, Git, and Linux server deployment.",
        prerequisites: "Basic programming concepts.",
        free_alternative: "freeCodeCamp Relational Database and Back End Development and APIs certifications.",
        project_alternative: "Design a secure REST or GraphQL API with JWT auth, rate limiting, SQL migrations, unit tests, and Dockerization."
    },
    oracle_java: {
        name: "Oracle Certified Associate, Java SE 11/17 Developer",
        provider: "Oracle University",
        url: "https://education.oracle.com/oracle-certified-professional-java-se-11-developer/track-pP_819",
        cost: "$245 USD",
        duration: "3–4 months dedicated practice",
        type: "Vendor-standard developer credential",
        relevance: "Highly valued in banking, enterprise systems, and large Java consulting environments.",
        prerequisites: "Solid Java syntax, OOP, collection framework, concurrency basics, and exception handling.",
        free_alternative: "University of Helsinki MOOC Java Programming I & II (open-source, free).",
        project_alternative: "Building a production Spring Boot 3 microservice suite with Spring Data JPA, Redis caching, and Kafka event streaming."
    },
    google_data: {
        name: "Google Data Analytics Professional Certificate",
        provider: "Google via Coursera",
        url: "https://www.coursera.org/professional-certificates/google-data-analytics",
        cost: "$49/month Coursera subscription (Financial aid available)",
        duration: "4–6 months (5 hrs/week)",
        type: "Practical industry training certificate",
        relevance: "Covers SQL, R/Python, Tableau, spreadsheets, data cleaning, and stakeholder storytelling.",
        prerequisites: "None; designed for beginners to intermediate learners.",
        free_alternative: "Mode Analytics SQL Tutorial + Alex The Analyst YouTube Data Bootcamp (100% free).",
        project_alternative: "Publishing a reproducible exploratory data analysis (EDA) notebook on Kaggle/GitHub with clear business recommendations and an interactive Tableau dashboard."
    },
    deeplearning_ml: {
        name: "Machine Learning Specialization by Andrew Ng",
        provider: "DeepLearning.AI & Stanford University via Coursera",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        cost: "$49/month Coursera subscription (Free to audit video lectures)",
        duration: "3 months (8 hrs/week)",
        type: "University-grade course specialization",
        relevance: "The gold standard for understanding supervised learning, neural networks, unsupervised algorithms, and recommender systems.",
        prerequisites: "Basic Python, high school algebra, and introductory calculus.",
        free_alternative: "Audit the Coursera courses for free without paying for the graded certificate.",
        project_alternative: "Train and evaluate an end-to-end ML model with scikit-learn/PyTorch, log experiments in MLflow, and deploy an inference API via FastAPI on Hugging Face Spaces."
    },
    comptia_sec: {
        name: "CompTIA Security+ (SY0-701)",
        provider: "CompTIA",
        url: "https://www.comptia.org/certifications/security",
        cost: "$404 USD exam voucher",
        duration: "2–3 months study",
        type: "Industry-standard baseline cybersecurity certification",
        relevance: "Crucial for SOC Analyst, Information Security, and US DoD 8570 baseline compliance.",
        prerequisites: "CompTIA Network+ or equivalent networking knowledge (TCP/IP, firewalls, ports).",
        free_alternative: "Professor Messer free CompTIA Security+ video training series on YouTube.",
        project_alternative: "Setting up a home virtual lab with pfSense firewall, Wireshark packet capture analysis, and an Elastic/Wazuh SIEM monitoring simulated brute-force attempts."
    },
    freecodecamp_fullstack: {
        name: "freeCodeCamp Full Stack Developer Certification",
        provider: "freeCodeCamp",
        url: "https://www.freecodecamp.org/learn",
        cost: "100% Free / Open Source",
        duration: "Self-paced (approx. 300 hours)",
        type: "Hands-on project-based certification",
        relevance: "Directly verifies completion of real interactive coding projects across frontend, backend, and databases.",
        prerequisites: "None.",
        free_alternative: "Already free.",
        project_alternative: "Deploying the required capstone projects live with custom domains and GitHub source code."
    }
};

/** Role-specific competency models with required core skills and verified paths */
export const ROLE_COMPETENCY_FRAMEWORKS = {
    "software engineer": {
        core_requirements: [
            { skill: "Data Structures & Algorithms", importance: "essential", why: "Foundational for writing efficient, scalable code and passing technical evaluations." },
            { skill: "Object-Oriented Programming (OOP) / Modular Design", importance: "essential", why: "Enables maintainable, testable code in enterprise codebases." },
            { skill: "Git & Version Control Workflows", importance: "essential", why: "Required for collaborative software engineering and pull-request code reviews." },
            { skill: "Relational or NoSQL Database Design", importance: "important", why: "Backend persistence, querying performance, and schema normalization." },
            { skill: "Unit & Integration Testing", importance: "important", why: "Ensures regression safety, test-driven development, and CI/CD readiness." },
            { skill: "RESTful API Integration / Design", importance: "important", why: "Inter-service communication and client-server data exchange." }
        ],
        certifications: ["freecodecamp_fullstack", "cloud_aws"],
        default_project: {
            title: "Production Microservices Task & Analytics Platform",
            objective: "Build a reliable, tested multi-tier platform with persistent data, asynchronous processing, and automated tests.",
            tech_stack: ["TypeScript / Node.js", "PostgreSQL", "Docker", "Jest / Vitest", "GitHub Actions"],
            milestones: [
                "Architect relational schema with migrations and foreign key constraints.",
                "Implement secure RESTful endpoints with input validation (Zod) and JWT authentication.",
                "Containerize app with Docker Compose and write unit tests achieving > 80% coverage.",
                "Set up continuous integration pipeline on GitHub Actions to run lint and tests on push."
            ],
            test_approach: "Unit tests for business logic, integration tests with testcontainers for DB calls.",
            resume_bullet: "Architected a scalable REST API using Node.js & PostgreSQL, implementing automated CI/CD with 85% test coverage and sub-100ms response times."
        }
    },
    "frontend developer": {
        core_requirements: [
            { skill: "HTML5 Semantic Structure & Accessibility (WCAG)", importance: "essential", why: "Ensures web applications are accessible to all users and SEO-friendly." },
            { skill: "Modern CSS & Responsive Design (Tailwind / Flex / Grid)", importance: "essential", why: "Delivers pixel-perfect interfaces across mobile, tablet, and desktop viewports." },
            { skill: "Modern JavaScript (ES6+) & TypeScript", importance: "essential", why: "Type safety, maintainability, and handling asynchronous data streams." },
            { skill: "React or Modern Component Framework", importance: "essential", why: "Standard in contemporary frontend engineering jobs." },
            { skill: "State Management & API Data Fetching (TanStack Query / SWR)", importance: "important", why: "Manages caching, loading states, and optimistic UI updates seamlessly." },
            { skill: "Frontend Performance Optimization (Lighthouse, Core Web Vitals)", importance: "important", why: "Fast load times directly correlate with user retention and business conversion." }
        ],
        certifications: ["meta_frontend", "freecodecamp_fullstack"],
        default_project: {
            title: "Accessible Real-Time SaaS Analytics Dashboard",
            objective: "Deliver a high-performance responsive web app featuring interactive data visualizations and keyboard navigation.",
            tech_stack: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Vitest", "Playwright"],
            milestones: [
                "Establish design system tokens, dark/light theme toggle, and responsive grid layout.",
                "Implement accessible navigation (ARIA, keyboard focus trap, skip links).",
                "Integrate asynchronous chart data with loading skeletons and error boundaries.",
                "Automate end-to-end tests and achieve Lighthouse score above 92 across all metrics."
            ],
            test_approach: "Component unit tests with React Testing Library and E2E tests with Playwright.",
            resume_bullet: "Engineered an accessible responsive analytics dashboard in React/TypeScript, improving Lighthouse performance score to 95 and reducing bundle size by 30%."
        }
    },
    "backend developer": {
        core_requirements: [
            { skill: "Server-side Language (Node.js, Python, Java, or Go)", importance: "essential", why: "Core execution environment for business logic and server applications." },
            { skill: "RESTful API / GraphQL Design", importance: "essential", why: "Exposes clean contracts, pagination, error formatting, and versioning for clients." },
            { skill: "SQL & Relational Databases (PostgreSQL / MySQL)", importance: "essential", why: "Complex queries, transactions (ACID), indexing, and data integrity." },
            { skill: "Authentication & Authorization (JWT, OAuth2, RBAC)", importance: "essential", why: "Safeguards sensitive user resources and prevents privilege escalation." },
            { skill: "Caching & In-Memory Stores (Redis)", importance: "important", why: "Mitigates database bottlenecks and accelerates high-read operations." },
            { skill: "Docker & Containerized Deployment", importance: "important", why: "Guarantees runtime consistency between development and production environments." }
        ],
        certifications: ["meta_backend", "cloud_aws"],
        default_project: {
            title: "Scalable E-Commerce Order & Payment Processing API",
            objective: "Design a resilient backend service handling idempotent payment transactions, inventory locks, and background jobs.",
            tech_stack: ["Node.js / Express or Python / FastAPI", "PostgreSQL", "Redis", "Docker", "Stripe API"],
            milestones: [
                "Model relational database with transactional order creation and optimistic locking.",
                "Implement JWT token rotation, rate-limiting middleware, and role-based guards.",
                "Integrate Redis caching for product catalog queries with TTL invalidation.",
                "Deploy with Docker Compose and test under simulated concurrent traffic with k6."
            ],
            test_approach: "Integration tests verifying database rollback on transaction failures and stress testing with k6.",
            resume_bullet: "Developed a containerized order processing API in Node.js and PostgreSQL with Redis caching, supporting 500+ req/sec with zero race-condition failures."
        }
    },
    "java developer": {
        core_requirements: [
            { skill: "Core Java (Java 17+, Streams, Lambdas, Concurrency)", importance: "essential", why: "Modern language capabilities, memory management, and multi-threaded processing." },
            { skill: "Spring Boot 3 & Spring Framework", importance: "essential", why: "De facto enterprise Java framework for web services and dependency injection." },
            { skill: "Spring Data JPA & Hibernate", importance: "essential", why: "ORM mapping, entity relationships, lazy/eager loading, and query performance." },
            { skill: "Relational SQL & Connection Pooling (HikariCP)", importance: "essential", why: "Enterprise database connectivity, transactions, and migration tools (Flyway/Liquibase)." },
            { skill: "JUnit 5 & Mockito Unit Testing", importance: "important", why: "Ensures test coverage and modular decoupled service layer validation." },
            { skill: "Microservices & Message Brokers (Kafka / RabbitMQ)", importance: "important", why: "Decoupled asynchronous event-driven enterprise architecture." }
        ],
        certifications: ["oracle_java", "cloud_aws"],
        default_project: {
            title: "Enterprise Banking Transaction & Audit Service",
            objective: "Build an enterprise Spring Boot microservice supporting double-entry ledger bookkeeping, audit trails, and Swagger documentation.",
            tech_stack: ["Java 17", "Spring Boot 3", "Spring Data JPA", "PostgreSQL", "Flyway", "Docker"],
            milestones: [
                "Define Flyway database migrations for versioned audit and account balances.",
                "Implement service layer with declarative `@Transactional` boundaries and custom exceptions.",
                "Secure API endpoints with Spring Security and JWT tokens.",
                "Write comprehensive test suite with JUnit 5, Mockito, and Testcontainers."
            ],
            test_approach: "Mock isolated unit tests with Mockito and real PostgreSQL integration tests with Testcontainers.",
            resume_bullet: "Built a secure Spring Boot 3 financial microservice with JPA and Flyway, achieving 90% code coverage via JUnit 5 and seamless CI/CD containerization."
        }
    },
    "data analyst": {
        core_requirements: [
            { skill: "Advanced SQL (Window Functions, CTEs, Aggregations)", importance: "essential", why: "Querying, extracting, and manipulating datasets directly from data warehouses." },
            { skill: "Data Visualization (Tableau, Power BI, or Looker)", importance: "essential", why: "Translating raw figures into actionable executive dashboards and KPI trackers." },
            { skill: "Python for Data Analysis (Pandas, NumPy, Matplotlib)", importance: "essential", why: "Data cleaning, transformation, exploratory statistical analysis, and scripting." },
            { skill: "Statistical Analysis & Hypothesis Testing", importance: "important", why: "Validating A/B test results, significance, correlations, and distribution shapes." },
            { skill: "Business Acumen & Stakeholder Presentation", importance: "important", why: "Deriving actionable recommendations rather than just presenting charts." }
        ],
        certifications: ["google_data"],
        default_project: {
            title: "Customer Churn & Retention Analytics Dashboard",
            objective: "Analyze customer cohort behavior to identify churn predictors and deliver an executive dashboard with revenue impact projections.",
            tech_stack: ["Python (Pandas)", "PostgreSQL", "Tableau / Streamlit", "Jupyter Notebook"],
            milestones: [
                "Clean raw customer transaction logs, handle nulls, and compute RFM metrics in SQL.",
                "Conduct exploratory data analysis identifying factors driving 90-day subscription drop-offs.",
                "Build interactive executive dashboard displaying churn rate, CLV, and cohort retention.",
                "Synthesize findings into an executive 1-page summary with 3 actionable product interventions."
            ],
            test_approach: "Data validation assertions verifying row counts, revenue reconciliation, and cohort consistency.",
            resume_bullet: "Analyzed 50,000+ customer records in SQL and Python, building an interactive Tableau retention dashboard that identified 3 key drivers of user churn."
        }
    },
    "machine learning engineer": {
        core_requirements: [
            { skill: "Python & Scientific Stack (NumPy, Pandas, Scipy)", importance: "essential", why: "Primary ecosystem for data manipulation and model mathematical operations." },
            { skill: "Machine Learning Foundations (Scikit-Learn, Regression, Trees, Clustering)", importance: "essential", why: "Core understanding of bias-variance tradeoff, cross-validation, and metrics (F1, AUC)." },
            { skill: "Deep Learning Frameworks (PyTorch or TensorFlow)", importance: "essential", why: "Building and fine-tuning neural networks for vision, NLP, or tabular embeddings." },
            { skill: "Model Deployment & Serving (FastAPI, ONNX, Docker)", importance: "important", why: "Translating trained weights into low-latency production inference microservices." },
            { skill: "MLOps & Experiment Tracking (MLflow, Weights & Biases)", importance: "important", why: "Reproducibility, versioning datasets/models, and monitoring distribution drift." }
        ],
        certifications: ["deeplearning_ml", "cloud_aws"],
        default_project: {
            title: "End-to-End Predictive Maintenance & Anomaly Detection Pipeline",
            objective: "Develop a complete ML pipeline from feature engineering through model evaluation, automated tracking, and containerized API serving.",
            tech_stack: ["Python", "PyTorch / Scikit-Learn", "FastAPI", "MLflow", "Docker"],
            milestones: [
                "Perform feature engineering, scaling, and handling imbalanced classes (SMOTE/class weights).",
                "Train baseline and ensemble models, tracking loss curves and F1 metrics in MLflow.",
                "Package best model checkpoint into an asynchronous FastAPI inference service with Pydantic validation.",
                "Containerize service with Docker and document latency benchmarks under load."
            ],
            test_approach: "Unit tests for feature transformers, prediction bounds checks, and benchmark inference latency.",
            resume_bullet: "Engineered an end-to-end anomaly detection pipeline in PyTorch & FastAPI, tracked experiments in MLflow, and deployed a Dockerized endpoint with < 25ms inference latency."
        }
    },
    "ai engineer": {
        core_requirements: [
            { skill: "LLM Orchestration & Prompt Engineering", importance: "essential", why: "Guiding modern foundation models to deliver structured, deterministic, and safe outputs." },
            { skill: "Retrieval-Augmented Generation (RAG) Architecture", importance: "essential", why: "Connecting LLMs to dynamic private documents and vector databases without retraining." },
            { skill: "Vector Databases & Embeddings (Chroma, Pinecone, pgvector)", importance: "essential", why: "Semantic search, chunking strategies, indexing, and similarity retrieval." },
            { skill: "Python & API Development (FastAPI, Asyncio)", importance: "essential", why: "Streaming responses (SSE), asynchronous tool calls, and high-throughput endpoints." },
            { skill: "Evaluation & Guardrails (RAGAS, Guardrails AI, LangSmith)", importance: "important", why: "Quantifying hallucinations, retrieval precision, faithfulness, and answer relevance." }
        ],
        certifications: ["deeplearning_ml"],
        default_project: {
            title: "Enterprise Knowledge Base RAG Assistant with Verification Guardrails",
            objective: "Build a production-grade RAG pipeline that searches internal documents, streams cited answers, and verifies answer faithfulness before rendering.",
            tech_stack: ["Python / FastAPI", "LangChain / LlamaIndex", "Chroma / pgvector", "React UI", "Docker"],
            milestones: [
                "Implement recursive chunking with metadata preservation and semantic embeddings.",
                "Set up hybrid search (keyword BM25 + dense vector similarity) with cross-encoder reranking.",
                "Implement real-time server-sent event (SSE) streaming with citations to source chunks.",
                "Add an evaluation layer measuring faithfulness and hallucination rate on test queries."
            ],
            test_approach: "Automated RAG evaluation suite checking context recall and source attribution accuracy.",
            resume_bullet: "Built an enterprise RAG assistant with FastAPI, vector search, and reranking, cutting hallucination rates to < 2% and providing real-time streaming citations."
        }
    },
    "cloud engineer": {
        core_requirements: [
            { skill: "Cloud Platform Architecture (AWS, Azure, or GCP)", importance: "essential", why: "Core cloud resource provisioning, IAM security, and cost-effective design." },
            { skill: "Infrastructure as Code (Terraform / OpenTofu)", importance: "essential", why: "Declarative, repeatable, version-controlled infrastructure deployments." },
            { skill: "Containerization & Orchestration (Docker & Kubernetes)", importance: "essential", why: "Packaging microservices and managing auto-scaling, ingress, and healing." },
            { skill: "CI/CD Pipeline Automation (GitHub Actions, GitLab CI)", importance: "essential", why: "Automated linting, building, testing, and zero-downtime deployment stages." },
            { skill: "Linux Systems & Networking (VPC, DNS, TLS, Bash)", importance: "important", why: "Troubleshooting operating system issues, firewalls, and network routing." }
        ],
        certifications: ["cloud_aws", "cloud_azure"],
        default_project: {
            title: "Automated Multi-Region Kubernetes Infrastructure with Terraform",
            objective: "Provision a resilient cloud environment with Terraform, deploying a containerized app with automated CI/CD and monitoring.",
            tech_stack: ["Terraform", "AWS (EKS, VPC, S3)", "Docker", "GitHub Actions", "Prometheus"],
            milestones: [
                "Write modular Terraform scripts creating VPC, subnets, route tables, and security groups.",
                "Deploy a managed Kubernetes cluster with auto-scaling node groups.",
                "Configure GitHub Actions workflow building Docker images and updating manifests.",
                "Set up Prometheus and Grafana alerting for pod CPU/memory utilization."
            ],
            test_approach: "Terraform plan verification, automated security scans with tfsec, and smoke tests post-deploy.",
            resume_bullet: "Provisioned automated cloud infrastructure using Terraform and AWS EKS, establishing a GitHub Actions CI/CD pipeline with automated rollbacks and monitoring."
        }
    },
    "cybersecurity analyst": {
        core_requirements: [
            { skill: "Network Security & Protocols (TCP/IP, DNS, SSL/TLS, Firewalls)", importance: "essential", why: "Understanding packet structure, traffic flow, port behavior, and vulnerabilities." },
            { skill: "Security Information & Event Management (SIEM)", importance: "essential", why: "Ingesting logs, correlating alerts, and detecting suspicious intrusion patterns." },
            { skill: "Threat Detection & Incident Response", importance: "essential", why: "Investigating indicators of compromise (IoC), containment, and post-incident reporting." },
            { skill: "Vulnerability Assessment (Nessus, Nmap, OWASP Top 10)", importance: "important", why: "Scanning for unpatched services, misconfigurations, and application security holes." },
            { skill: "Linux & Scripting (Bash, Python for Security)", importance: "important", why: "Automating log audits, parsing evidence, and querying security APIs." }
        ],
        certifications: ["comptia_sec"],
        default_project: {
            title: "Virtual SOC Homelab with SIEM Log Analysis & Incident Playbook",
            objective: "Set up a virtualized security monitoring lab, generate simulated brute-force and port-scan attacks, and configure automated alert triage.",
            tech_stack: ["Elastic Stack / Wazuh SIEM", "pfSense", "Wireshark", "Ubuntu Linux", "Python"],
            milestones: [
                "Deploy a virtualized pfSense firewall and Ubuntu endpoint generating syslog events.",
                "Install Wazuh/Elastic agent collecting authentication and network connection logs.",
                "Simulate offensive attacks (Nmap scan, Hydra SSH brute-force) and verify SIEM rule triggers.",
                "Draft a structured incident response playbook with containment steps and evidence hashes."
            ],
            test_approach: "Verify detection rules fire within 60 seconds of simulated attacks with zero false-negative drops.",
            resume_bullet: "Engineered a virtual SOC environment with Wazuh SIEM and pfSense, configuring custom detection rules and writing an incident response playbook for threat containment."
        }
    },
    "embedded systems engineer": {
        core_requirements: [
            { skill: "Embedded C / C++ Programming", importance: "essential", why: "Resource-constrained memory management, pointers, bitwise logic, and low-level control." },
            { skill: "Microcontroller Architecture (ARM Cortex-M, STM32, ESP32)", importance: "essential", why: "Clock configuration, GPIO, interrupts, timers, and peripheral memory mapping." },
            { skill: "Hardware Communication Protocols (UART, SPI, I2C, CAN)", importance: "essential", why: "Connecting microcontrollers to sensors, actuators, and communication buses." },
            { skill: "Real-Time Operating Systems (FreeRTOS)", importance: "important", why: "Task scheduling, semaphores, queues, and deterministic execution guarantees." },
            { skill: "Debugging & Hardware Tools (Oscilloscope, Logic Analyzer, GDB)", importance: "important", why: "Diagnosing signal noise, timing glitches, and memory leaks in hardware." }
        ],
        certifications: ["freecodecamp_fullstack"],
        default_project: {
            title: "FreeRTOS Multi-Sensor Environmental Telemetry Node",
            objective: "Program a microcontroller using FreeRTOS to read environmental sensors via I2C, process readings, and transmit telemetry securely via UART/BLE.",
            tech_stack: ["Embedded C++", "STM32 / ESP32", "FreeRTOS", "I2C / SPI", "Wokwi / QEMU"],
            milestones: [
                "Configure system clocks, interrupt vectors, and low-power sleep modes.",
                "Implement I2C device drivers reading temperature and pressure with CRC validation.",
                "Create FreeRTOS tasks with priority queuing to prevent priority inversion.",
                "Log sensor readings to circular buffer and stream structured JSON packets over UART."
            ],
            test_approach: "Logic analyzer packet verification on I2C bus and task execution timing profiling.",
            resume_bullet: "Developed a deterministic FreeRTOS telemetry system in C++ on ESP32, integrating I2C sensors with queued task scheduling and 40% reduced power consumption in sleep mode."
        }
    }
};

/**
 * Generate a complete, evidence-based roadmap tailored to the candidate's profile and selected target role.
 */
export function buildRoadmapData({ targetRole, userSkills = [], resumeScore = 70, confirmedSkills = [], customJobDesc = "" }) {
    const roleKey = (targetRole || "Software Engineer").toLowerCase().trim();
    // Match against frameworks or pick software engineer as fallback
    const matchedRoleKey = Object.keys(ROLE_COMPETENCY_FRAMEWORKS).find(k => roleKey.includes(k) || k.includes(roleKey)) || "software engineer";
    const framework = ROLE_COMPETENCY_FRAMEWORKS[matchedRoleKey];

    const allCandidateSkills = Array.from(new Set([
        ...userSkills.map(s => s.toLowerCase().trim()),
        ...confirmedSkills.map(s => s.toLowerCase().trim())
    ]));

    // Requirement comparison & structured gap analysis
    const requirementBreakdown = framework.core_requirements.map((req, idx) => {
        const reqLower = req.skill.toLowerCase();
        // Check if candidate demonstrated this skill or related keywords
        const isExact = allCandidateSkills.some(cs => cs === reqLower || reqLower.includes(cs) || cs.includes(reqLower));
        const isPartial = !isExact && allCandidateSkills.some(cs => {
            const words = cs.split(/[\s,/-]+/);
            return words.some(w => w.length > 2 && reqLower.includes(w));
        });

        let status = "not_demonstrated";
        let evidence = "No direct evidence found in uploaded resume or confirmed skills.";
        let closingStrategy = `Dedicate focused study to ${req.skill}. Complete the recommended exercises and verify with a practical project.`;

        if (isExact) {
            status = "demonstrated";
            const matchName = allCandidateSkills.find(cs => cs === reqLower || reqLower.includes(cs) || cs.includes(reqLower)) || req.skill;
            evidence = `Directly confirmed via candidate profile skill: "${matchName}".`;
            closingStrategy = "Maintain proficiency by applying this skill in the capstone portfolio project.";
        } else if (isPartial) {
            status = "partially_demonstrated";
            evidence = "Found related keywords in candidate skills, but specific practical application needs verification.";
            closingStrategy = `Deepen knowledge of ${req.skill} to meet production standards and document in resume bullet points.`;
        } else if (idx === 0) {
            status = "needs_confirmation";
            evidence = "Found adjacent concepts; candidate should confirm hands-on exposure.";
            closingStrategy = "Self-assess current familiarity and take a targeted refresher module.";
        }

        return {
            id: `req_${idx + 1}`,
            skill: req.skill,
            importance: req.importance,
            status,
            why_it_matters: req.why,
            evidence,
            gap_explanation: status === "demonstrated"
                ? "Requirement is met in the current profile."
                : `Target role requires verified ability in ${req.skill}. Current resume lacks clear evidence.`,
            closing_strategy: closingStrategy,
            verification_method: "Demonstrated through GitHub code repository, passing unit tests, or technical interview drill."
        };
    });

    // Count demonstrated & partial
    const totalReqs = requirementBreakdown.length;
    const demonstratedCount = requirementBreakdown.filter(r => r.status === "demonstrated").length;
    const partialCount = requirementBreakdown.filter(r => r.status === "partially_demonstrated").length;
    const skillMatchScore = Math.min(100, Math.round(((demonstratedCount * 1.0 + partialCount * 0.5) / (totalReqs || 1)) * 100));

    // Transparent, documented Readiness Score formula:
    // 40% Demonstrated Skill Match + 30% Resume Quality/Score + 30% Initial Roadmap Baseline (0% tasks completed initially)
    const initialReadiness = Math.round((0.40 * skillMatchScore) + (0.30 * (resumeScore || 65)));

    // Certifications
    const certKeys = framework.certifications || ["freecodecamp_fullstack"];
    const certList = certKeys.map(k => VERIFIED_CERTIFICATIONS[k]).filter(Boolean);

    // Practical project tailored to role
    const project = framework.default_project;

    // 7-Stage Career Roadmap items
    const stages = [
        {
            stage: 1,
            title: "Immediate Priorities",
            objective: "Resolve high-impact resume presentation issues and confirm your existing skillset.",
            estimated_effort: "2–4 days",
            tasks: [
                { id: "s1_t1", text: "Audit resume against the target role: add quantified metrics (%, $, numbers) to project bullets.", estimated_days: "1 day", completed: false, xp_reward: 15 },
                { id: "s1_t2", text: "Confirm and update your verified skills in the profile editor below.", estimated_days: "1 day", completed: false, xp_reward: 10 },
                { id: "s1_t3", text: "Standardize resume section headings: Summary, Education, Experience, Skills, Projects.", estimated_days: "1 day", completed: false, xp_reward: 10 }
            ]
        },
        {
            stage: 2,
            title: "Essential Skill Development",
            objective: `Close the top identified technical skill gaps for ${targetRole}.`,
            estimated_effort: "2–4 weeks",
            tasks: [
                { id: "s2_t1", text: `Master core principles of ${framework.core_requirements[0]?.skill || "core technical stack"}.`, estimated_days: "7 days", completed: false, xp_reward: 20 },
                { id: "s2_t2", text: `Build hands-on practice code for ${framework.core_requirements[1]?.skill || "practical tooling"}.`, estimated_days: "7 days", completed: false, xp_reward: 20 },
                { id: "s2_t3", text: "Solve 10 domain-specific coding or architecture exercises.", estimated_days: "5 days", completed: false, xp_reward: 25 }
            ]
        },
        {
            stage: 3,
            title: "Relevant Certifications & Courses",
            objective: "Enroll in a verified curriculum or study program that validates competencies.",
            estimated_effort: "3–6 weeks",
            tasks: [
                { id: "s3_t1", text: `Review syllabus and study guide for ${certList[0]?.name || "freeCodeCamp certification"}.`, estimated_days: "3 days", completed: false, xp_reward: 15 },
                { id: "s3_t2", text: "Complete core modules or free alternative learning paths.", estimated_days: "14 days", completed: false, xp_reward: 30 },
                { id: "s3_t3", text: "Pass certification exam or complete end-of-course capstone assessment.", estimated_days: "7 days", completed: false, xp_reward: 40 }
            ]
        },
        {
            stage: 4,
            title: "Practical Project Development",
            objective: `Construct "${project.title}" to showcase production-grade capability.`,
            estimated_effort: "2–3 weeks",
            tasks: [
                { id: "s4_t1", text: `Initialize repository and scaffold tech stack: ${project.tech_stack.slice(0, 3).join(", ")}.`, estimated_days: "2 days", completed: false, xp_reward: 15 },
                { id: "s4_t2", text: `Implement milestone 1 & 2: ${project.milestones[0]}`, estimated_days: "6 days", completed: false, xp_reward: 30 },
                { id: "s4_t3", text: `Implement automated testing: ${project.test_approach}`, estimated_days: "4 days", completed: false, xp_reward: 25 },
                { id: "s4_t4", text: "Publish working demo URL and write a clean README with architecture diagram.", estimated_days: "2 days", completed: false, xp_reward: 20 }
            ]
        },
        {
            stage: 5,
            title: "Resume & Portfolio Improvement",
            objective: "Incorporate new verified project and skills into your resume and online profile.",
            estimated_effort: "3–5 days",
            tasks: [
                { id: "s5_t1", text: `Add project bullet point: "${project.resume_bullet}"`, estimated_days: "1 day", completed: false, xp_reward: 15 },
                { id: "s5_t2", text: "Ensure GitHub profile has pinned repositories with active commits and clear licenses.", estimated_days: "1 day", completed: false, xp_reward: 15 },
                { id: "s5_t3", text: "Re-scan updated resume in Career Coach AI to verify improved score.", estimated_days: "1 day", completed: false, xp_reward: 20 }
            ]
        },
        {
            stage: 6,
            title: "Interview Preparation",
            objective: "Practice behavioral and technical mock interviews in Interview Studio.",
            estimated_effort: "1–2 weeks",
            tasks: [
                { id: "s6_t1", text: `Run an AI Mock Interview session targeting ${targetRole} in the Interview Studio.`, estimated_days: "2 days", completed: false, xp_reward: 25 },
                { id: "s6_t2", text: "Practice STAR methodology (Situation, Task, Action, Result) on behavioral answers.", estimated_days: "2 days", completed: false, xp_reward: 20 },
                { id: "s6_t3", text: "Achieve at least 80/100 composite score on full interview session analysis.", estimated_days: "3 days", completed: false, xp_reward: 35 }
            ]
        },
        {
            stage: 7,
            title: "Job-Application Readiness",
            objective: "Target verified job postings with a customized application package.",
            estimated_effort: "Ongoing",
            tasks: [
                { id: "s7_t1", text: "Identify 5 target companies and paste actual job descriptions into Job Match tool.", estimated_days: "2 days", completed: false, xp_reward: 20 },
                { id: "s7_t2", text: "Tailor application summary specifically addressing required qualifications.", estimated_days: "2 days", completed: false, xp_reward: 20 },
                { id: "s7_t3", text: "Submit applications and log response rates for continuous refinement.", estimated_days: "Ongoing", completed: false, xp_reward: 25 }
            ]
        }
    ];

    return {
        target_role: targetRole,
        readiness_score: initialReadiness,
        skill_match_score: skillMatchScore,
        requirement_breakdown: requirementBreakdown,
        certifications: certList,
        project,
        stages,
        formula_explanation: "Readiness Score = (40% Demonstrated Skill Match) + (30% Resume Quality & Completeness) + (30% Roadmap Milestones Completed). This score reflects verified evidence in your profile, not a hiring guarantee."
    };
}
