/**
 * promptDecks.js — Categorized prompt dataset for Off-the-Cuff Speaking Practice.
 * Approximately 150 curated prompts across 4 distinct categories.
 */

export const PROMPT_CATEGORIES = [
    {
        id: "behavioral",
        name: "Behavioral & Situational",
        icon: "💼",
        description: "High-stakes workplace scenarios, conflict resolution, and career situations."
    },
    {
        id: "technical_eli5",
        name: "Technical — Explain Like I'm 5",
        icon: "🧠",
        description: "Break down complex technical architecture into plain, crystal-clear analogies."
    },
    {
        id: "curveballs",
        name: "Curveballs & Icebreakers",
        icon: "🔥",
        description: "Unexpected, creative, and professional prompts to test mental agility."
    },
    {
        id: "leadership",
        name: "Leadership & Vision",
        icon: "👑",
        description: "Team dynamics, engineering culture, decision-making, and mentorship."
    }
];

export const PROMPT_DATASET = [
    // ─── 1. Behavioral & Situational (~40 prompts) ──────────────────────────────
    { id: "beh_001", category: "behavioral", difficulty: "medium", question: "How would you handle a teammate taking credit for your work in front of leadership?" },
    { id: "beh_002", category: "behavioral", difficulty: "easy", question: "Describe a time you had to deliver bad news to a stakeholder or manager." },
    { id: "beh_003", category: "behavioral", difficulty: "hard", question: "Tell me about a high-priority deadline you missed. What was the fallout and how did you recover?" },
    { id: "beh_004", category: "behavioral", difficulty: "medium", question: "How do you handle working with a cross-functional partner whose priorities conflict with yours?" },
    { id: "beh_005", category: "behavioral", difficulty: "easy", question: "Walk me through a situation where you had to adapt quickly to a major roadmap pivot." },
    { id: "beh_006", category: "behavioral", difficulty: "hard", question: "Describe a time you strongly disagreed with a senior engineer's architectural decision. What did you do?" },
    { id: "beh_007", category: "behavioral", difficulty: "medium", question: "How do you push back against unrealistic scope demands from product management?" },
    { id: "beh_008", category: "behavioral", difficulty: "easy", question: "Tell me about a project that failed. What was your biggest takeaway?" },
    { id: "beh_009", category: "behavioral", difficulty: "medium", question: "How do you rebuild trust with a client or team member after a critical mistake?" },
    { id: "beh_010", category: "behavioral", difficulty: "hard", question: "Describe a time you had to make a high-impact technical decision with incomplete information." },
    { id: "beh_011", category: "behavioral", difficulty: "easy", question: "Tell me about a time you went above and beyond your defined job responsibilities." },
    { id: "beh_012", category: "behavioral", difficulty: "medium", question: "How do you handle a teammate who is consistently underperforming on shared deliverables?" },
    { id: "beh_013", category: "behavioral", difficulty: "medium", question: "Describe an experience where you had to advocate for technical debt cleanup over new features." },
    { id: "beh_014", category: "behavioral", difficulty: "hard", question: "Tell me about a time you received harsh, critical feedback. How did you process and act on it?" },
    { id: "beh_015", category: "behavioral", difficulty: "easy", question: "What is your strategy for onboarding effectively into a massive, unfamiliar codebase?" },
    { id: "beh_016", category: "behavioral", difficulty: "medium", question: "How do you maintain focus and momentum when working on ambiguous, ill-defined tasks?" },
    { id: "beh_017", category: "behavioral", difficulty: "hard", question: "Tell me about a time you had to make a trade-off between code perfection and speed to market." },
    { id: "beh_018", category: "behavioral", difficulty: "easy", question: "Describe a time you helped resolve a tense interpersonal dispute inside your team." },
    { id: "beh_019", category: "behavioral", difficulty: "medium", question: "How do you ensure quiet or junior team members have their voices heard during planning sessions?" },
    { id: "beh_020", category: "behavioral", difficulty: "hard", question: "Tell me about a critical production bug you caused. How did you triage, fix, and post-mortem it?" },
    { id: "beh_021", category: "behavioral", difficulty: "medium", question: "How do you persuade stakeholders to adopt a tool or process change they are resistant to?" },
    { id: "beh_022", category: "behavioral", difficulty: "easy", question: "Describe a proud career achievement that is not reflected on your standard resume." },
    { id: "beh_023", category: "behavioral", difficulty: "medium", question: "How do you approach prioritizing your backlog when multiple stakeholders claim their ticket is urgent?" },
    { id: "beh_024", category: "behavioral", difficulty: "hard", question: "Tell me about a time you had to navigate organizational politics to get a project shipped." },
    { id: "beh_025", category: "behavioral", difficulty: "easy", question: "What is the most constructive piece of management feedback you ever gave your direct lead?" },
    { id: "beh_026", category: "behavioral", difficulty: "medium", question: "How do you stay calm and methodical when an incident bridge is chaotic and noisy?" },
    { id: "beh_027", category: "behavioral", difficulty: "hard", question: "Describe an occasion where you convinced a team to abandon a failing initiative early." },
    { id: "beh_028", category: "behavioral", difficulty: "easy", question: "Tell me about a time you mentored an intern or new hire to their first successful release." },
    { id: "beh_029", category: "behavioral", difficulty: "medium", question: "How do you manage burnout during intense shipping cycles or crunch periods?" },
    { id: "beh_030", category: "behavioral", difficulty: "medium", question: "Tell me about a time you identified a critical security or performance risk that others overlooked." },
    { id: "beh_031", category: "behavioral", difficulty: "easy", question: "What is your approach when a customer requests a feature that conflicts with your core roadmap?" },
    { id: "beh_032", category: "behavioral", difficulty: "hard", question: "Describe a situation where you had to deliver results with virtually zero executive support." },
    { id: "beh_033", category: "behavioral", difficulty: "medium", question: "How do you balance writing thorough automated tests with tight sprint velocity?" },
    { id: "beh_034", category: "behavioral", difficulty: "easy", question: "Tell me about a time you simplified an over-engineered process or architecture." },
    { id: "beh_035", category: "behavioral", difficulty: "hard", question: "What would you do if you realized a major company milestone was fundamentally unattainable on schedule?" },
    { id: "beh_036", category: "behavioral", difficulty: "medium", question: "Describe a time you had to step in and lead a project after the original lead left abruptly." },
    { id: "beh_037", category: "behavioral", difficulty: "easy", question: "How do you celebrate wins and foster morale when working remotely or asynchronously?" },
    { id: "beh_038", category: "behavioral", difficulty: "medium", question: "Tell me about an experiment you ran that disproved your own initial hypothesis." },

    // ─── 2. Technical — Explain Like I'm 5 (~40 prompts) ────────────────────────
    { id: "eli5_001", category: "technical_eli5", difficulty: "easy", question: "Explain what an API is using an analogy from everyday life." },
    { id: "eli5_002", category: "technical_eli5", difficulty: "easy", question: "Explain the concept of caching using a kitchen or restaurant metaphor." },
    { id: "eli5_003", category: "technical_eli5", difficulty: "medium", question: "Explain how public-key cryptography works without using mathematical formulas." },
    { id: "eli5_004", category: "technical_eli5", difficulty: "medium", question: "Explain what a database index is and why it speeds up queries." },
    { id: "eli5_005", category: "technical_eli5", difficulty: "easy", question: "Explain the difference between the internet and the World Wide Web to a child." },
    { id: "eli5_006", category: "technical_eli5", difficulty: "hard", question: "Explain how distributed consensus (like Raft or Paxos) works to someone with no computer science background." },
    { id: "eli5_007", category: "technical_eli5", difficulty: "medium", question: "Explain the difference between synchronous and asynchronous programming using a post office analogy." },
    { id: "eli5_008", category: "technical_eli5", difficulty: "easy", question: "Explain what a cookie is in web browsers and why websites use them." },
    { id: "eli5_009", category: "technical_eli5", difficulty: "medium", question: "Explain how DNS lookup works when you type a URL into your browser bar." },
    { id: "eli5_010", category: "technical_eli5", difficulty: "hard", question: "Explain what garbage collection in programming languages is and why memory leaks happen." },
    { id: "eli5_011", category: "technical_eli5", difficulty: "easy", question: "Explain what cloud computing actually is to your grandparent." },
    { id: "eli5_012", category: "technical_eli5", difficulty: "medium", question: "Explain the concept of load balancing using a busy airport security line." },
    { id: "eli5_013", category: "technical_eli5", difficulty: "medium", question: "Explain what a race condition is and why it causes intermittent software bugs." },
    { id: "eli5_014", category: "technical_eli5", difficulty: "hard", question: "Explain the CAP theorem in distributed systems using a simple real-world analogy." },
    { id: "eli5_015", category: "technical_eli5", difficulty: "easy", question: "Explain what Git version control is using a shared document or notebook analogy." },
    { id: "eli5_016", category: "technical_eli5", difficulty: "medium", question: "Explain the difference between SQL (relational) and NoSQL (document) databases." },
    { id: "eli5_017", category: "technical_eli5", difficulty: "hard", question: "Explain how neural networks learn patterns without using technical calculus jargon." },
    { id: "eli5_018", category: "technical_eli5", difficulty: "easy", question: "Explain what a firewall does using a bouncer at a club entrance." },
    { id: "eli5_019", category: "technical_eli5", difficulty: "medium", question: "Explain what microservices are versus a monolithic system using a toolbox or toy factory." },
    { id: "eli5_020", category: "technical_eli5", difficulty: "easy", question: "Explain how streaming video (like Netflix) buffers video data smoothly over a fluctuating connection." },
    { id: "eli5_021", category: "technical_eli5", difficulty: "medium", question: "Explain what Docker containers are using shipping cargo containers." },
    { id: "eli5_022", category: "technical_eli5", difficulty: "hard", question: "Explain what deadlocks are in multithreading using four cars arriving at a 4-way stop simultaneously." },
    { id: "eli5_023", category: "technical_eli5", difficulty: "medium", question: "Explain how password hashing and salting protect user credentials during a data leak." },
    { id: "eli5_024", category: "technical_eli5", difficulty: "easy", question: "Explain what open-source software is and why companies give code away for free." },
    { id: "eli5_025", category: "technical_eli5", difficulty: "medium", question: "Explain the concept of rate limiting on APIs and why services block too many rapid requests." },
    { id: "eli5_026", category: "technical_eli5", difficulty: "hard", question: "Explain how HTTPS establishes an encrypted tunnel between client and server." },
    { id: "eli5_027", category: "technical_eli5", difficulty: "easy", question: "Explain what an IP address is using home street postal addresses." },
    { id: "eli5_028", category: "technical_eli5", difficulty: "medium", question: "Explain the difference between authentication and authorization using hotel keycards." },
    { id: "eli5_029", category: "technical_eli5", difficulty: "medium", question: "Explain what WebSockets are and how they differ from standard HTTP requests." },
    { id: "eli5_030", category: "technical_eli5", difficulty: "hard", question: "Explain how database sharding works when a single machine runs out of storage capacity." },
    { id: "eli5_031", category: "technical_eli5", difficulty: "easy", question: "Explain what a VPN does and why someone would use it on public Wi-Fi." },
    { id: "eli5_032", category: "technical_eli5", difficulty: "medium", question: "Explain what technical debt is using financial credit card debt." },
    { id: "eli5_033", category: "technical_eli5", difficulty: "medium", question: "Explain how search engines index and rank billions of web pages in milliseconds." },
    { id: "eli5_034", category: "technical_eli5", difficulty: "hard", question: "Explain the concept of event sourcing and CQRS using a bank account ledger." },
    { id: "eli5_035", category: "technical_eli5", difficulty: "easy", question: "Explain what an algorithm is using a baking recipe." },
    { id: "eli5_036", category: "technical_eli5", difficulty: "medium", question: "Explain how CDN (Content Delivery Network) edge servers make global websites load faster." },
    { id: "eli5_037", category: "technical_eli5", difficulty: "easy", question: "Explain what unit testing is and why engineers write code to test other code." },
    { id: "eli5_038", category: "technical_eli5", difficulty: "hard", question: "Explain the trade-offs between vertical scaling and horizontal scaling." },

    // ─── 3. Curveballs & Icebreakers (~35 prompts) ──────────────────────────────
    { id: "crv_001", category: "curveballs", difficulty: "easy", question: "If you could permanently eliminate one common meeting type from the tech industry, which would it be and why?" },
    { id: "crv_002", category: "curveballs", difficulty: "medium", question: "What is an unconventional productivity rule or personal habit that has dramatically improved your output?" },
    { id: "crv_003", category: "curveballs", difficulty: "easy", question: "If you had an unlimited budget to solve any single customer friction point in software today, what would you tackle?" },
    { id: "crv_004", category: "curveballs", difficulty: "hard", question: "Defend a widely disliked programming language or framework. Why does it deserve more respect?" },
    { id: "crv_005", category: "curveballs", difficulty: "medium", question: "What is one commonly accepted piece of career advice that you believe is completely wrong?" },
    { id: "crv_006", category: "curveballs", difficulty: "easy", question: "If you had to teach a university seminar on any non-technical topic, what would your course be called?" },
    { id: "crv_007", category: "curveballs", difficulty: "medium", question: "How would you explain the value of your entire profession to someone living in the year 1850?" },
    { id: "crv_008", category: "curveballs", difficulty: "hard", question: "If you were tasked with building a product for users who have never used a smartphone, how would you design onboarding?" },
    { id: "crv_009", category: "curveballs", difficulty: "easy", question: "What is a piece of technology from 10 years ago that you genuinely miss using?" },
    { id: "crv_010", category: "curveballs", difficulty: "medium", question: "Tell me about a hobby outside of work that has surprisingly made you a better professional." },
    { id: "crv_011", category: "curveballs", difficulty: "hard", question: "If AI automated 80% of routine coding tasks tomorrow, what core skills would differentiate elite engineers?" },
    { id: "crv_012", category: "curveballs", difficulty: "easy", question: "What is the single most underrated software tool in your daily toolkit?" },
    { id: "crv_013", category: "curveballs", difficulty: "medium", question: "How do you know when a piece of software is 'done enough' to ship to real users?" },
    { id: "crv_014", category: "curveballs", difficulty: "medium", question: "If you were founding a startup tomorrow with only two other people, what specific archetypes would you hire?" },
    { id: "crv_015", category: "curveballs", difficulty: "easy", question: "What is the most interesting technical rabbit hole you went down recently just for curiosity's sake?" },
    { id: "crv_016", category: "curveballs", difficulty: "hard", question: "Make the case for why remote asynchronous work will either dominate or decline over the next decade." },
    { id: "crv_017", category: "curveballs", difficulty: "medium", question: "What is a controversial opinion you hold regarding software code comments and documentation?" },
    { id: "crv_018", category: "curveballs", difficulty: "easy", question: "If your team was forced to operate with only 3 communication tools total, which three would you keep?" },
    { id: "crv_019", category: "curveballs", difficulty: "medium", question: "What does genuine craftsmanship look like in digital knowledge work?" },
    { id: "crv_020", category: "curveballs", difficulty: "hard", question: "How would you design a digital interviewing platform that eliminates unconscious human bias?" },
    { id: "crv_021", category: "curveballs", difficulty: "easy", question: "What is one habit that separates good communicators from truly great ones in technical discussions?" },
    { id: "crv_022", category: "curveballs", difficulty: "medium", question: "If you were given 30 days of paid sabbatical to learn any skill from scratch, what would it be?" },
    { id: "crv_023", category: "curveballs", difficulty: "hard", question: "Why do so many software rewrites fail, and when is a ground-up rewrite actually justified?" },
    { id: "crv_024", category: "curveballs", difficulty: "easy", question: "What is your philosophy on inbox zero versus structured notification management?" },
    { id: "crv_025", category: "curveballs", difficulty: "medium", question: "Describe the best manager you ever had in three words, and explain why you chose those words." },
    { id: "crv_026", category: "curveballs", difficulty: "medium", question: "What is the most elegant user interface you interact with on a weekly basis?" },
    { id: "crv_027", category: "curveballs", difficulty: "hard", question: "If you had to evaluate an engineering candidate in just 5 minutes, what single question would you ask?" },
    { id: "crv_028", category: "curveballs", difficulty: "easy", question: "What is a book or essay that fundamentally shifted how you approach your daily craft?" },
    { id: "crv_029", category: "curveballs", difficulty: "medium", question: "How do you distinguish between high-leverage work and mere productive procrastination?" },
    { id: "crv_030", category: "curveballs", difficulty: "easy", question: "What advice would you give your first-year self starting out in this industry?" },
    { id: "crv_031", category: "curveballs", difficulty: "hard", question: "What is a business or design trend in modern tech products that you think will age terribly?" },
    { id: "crv_032", category: "curveballs", difficulty: "medium", question: "How do you stay intellectually curious when repetitive sprint cycles feel monotonous?" },
    { id: "crv_033", category: "curveballs", difficulty: "easy", question: "What is your favorite mental model for making difficult decisions under pressure?" },
    { id: "crv_034", category: "curveballs", difficulty: "medium", question: "If you had to build a personal board of advisors, who is one person you would invite?" },

    // ─── 4. Leadership & Vision (~35 prompts) ──────────────────────────────────
    { id: "ldr_001", category: "leadership", difficulty: "medium", question: "What does high-trust engineering culture look like in day-to-day practice?" },
    { id: "ldr_002", category: "leadership", difficulty: "hard", question: "How do you coach a brilliant individual contributor who has toxic communication habits?" },
    { id: "ldr_003", category: "leadership", difficulty: "easy", question: "What is the difference between true leadership and mere management title authority?" },
    { id: "ldr_004", category: "leadership", difficulty: "medium", question: "How do you align a team around a shared vision when individual goals diverge?" },
    { id: "ldr_005", category: "leadership", difficulty: "hard", question: "How do you balance bottom-up developer autonomy with top-down strategic alignment?" },
    { id: "ldr_006", category: "leadership", difficulty: "medium", question: "Describe your framework for conducting high-impact, empathetic 1-on-1 meetings." },
    { id: "ldr_007", category: "leadership", difficulty: "easy", question: "How do you foster psychological safety so teammates admit mistakes without fear?" },
    { id: "ldr_008", category: "leadership", difficulty: "hard", question: "How do you navigate laying off or letting go of team members while maintaining organizational integrity?" },
    { id: "ldr_009", category: "leadership", difficulty: "medium", question: "What is your strategy for delegating critical outcomes without micromanaging the execution?" },
    { id: "ldr_010", category: "leadership", difficulty: "easy", question: "How do you recognize and reward quiet, foundational glue work that doesn't make splashy demos?" },
    { id: "ldr_011", category: "leadership", difficulty: "medium", question: "How do you maintain high engineering standards without becoming a bottleneck in code review?" },
    { id: "ldr_012", category: "leadership", difficulty: "hard", question: "Describe how you would establish technical strategy across multiple autonomous squads." },
    { id: "ldr_013", category: "leadership", difficulty: "medium", question: "What is your philosophy on transparent salary, performance, and leveling rubrics?" },
    { id: "ldr_014", category: "leadership", difficulty: "easy", question: "How do you support a teammate who is dealing with severe personal challenges outside work?" },
    { id: "ldr_015", category: "leadership", difficulty: "hard", question: "How do you maintain team velocity and high spirits after a major product launch flops?" },
    { id: "ldr_016", category: "leadership", difficulty: "medium", question: "What makes an engineering post-mortem genuinely blameless versus performative?" },
    { id: "ldr_017", category: "leadership", difficulty: "medium", question: "How do you mentor mid-level engineers to think in terms of business impact rather than just code?" },
    { id: "ldr_018", category: "leadership", difficulty: "easy", question: "How do you cultivate cross-team empathy between engineering, product, and design?" },
    { id: "ldr_019", category: "leadership", difficulty: "hard", question: "What is your approach to resolving deadlock when two staff engineers propose diametrically opposed architectures?" },
    { id: "ldr_020", category: "leadership", difficulty: "medium", question: "How do you protect your team from executive thrash and sudden priority whiplash?" },
    { id: "ldr_021", category: "leadership", difficulty: "easy", question: "What is the most impactful way a team can invest in continuous professional development?" },
    { id: "ldr_022", category: "leadership", difficulty: "medium", question: "How do you know when it's time to split a monolithic team into focused sub-squads?" },
    { id: "ldr_023", category: "leadership", difficulty: "hard", question: "How do you lead through an acquisition or massive executive reorganization?" },
    { id: "ldr_024", category: "leadership", difficulty: "easy", question: "What role does vulnerability play in modern technical leadership?" },
    { id: "ldr_025", category: "leadership", difficulty: "medium", question: "How do you run effective, inclusive technical design review sessions?" },
    { id: "ldr_026", category: "leadership", difficulty: "hard", question: "What is your framework for saying 'no' to valuable ideas in order to focus on vital few priorities?" },
    { id: "ldr_027", category: "leadership", difficulty: "medium", question: "How do you encourage junior developers to take calculated risks and explore novel ideas?" },
    { id: "ldr_028", category: "leadership", difficulty: "easy", question: "What is the hallmark of a resilient, self-healing team?" },
    { id: "ldr_029", category: "leadership", difficulty: "medium", question: "How do you ensure documentation and institutional knowledge don't decay over time?" },
    { id: "ldr_030", category: "leadership", difficulty: "hard", question: "Describe how you evaluate whether a team has healthy developer velocity versus superficial ticket churning." },
    { id: "ldr_031", category: "leadership", difficulty: "medium", question: "What is your philosophy on promoting from within versus hiring external senior leaders?" },
    { id: "ldr_032", category: "leadership", difficulty: "easy", question: "How do you establish clear expectations on code quality, testing, and operational readiness?" },
    { id: "ldr_033", category: "leadership", difficulty: "medium", question: "How do you help your team recover sustainable pace after a marathon release cycle?" }
];

/**
 * Returns prompts filtered by category id, or all prompts if category is 'all'.
 */
export function getPromptsByCategory(categoryId = "behavioral") {
    if (categoryId === "all") return PROMPT_DATASET;
    return PROMPT_DATASET.filter((p) => p.category === categoryId);
}

/**
 * Returns a random prompt from the given category, avoiding recently seen prompt IDs.
 */
export function getRandomPrompt(categoryId = "behavioral", excludeIds = []) {
    const candidates = getPromptsByCategory(categoryId);
    const filtered = candidates.filter((p) => !excludeIds.includes(p.id));
    const pool = filtered.length > 0 ? filtered : candidates;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || candidates[0];
}
