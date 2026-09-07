const enCommon = {
  hero: {
    title: "I'm Andrés Izquierdo",
    description:
      "Software engineer, designer, and creator shaping product-minded interfaces and systems.",
    toolbar: {
      languageHint: "Switch between English and Spanish.",
      themeHint: "Toggle dark mode.",
      downloadCv: "Download CV",
    },
  },
  nav: {
    home: "Home",
    background: "Background",
    projects: "Projects",
    contact: "Contact",
  },
  sections: {
    about: {
      eyebrow: "Background",
      title: "Building software with a product and design lens.",
      body: "Product-minded software engineer with experience across full-stack development, SaaS products, and design-driven environments.",
      body2:
        "The timeline below is the factual backbone — projects and contact fill in around it.",
      currentFocus: "Current focus",
    },
    projects: {
      eyebrow: "Projects",
      title: "Case studies are the next layer to land here.",
      viewProject: "View project",
      comingSoon: "Coming soon",
      caseStudy: "Case study",
    },
    projectDashboard: {
      eyebrow: "Want the live view?",
      title: "Want to go a little deeper?",
      description:
        "See my apps running, check their uptime, and peek at response times, deployments, and the details behind each build.",
      cta: "See what’s live",
      monitor: "Live apps",
      online: "Online",
      metrics: {
        uptime: "Uptime",
        latency: "Latency",
        deployments: "Deployments",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Have something worth building? Let's talk.",
      lead: "Tell me what you are working on, where it is stuck, or what you want to make better. I read every email and reply personally.",
      downloadCv: "Download CV",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@email.com",
        message: "Message",
        messagePlaceholder: "Tell me a bit about what you have in mind...",
        submit: "Send message",
        submitting: "Sending...",
        success: "Message sent — I’ll get back to you soon.",
        error: "Something went wrong. Please try again.",
      },
      channels: {
        email: { label: "Email", value: "andres.izbri@gmail.com" },
        phone: { label: "Let's talk", value: "Open to a quick call" },
        linkedin: { label: "LinkedIn", value: "Connect with me" },
      },
      footer: "© {{year}} Andrés Izquierdo. All rights reserved.",
    },
  },
  experience: {
    tab: "Experience",
    eyebrow: "Career",
    title: "Experience",
    description:
      "Full-stack engineering across product, SaaS, and design-driven environments.",
    entries: {
      dst: {
        company: "Dst · Design Strategy Technology",
        role: "Software Developer",
        type: "Full-time",
        location: "Santa Cruz de Tenerife, Canary Islands, Spain · On-site",
        period: "Jul 2024 – Present",
        highlights: {
          h0: "Developed and maintained multiple FastAPI microservices within a large-scale international project, contributing to a React frontend and configuring Docker environments for service containerization.",
          h1: "Developed 700+ Pytests to validate API and business logic, achieving over 90% code coverage; spearheaded E2E testing with Cypress establishing company-wide guidelines.",
        },
      },
      step: {
        company: "S.T.E.P. S.R.L.",
        role: "Web Developer — Erasmus Intern",
        type: "Internship",
        location: "Sorso, Sardinia, Italy",
        period: "Mar 2024 – May 2024",
        highlights: {
          h0: "Managed the full redesign of the corporate website using Next.js, developing comprehensive UI/UX design projects in Figma and coordinating a development team of 5 people.",
          h1: "Implemented a RESTful API integrating Large Language Models (LLM) and Text-to-Speech (TTS) technology.",
        },
      },
    },
  },
  education: {
    tab: "Education",
    eyebrow: "Learning",
    title: "Education",
    description:
      "A dedicated lane for degrees, certifications, and ongoing learning, separate from work so both stories can expand cleanly.",
    ongoing: "Ongoing",
    present: "Present",
    certifications: "Certifications",
    entries: {
      uoc: {
        institution: "Universitat Oberta de Catalunya",
        degree: "B.Sc. in Computer Science — Software Engineering",
        location: "Barcelona, Spain (online)",
        description:
          "Ongoing engineering degree with a focus on software engineering, building on hands-on professional experience in product and platform development.",
      },
      cifp: {
        institution: "CIFP César Manrique",
        degree: "Higher Technician in Web Application Development",
        location: "Las Palmas de Gran Canaria, Spain",
        description:
          "Ciclo de Formación Profesional Superior en Desarrollo de Aplicaciones Web — a two-year vocational program covering full-stack web development, databases, and deployment.",
      },
    },
    certs: {
      cambridgeC1: {
        title: "English — C1",
        issuer: "Cambridge English Qualifications",
        status: "Obtained",
      },
      awsCloudPractitioner: {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        status: "Obtained",
      },
    },
  },
} as const

export default enCommon
