const enCommon = {
  hero: {
    title: "I'm Andrés Izquierdo",
    description:
      "I build software and design interfaces. I like understanding the problem before writing the code.",
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
      title: "I like making things that work and make sense.",
      body: "I'm a software engineer working across code, design, and product. I like being involved from the first question to the last detail: understand the problem, try things, and leave behind something that's easy to use and maintain.",
      body2:
        "This is where you can see what I've worked on, what I'm learning, and a few things I've built on my own.",
      currentFocus: "What I'm working with",
    },
    projects: {
      eyebrow: "Projects",
      title: "A few things I've built.",
      viewProject: "View project",
      comingSoon: "Coming soon",
      caseStudy: "Case study",
    },
    projectDashboard: {
      eyebrow: "Want to see it working?",
      title: "Take a look.",
      description:
        "You can see my apps live, check whether they're online, and peek at how they're put together.",
      cta: "See the apps",
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
      title: "Have something in mind? Drop me a line.",
      lead: "If you have an idea, something stuck, or just want to talk software, drop me a line. I read everything and reply myself.",
      downloadCv: "Download CV",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@email.com",
        message: "Message",
        messagePlaceholder: "What's on your mind?",
        submit: "Send it",
        submitting: "Sending...",
        success: "Message sent. I'll get back to you soon.",
        error: "That didn't go through. Try again.",
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
    tab: "Studies",
    eyebrow: "Learning",
    title: "Studies & Certifications",
    description:
      "A record of my studies, certifications, and learning throughout my career—both completed and ongoing.",
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
