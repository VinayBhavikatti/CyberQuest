export const QUIZ_QUESTIONS = [
  {
    q: "What is 'phishing'?",
    options: [
      "A fishing sport",
      "A cyberattack using deceptive emails to steal credentials",
      "A type of network protocol",
      "A software bug"
    ],
    answer: 1,
    explanation: "Phishing uses fake emails/websites to trick users into revealing sensitive info."
  },
  {
    q: "Which of these is a strong password?",
    options: ["password123", "john1990", "Tr0ub4dor&3!", "qwerty"],
    answer: 2,
    explanation: "Strong passwords mix uppercase, lowercase, numbers, and symbols with length."
  },
  {
    q: "What does 'MFA' stand for?",
    options: [
      "Multi-Factor Authentication",
      "Main Firewall Access",
      "Managed File Archive",
      "Master Frame Algorithm"
    ],
    answer: 0,
    explanation: "MFA adds extra verification layers beyond just a password."
  },
  {
    q: "What is social engineering?",
    options: [
      "Building social networks",
      "Manipulating people to reveal confidential info",
      "Writing social media code",
      "Engineering social apps"
    ],
    answer: 1,
    explanation: "Social engineering exploits human psychology rather than technical vulnerabilities."
  },
  {
    q: "What is a 'zero-day' vulnerability?",
    options: [
      "A bug fixed in zero days",
      "An unknown exploit with no available patch",
      "A virus from year 2000",
      "A firewall rule"
    ],
    answer: 1,
    explanation: "Zero-days are unknown vulnerabilities that attackers exploit before patches exist."
  },
  {
    q: "What does VPN stand for?",
    options: [
      "Virtual Private Network",
      "Verified Public Node",
      "Virtual Protocol Name",
      "Vendor Protection Network"
    ],
    answer: 0,
    explanation: "VPNs encrypt your internet traffic and mask your IP address."
  },
  {
    q: "What is ransomware?",
    options: [
      "Software that deletes files",
      "Malware that encrypts files and demands payment",
      "A type of firewall",
      "Antivirus software"
    ],
    answer: 1,
    explanation: "Ransomware encrypts victim data and demands cryptocurrency for decryption keys."
  },
  {
    q: "Which is safest on public WiFi?",
    options: ["Online banking", "Using a VPN", "Sharing passwords", "Disabling firewall"],
    answer: 1,
    explanation: "Public WiFi is unsecured; a VPN encrypts your connection protecting your data."
  }
];

export const ESCAPE_ROOM_PUZZLES = [
  {
    id: 1,
    title: "Decode the Caesar Cipher",
    desc: "The hacker left a message: 'KHOOR ZRUOG'. Decode it (Caesar +3 shift).",
    hint: "Shift each letter back by 3 positions in the alphabet.",
    answer: "HELLO WORLD",
    icon: "🔐"
  },
  {
    id: 2,
    title: "Find the Phishing URL",
    desc: "Which URL is legitimate?\nA) https://paypa1.com/login\nB) https://paypal.com/login\nC) https://paypal.secure-login.xyz",
    hint: "Look for subtle character swaps and extra domains.",
    answer: "B",
    icon: "🌐"
  },
  {
    id: 3,
    title: "Binary to Text",
    desc: "Decode: 01001000 01001001",
    hint: "Each 8-bit group is one ASCII character. H=72, I=73.",
    answer: "HI",
    icon: "💻"
  },
  {
    id: 4,
    title: "Spot the Vulnerability",
    desc: "SELECT * FROM users WHERE username='$user' AND password='$pass'\n\nWhat attack does this code enable?",
    hint: "Think about injecting SQL commands through the input fields.",
    answer: "SQL INJECTION",
    icon: "🛡️"
  }
];

export const PASSWORD_CHECKS = [
  { label: "At least 12 characters", test: (p) => p.length >= 12 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character (!@#$...)", test: (p) => /[^a-zA-Z0-9]/.test(p) },
  { label: "No common patterns", test: (p) => !/(password|123|qwerty|abc)/i.test(p) }
];

export const ATTACK_SCENARIOS = [
  {
    id: 1,
    title: "Suspicious Email",
    icon: "📧",
    desc: "You receive: 'URGENT: Your bank account suspended! Click here immediately: http://b4nk-secure.ru/verify'",
    options: ["Click the link to verify", "Delete & report as phishing", "Reply asking for more info", "Forward to colleagues"],
    correct: 1,
    explanation: "This is a phishing email. Suspicious domain, urgency tactics, and suspicious URL are all red flags."
  },
  {
    id: 2,
    title: "Unknown USB Drive",
    icon: "💾",
    desc: "You find a USB drive labeled 'PAYROLL 2024' in the parking lot. What do you do?",
    options: ["Plug it in to see contents", "Give it to IT security immediately", "Plug it in a personal device", "Ignore it"],
    correct: 1,
    explanation: "Unknown USB drives may contain malware. Always hand them to IT — this is a known attack vector."
  },
  {
    id: 3,
    title: "Software Update Popup",
    icon: "⚠️",
    desc: "A popup says 'Critical security update required! Download now from: FlashUpdate.net'",
    options: ["Download immediately", "Close and update via official settings", "Ignore forever", "Share with team"],
    correct: 1,
    explanation: "Always update software through official channels. Fake update prompts deliver malware."
  },
  {
    id: 4,
    title: "Phone Call",
    icon: "📞",
    desc: "'Hi, I'm from Microsoft support. Your computer has a virus. Give me remote access to fix it.'",
    options: ["Give remote access", "Hang up immediately", "Give your password", "Pay the fee they request"],
    correct: 1,
    explanation: "Microsoft never calls unsolicited. This is a tech support scam — hang up immediately."
  }
];

export const RESOURCES = [
  {
    title: "NIST Cybersecurity Framework",
    desc: "Official guidelines for managing cybersecurity risk.",
    url: "https://www.nist.gov/cyberframework",
    icon: "📋",
    tag: "Framework"
  },
  {
    title: "Have I Been Pwned",
    desc: "Check if your email was in a data breach.",
    url: "https://haveibeenpwned.com",
    icon: "🔍",
    tag: "Tool"
  },
  {
    title: "OWASP Top 10",
    desc: "Top 10 web application security risks.",
    url: "https://owasp.org/www-project-top-ten/",
    icon: "🌐",
    tag: "Guide"
  },
  {
    title: "Cybersecurity & Infrastructure Security Agency",
    desc: "US government cybersecurity resources and alerts.",
    url: "https://www.cisa.gov",
    icon: "🏛️",
    tag: "Official"
  },
  {
    title: "Password Manager Guide",
    desc: "Why and how to use a password manager.",
    url: "https://www.pcmag.com/picks/the-best-password-managers",
    icon: "🔑",
    tag: "Guide"
  },
  {
    title: "Two-Factor Auth Directory",
    desc: "Find which sites support 2FA.",
    url: "https://2fa.directory",
    icon: "🛡️",
    tag: "Tool"
  }
];

export const HACK_CHALLENGES = [
  {
    id: 1,
    title: "Hash Cracker",
    icon: "🔓",
    desc: "The hash MD5('sun') = 'dbc2b4e61a98e3e6b75d2de8d97b3c07'. What common word produces MD5 = '5f4dcc3b5aa765d61d8327deb882cf99'?",
    answer: "PASSWORD",
    hint: "It's the most common, most insecure password in existence."
  },
  {
    id: 2,
    title: "Port Scan Reading",
    desc: "Open ports found: 22, 80, 443, 3306. Which service is MOST dangerous if exposed publicly?",
    answer: "3306",
    hint: "3306 is MySQL database port — never expose databases directly to the internet.",
    icon: "🌐"
  },
  {
    id: 3,
    title: "Log Analysis",
    desc: "Login attempts: admin/wrong(x50), root/wrong(x50), user/wrong(x50) — all from 192.168.1.100 in 60 seconds. What attack is this?",
    answer: "BRUTE FORCE",
    hint: "Many failed login attempts in rapid succession from one IP is the classic pattern.",
    icon: "📊"
  }
];

export const MODULES = [
  { id: "quiz", label: "Security Quiz", icon: "🧠", color: "#7c3aed", desc: "Test social engineering knowledge" },
  { id: "escape", label: "Cyber Escape Room", icon: "🔐", color: "#00d4ff", desc: "Solve puzzles to escape" },
  { id: "password", label: "Master Passwords", icon: "🔑", color: "#10b981", desc: "Create & evaluate passwords" },
  { id: "attack", label: "Attack Simulator", icon: "⚡", color: "#f59e0b", desc: "Respond to live threats" },
  { id: "hack", label: "Hack The Hacker", icon: "🕵️", color: "#ef4444", desc: "Analyze & decrypt" },
  { id: "resources", label: "Security Resources", icon: "📚", color: "#64748b", desc: "Guides & tools" },
  { id: "threatmap", label: "Threat Map", icon: "🗺️", color: "#ff3b3b", desc: "Global breach activity — live simulation" },
  { id: "phishing", label: "Phishing Email Catcher", icon: "📧", color: "#f97316", desc: "Spot the phish" }
];

