export type Lang = "pt" | "en";

export type StackCategory = {
  id: string;
  slug: string;
  label: string;
  items: readonly string[];
};

export type FocusArea = {
  tag: string;
  text: string;
};

export type Project = {
  hash: string;
  title: string;
  description: string;
  impact: string;
  stack: readonly string[];
};

export type NavLink = {
  href: string;
  label: string;
};

export type Content = {
  name: string;
  fullName: string;
  handle: string;
  role: string;
  location: string;
  footerLocation: string;
  experienceYears: string;
  bio: string;
  linkedin: string;
  github: string;
  linkedinHandle: string;
  githubHandle: string;
  stackCategories: readonly StackCategory[];
  focusAreas: readonly FocusArea[];
  projects: readonly Project[];
  navLinks: readonly NavLink[];
  ui: {
    experience: string;
    whoamiCommand: string;
    stacksHeading: string;
    stacksSubtitle: string;
    projectsHeading: string;
    projectsSubtitle: string;
    filesChanged: string;
    impactLabel: string;
    contactHeading: string;
    contactSubtitle: string;
    formName: string;
    formNamePlaceholder: string;
    formEmail: string;
    formEmailPlaceholder: string;
    formMessage: string;
    formMessagePlaceholder: string;
    formSubmit: string;
    formSubmitting: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    lightTheme: string;
    darkTheme: string;
  };
};

const stackCategoriesPt: readonly StackCategory[] = [
  {
    id: "languages",
    slug: "linguagens",
    label: "Linguagens",
    items: ["Python", "TypeScript", "JavaScript", "Java", "Go", "Ruby", "PHP", "Shell"],
  },
  {
    id: "engineering",
    slug: "engenhariaSoftware",
    label: "Engenharia de Software",
    items: [
      "Clean Architecture",
      "Design Patterns",
      "SOLID",
      "Clean Code",
      "Microsserviços",
      "Testes de Software",
    ],
  },
  {
    id: "dev",
    slug: "web",
    label: "Web",
    items: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "WordPress"],
  },
  {
    id: "database",
    slug: "bancoDeDados",
    label: "Banco de Dados",
    items: ["SQL", "T-SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Pinecone"],
  },
  {
    id: "data",
    slug: "dados",
    label: "Dados & Analytics",
    items: ["Data Engineering", "ETL Pipelines", "PySpark", "Databricks", "Kestra", "Logstash", "Power BI / Grafana"],
  },
  {
    id: "ai",
    slug: "ia",
    label: "IA",
    items: ["LangChain", "Agentes", "RAG", "LLMs & SLMs", "AWS Bedrock", "AWS SageMaker", "GCP Vertex AI", "Azure AI", "n8n"],
  },
  {
    id: "cloud",
    slug: "cloud",
    label: "Cloud",
    items: ["AWS", "GCP", "Azure", "Serverless", "Containers", "Secrets Manager", "Mensageria", "Cloud Run"],
  },
  {
    id: "devops",
    slug: "devops",
    label: "DevOps",
    items: ["Docker", "Kubernetes", "Terraform", "CI/CD", "Nginx", "Jenkins"],
  },
  {
    id: "security",
    slug: "seguranca",
    label: "Segurança",
    items: ["SAST/DAST", "Secure SDLC", "SonarQube", "Burp Suite", "Gestão de Vulnerabilidades"],
  },
  {
    id: "mobile",
    slug: "mobile",
    label: "Mobile",
    items: ["Android", "iOS"],
  },
] as const;

const stackCategoriesEn: readonly StackCategory[] = [
  {
    id: "languages",
    slug: "languages",
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "Go", "Ruby", "PHP", "Shell"],
  },
  {
    id: "engineering",
    slug: "softwareEngineering",
    label: "Software Engineering",
    items: [
      "Clean Architecture",
      "Design Patterns",
      "SOLID",
      "Clean Code",
      "Microservices",
      "Software Testing",
    ],
  },
  {
    id: "dev",
    slug: "web",
    label: "Web",
    items: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "WordPress"],
  },
  {
    id: "database",
    slug: "database",
    label: "Database",
    items: ["SQL", "T-SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Pinecone"],
  },
  {
    id: "data",
    slug: "data",
    label: "Data & Analytics",
    items: ["Data Engineering", "ETL Pipelines", "PySpark", "Databricks", "Kestra", "Logstash", "Power BI / Grafana"],
  },
  {
    id: "ai",
    slug: "ai",
    label: "AI",
    items: ["LangChain", "Agents", "RAG", "LLMs & SLMs", "AWS Bedrock", "AWS SageMaker", "GCP Vertex AI", "Azure AI", "n8n"],
  },
  {
    id: "cloud",
    slug: "cloud",
    label: "Cloud",
    items: ["AWS", "GCP", "Azure", "Serverless", "Containers", "Secrets Manager", "Messaging", "Cloud Run"],
  },
  {
    id: "devops",
    slug: "devops",
    label: "DevOps",
    items: ["Docker", "Kubernetes", "Terraform", "CI/CD", "Nginx", "Jenkins"],
  },
  {
    id: "security",
    slug: "security",
    label: "Security",
    items: ["SAST/DAST", "Secure SDLC", "SonarQube", "Burp Suite", "Vulnerability Management"],
  },
  {
    id: "mobile",
    slug: "mobile",
    label: "Mobile",
    items: ["Android", "iOS"],
  },
] as const;

const focusAreasPt: readonly FocusArea[] = [
  { tag: "DEV", text: "Desenvolvimento full-stack de aplicações e APIs escaláveis" },
  { tag: "ENG", text: "Engenharia de software: arquitetura, princípios, clean code e padrões de projeto" },
  { tag: "DEVOPS", text: "Infraestrutura como código e automação de deploys" },
  { tag: "AI", text: "Arquitetura e engenharia de agentes e sistemas com LLMs" },
  { tag: "DATA", text: "Pipelines de dados e integrações em ambientes cloud" },
  { tag: "SEC", text: "Segurança integrada ao ciclo de desenvolvimento" },
] as const;

const focusAreasEn: readonly FocusArea[] = [
  { tag: "DEV", text: "Full-stack development of applications and scalable APIs" },
  { tag: "ENG", text: "Software engineering: architecture, principles, clean code and design patterns" },
  { tag: "DEVOPS", text: "Infrastructure as code and deploy automation" },
  { tag: "AI", text: "Architecture and engineering of agents and LLM-based systems" },
  { tag: "DATA", text: "Data pipelines and integrations across cloud environments" },
  { tag: "SEC", text: "Security built into the development lifecycle" },
] as const;

const projectsPt: readonly Project[] = [
  {
    hash: "a3f9c21",
    title: "orquestração de agentes de IA generativa em produção",
    description:
      "Arquitetura e implementação de agentes e pipelines com LLMs e SLMs, da concepção à produção. Automação de fluxos, observabilidade e participação nas decisões de governança e adoção de IA em aplicações corporativas.",
    impact:
      "Acelerou a adoção de IA generativa na organização com observabilidade e governança desde o design, permitindo evoluir os sistemas com segurança.",
    stack: ["agents.py", "flows.json", "tracing.ts"],
  },
  {
    hash: "7d1e408",
    title: "RAG em tempo real para cobertura eleitoral",
    description:
      "Solução de IA generativa para as Eleições 2024: integração da API do TSE a um pipeline RAG que gera texto jornalístico em tempo real, combinando IA generativa e visão computacional no fluxo de produção.",
    impact:
      "Sustentou cobertura jornalística em tempo real durante um dos eventos de maior demanda do ano, sem depender de apuração manual.",
    stack: ["rag_pipeline.py", "tse_client.py"],
  },
  {
    hash: "c02b6a5",
    title: "Poder Monitor: rastreamento de repasses federais",
    description:
      "Desenvolvimento fullstack (backend, frontend, scrapers e RPA) do módulo que cruza emendas, repasses e indicadores públicos em múltiplas escalas geográficas, com apoio do Google News Initiative.",
    impact:
      "Deu transparência a repasses federais em escala nacional, sustentando jornalismo de dados de interesse público.",
    stack: ["monitor.tsx", "scraper.py", "api.ts"],
  },
  {
    hash: "4e6f8a2",
    title: "liderança técnica em automação de integrações ERP/CRM",
    description:
      "Automação via RPA e APIs integrando sistemas ERP/CRM, com arquiteturas serverless em AWS/GCP, Clean Code e SOLID, e SAST (SonarQube) integrado a pipelines de CI/CD com Jenkins.",
    impact:
      "Elevou a maturidade de segurança do time (SAST no pipeline) e a performance dos sistemas via otimização de bancos SQL/NoSQL, liderando do zero à entrega.",
    stack: ["integration.py", "rpa.java", "infra.tf"],
  },
] as const;

const projectsEn: readonly Project[] = [
  {
    hash: "a3f9c21",
    title: "generative AI agent orchestration in production",
    description:
      "Architecture and implementation of agents and pipelines with LLMs and SLMs, from design to production. Flow automation, observability and a seat in AI governance and adoption decisions for corporate applications.",
    impact:
      "Accelerated generative AI adoption across the organization with observability and governance built in from the design phase, letting the systems evolve safely.",
    stack: ["agents.py", "flows.json", "tracing.ts"],
  },
  {
    hash: "7d1e408",
    title: "real-time RAG for election coverage",
    description:
      "Generative AI solution for the 2024 elections: integrated the TSE's API into a RAG pipeline that generates journalistic text in real time, combining generative AI and computer vision in the production workflow.",
    impact:
      "Sustained real-time news coverage during one of the highest-demand events of the year, without relying on manual reporting.",
    stack: ["rag_pipeline.py", "tse_client.py"],
  },
  {
    hash: "c02b6a5",
    title: "Poder Monitor: tracking federal fund transfers",
    description:
      "Full-stack development (backend, frontend, scrapers and RPA) of the module that cross-references earmarks, transfers and public indicators across multiple geographic scales, supported by the Google News Initiative.",
    impact:
      "Brought transparency to federal fund transfers at a national scale, supporting public-interest data journalism.",
    stack: ["monitor.tsx", "scraper.py", "api.ts"],
  },
  {
    hash: "4e6f8a2",
    title: "technical leadership on ERP/CRM integration automation",
    description:
      "Automation via RPA and APIs integrating ERP/CRM systems, with serverless architectures on AWS/GCP, Clean Code and SOLID, and SAST (SonarQube) integrated into CI/CD pipelines with Jenkins.",
    impact:
      "Raised the team's security maturity (SAST in the pipeline) and system performance through SQL/NoSQL database tuning, leading from the ground up to delivery.",
    stack: ["integration.py", "rpa.java", "infra.tf"],
  },
] as const;

export const content: Record<Lang, Content> = {
  pt: {
    name: "Lucas Marques",
    fullName: "Lucas Gabriel Marques Soares",
    handle: "lucasmarques",
    role: "Engenharia de Software, Dados & IA · DevSecOps",
    location: "Distrito Federal, Brasil",
    footerLocation: "Distrito Federal · Brasil",
    experienceYears: "7+ anos",
    bio: "Profissional de tecnologia com 7+ anos de experiência em DevSecOps, Engenharia de Software e IA. Projeto e construo soluções escaláveis, de pipelines de dados e arquiteturas cloud-native a agentes e sistemas com LLMs, com segurança desde o desenho.",
    linkedin: "https://www.linkedin.com/in/lucaasgaabriel14/",
    github: "https://github.com/lucaasgaabriel",
    linkedinHandle: "/in/lucaasgaabriel14",
    githubHandle: "@lucaasgaabriel",
    stackCategories: stackCategoriesPt,
    focusAreas: focusAreasPt,
    projects: projectsPt,
    navLinks: [
      { href: "#foco", label: "Foco" },
      { href: "#stacks", label: "Stacks" },
      { href: "#projetos", label: "Projetos" },
      { href: "#contato", label: "Contato" },
    ],
    ui: {
      experience: "Experiência",
      whoamiCommand: "whoami --focus",
      stacksHeading: "Stacks",
      stacksSubtitle:
        "Da primeira linha de código à produção em escala: o que sustenta o que projeto e entrego de ponta a ponta, com segurança em cada camada.",
      projectsHeading: "Projetos & impacto",
      projectsSubtitle: "Um recorte do que construí: não só a stack, mas o que ela resolveu.",
      filesChanged: "files changed",
      impactLabel: "Impact:",
      contactHeading: "Contato profissional",
      contactSubtitle:
        "Vamos trocar uma ideia sobre IA, desenvolvimento, cloud, dados ou DevSecOps? Respondo mais rápido pelo LinkedIn.",
      formName: "Nome",
      formNamePlaceholder: "Seu nome",
      formEmail: "E-mail",
      formEmailPlaceholder: "voce@email.com",
      formMessage: "Mensagem",
      formMessagePlaceholder: "Conte um pouco sobre o projeto ou oportunidade",
      formSubmit: "Enviar mensagem",
      formSubmitting: "Enviando…",
      mainNav: "Principal",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      lightTheme: "Ativar tema claro",
      darkTheme: "Ativar tema escuro",
    },
  },
  en: {
    name: "Lucas Marques",
    fullName: "Lucas Gabriel Marques Soares",
    handle: "lucasmarques",
    role: "Software Engineering, Data & AI · DevSecOps",
    location: "Distrito Federal, Brazil",
    footerLocation: "Distrito Federal · Brazil",
    experienceYears: "7+ years",
    bio: "Technology professional with 7+ years of experience in DevSecOps, Software Engineering and AI. I design and build scalable solutions, from data pipelines and cloud-native architectures to agents and LLM-based systems, with security from the design phase.",
    linkedin: "https://www.linkedin.com/in/lucaasgaabriel14/",
    github: "https://github.com/lucaasgaabriel",
    linkedinHandle: "/in/lucaasgaabriel14",
    githubHandle: "@lucaasgaabriel",
    stackCategories: stackCategoriesEn,
    focusAreas: focusAreasEn,
    projects: projectsEn,
    navLinks: [
      { href: "#foco", label: "Focus" },
      { href: "#stacks", label: "Stacks" },
      { href: "#projetos", label: "Projects" },
      { href: "#contato", label: "Contact" },
    ],
    ui: {
      experience: "Experience",
      whoamiCommand: "whoami --focus",
      stacksHeading: "Stacks",
      stacksSubtitle:
        "From the first line of code to production at scale: what backs what I design and ship end to end, with security in every layer.",
      projectsHeading: "Projects & impact",
      projectsSubtitle: "A slice of what I've built: not just the stack, but what it solved.",
      filesChanged: "files changed",
      impactLabel: "Impact:",
      contactHeading: "Professional contact",
      contactSubtitle:
        "Want to talk about AI, development, cloud, data or DevSecOps? I respond faster on LinkedIn.",
      formName: "Name",
      formNamePlaceholder: "Your name",
      formEmail: "Email",
      formEmailPlaceholder: "you@email.com",
      formMessage: "Message",
      formMessagePlaceholder: "Tell me a bit about the project or opportunity",
      formSubmit: "Send message",
      formSubmitting: "Sending…",
      mainNav: "Main",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      lightTheme: "Switch to light theme",
      darkTheme: "Switch to dark theme",
    },
  },
};
