const esCommon = {
  hero: {
    title: "Soy Andrés Izquierdo",
    description:
      "Ingeniero de software, diseñador y creador que da forma a interfaces y sistemas con mentalidad de producto.",
    toolbar: {
      languageHint: "Alterna entre inglés y español.",
      themeHint: "Alterna el modo oscuro.",
      downloadCv: "Descargar CV",
    },
  },
  nav: {
    home: "Inicio",
    background: "Trayectoria",
    projects: "Proyectos",
    contact: "Contacto",
  },
  sections: {
    about: {
      eyebrow: "Trayectoria",
      title: "Construyo software con mirada de producto y diseño.",
      body: "Ingeniero de software con mentalidad de producto y experiencia en desarrollo full-stack, productos SaaS y entornos orientados al diseño.",
      body2:
        "La trayectoria de abajo es la columna vertebral — los proyectos y el contacto se construyen a su alrededor.",
      currentFocus: "Enfoque actual",
    },
    projects: {
      eyebrow: "Proyectos",
      title: "Los casos de estudio son la siguiente capa por construir.",
      viewProject: "Ver proyecto",
      comingSoon: "Próximamente",
      caseStudy: "Caso de estudio",
    },
    projectDashboard: {
      eyebrow: "¿Quieres verlo en vivo?",
      title: "¿Quieres verlo un poco más a fondo?",
      description:
        "Mira mis apps en funcionamiento, consulta su uptime y echa un vistazo a los tiempos de respuesta, despliegues y detalles de cada proyecto.",
      cta: "Ver qué está online",
      monitor: "Apps en vivo",
      online: "En línea",
      metrics: {
        uptime: "Uptime",
        latency: "Latencia",
        deployments: "Despliegues",
      },
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Tienes algo que merezca la pena construir? Hablemos.",
      lead: "Cuéntame qué estás construyendo, dónde se ha atascado o qué quieres mejorar. Leo cada correo y respondo personalmente.",
      downloadCv: "Descargar CV",
      form: {
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        email: "Correo",
        emailPlaceholder: "tucorreo@email.com",
        message: "Mensaje",
        messagePlaceholder: "Cuéntame un poco sobre lo que tienes en mente...",
        submit: "Enviar mensaje",
        submitting: "Enviando...",
        success: "Mensaje enviado — te responderé pronto.",
        error: "Ha ocurrido un error. Inténtalo de nuevo.",
      },
      channels: {
        email: { label: "Correo", value: "andres.izbri@gmail.com" },
        phone: {
          label: "Hablemos",
          value: "Disponible para una llamada rápida",
        },
        linkedin: { label: "LinkedIn", value: "Conecta conmigo" },
      },
      footer: "© {{year}} Andrés Izquierdo. Todos los derechos reservados.",
    },
  },
  experience: {
    tab: "Experiencia",
    eyebrow: "Carrera",
    title: "Experiencia",
    description:
      "Ingeniería full-stack en entornos de producto, SaaS y diseño.",
    entries: {
      dst: {
        company: "Dst · Design Strategy Technology",
        role: "Desarrollador de Software",
        type: "Jornada completa",
        location: "Santa Cruz de Tenerife, Islas Canarias, España · Presencial",
        period: "Jul 2024 – Actualidad",
        highlights: {
          h0: "Desarrollé y mantuve múltiples microservicios FastAPI dentro de un proyecto internacional a gran escala, contribuyendo a un frontend en React y configurando entornos Docker para la contenedorización de servicios.",
          h1: "Desarrollé más de 700 tests en Pytest alcanzando más del 90% de cobertura de código; lideré la implementación de pruebas E2E con Cypress estableciendo guías de calidad a nivel de empresa.",
        },
      },
      step: {
        company: "S.T.E.P. S.R.L.",
        role: "Desarrollador Web — Prácticas Erasmus",
        type: "Prácticas",
        location: "Sorso, Cerdeña, Italia",
        period: "Mar 2024 – May 2024",
        highlights: {
          h0: "Gestioné el rediseño completo del sitio web corporativo con Next.js, desarrollando proyectos de diseño UI/UX en Figma y coordinando un equipo de desarrollo de 5 personas.",
          h1: "Implementé una API RESTful integrando Modelos de Lenguaje Extenso (LLM) y tecnología de síntesis de voz (TTS).",
        },
      },
    },
  },
  education: {
    tab: "Educación",
    eyebrow: "Aprendizaje",
    title: "Educación",
    description:
      "Un espacio dedicado a títulos, certificaciones y aprendizaje continuo, separado del historial laboral.",
    ongoing: "En curso",
    present: "Presente",
    certifications: "Certificaciones",
    entries: {
      uoc: {
        institution: "Universitat Oberta de Catalunya",
        degree: "Grado en Ingeniería Informática — Ingeniería del Software",
        location: "Barcelona, España (online)",
        description:
          "Grado en curso enfocado en ingeniería del software, construido sobre experiencia profesional práctica en desarrollo de producto y plataformas.",
      },
      cifp: {
        institution: "CIFP César Manrique",
        degree: "Técnico Superior en Desarrollo de Aplicaciones Web",
        location: "Las Palmas de Gran Canaria, España",
        description:
          "Ciclo de Formación Profesional Superior en Desarrollo de Aplicaciones Web — un programa de dos años centrado en desarrollo web full-stack, bases de datos y despliegue.",
      },
    },
    certs: {
      cambridgeC1: {
        title: "Inglés — C1",
        issuer: "Cambridge English Qualifications",
        status: "Obtenido",
      },
      awsCloudPractitioner: {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        status: "Obtenido",
      },
    },
  },
} as const

export default esCommon
