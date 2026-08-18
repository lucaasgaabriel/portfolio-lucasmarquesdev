export const profile = {
  name: "Lucas Marques",
  fullName: "Lucas Gabriel Marques Soares",
  handle: "lucasmarques",
  role: "Engenharia de Software, Dados & IA · DevSecOps",
  location: "Distrito Federal, Brasil",
  experienceYears: "7+",
  bio: "Profissional de tecnologia com 7+ anos de experiência em DevSecOps, Engenharia de Software e IA. Projeto e construo soluções escaláveis — de pipelines de dados e arquiteturas cloud-native a agentes e sistemas com LLMs — com segurança desde o desenho.",
  linkedin: "https://www.linkedin.com/in/lucaasgaabriel14/",
  github: "https://github.com/lucaasgaabriel14",
} as const;

export type StackCategory = {
  id: string;
  slug: string;
  label: string;
  items: readonly string[];
};

export const stackCategories: readonly StackCategory[] = [
  {
    id: "languages",
    slug: "linguagens",
    label: "Linguagens",
    items: ["Python", "TypeScript", "JavaScript", "Java", "PHP", "Shell"],
  },
  {
    id: "dev",
    slug: "web",
    label: "Web",
    items: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "WordPress"],
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
    id: "cloud",
    slug: "cloud",
    label: "Cloud",
    items: ["AWS", "GCP", "Azure", "Serverless", "Cloud Run"],
  },
  {
    id: "devops",
    slug: "devops",
    label: "DevOps",
    items: ["Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins"],
  },
  {
    id: "security",
    slug: "seguranca",
    label: "Segurança",
    items: [
      "SAST/DAST",
      "Secure SDLC",
      "SonarQube",
      "Burp Suite",
      "Gestão de Vulnerabilidades",
    ],
  },
  {
    id: "database",
    slug: "bancoDeDados",
    label: "Banco de Dados",
    items: ["SQL", "T-SQL", "NoSQL", "MySQL", "MongoDB"],
  },
  {
    id: "data",
    slug: "dados",
    label: "Dados & Analytics",
    items: ["Data Engineering", "ETL Pipelines", "Power BI / Grafana"],
  },
  {
    id: "ai",
    slug: "ia",
    label: "IA",
    items: ["LangChain", "RAG", "LLMs & SLMs", "n8n"],
  },
  {
    id: "mobile",
    slug: "mobile",
    label: "Mobile",
    items: ["Android", "iOS"],
  },
] as const;

export const focusAreas = [
  { tag: "DEV", text: "Desenvolvimento full-stack de aplicações e APIs escaláveis" },
  { tag: "ENG", text: "Arquitetura de software, Clean Code e padrões de projeto" },
  { tag: "IAC", text: "Infraestrutura como código e automação de deploys" },
  { tag: "AI", text: "Arquitetura e engenharia de agentes e sistemas com LLMs" },
  { tag: "DATA", text: "Pipelines de dados e integrações em ambientes cloud" },
  { tag: "SEC", text: "Segurança integrada ao ciclo de desenvolvimento" },
] as const;

export type Project = {
  hash: string;
  title: string;
  description: string;
  impact: string;
  stack: readonly string[];
};

export const projects: readonly Project[] = [
  {
    hash: "a3f9c21",
    title: "orquestração de agentes de IA generativa em produção",
    description:
      "Arquitetura e implementação de agentes e pipelines com LLMs e SLMs, da concepção à produção — automação de fluxos, observabilidade e participação nas decisões de governança e adoção de IA em aplicações corporativas.",
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
    title: "Poder Monitor — rastreamento de repasses federais",
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

export const navLinks = [
  { href: "#foco", label: "Foco" },
  { href: "#stacks", label: "Stacks" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
] as const;
