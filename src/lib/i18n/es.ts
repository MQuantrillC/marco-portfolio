import type { Dictionary } from "./config";

const es: Dictionary = {
  // Kept to the same character count as the English role. The hero sets it in
  // label type beside the portrait, where a longer line would crowd the lead.
  role: "Desarrollador y Analista de Negocios",
  skipToWork: "Ir a los proyectos",
  switch: { label: "EN", title: "View this page in English" },

  hero: {
    lead: "Construyo herramientas que convierten datos en decisiones.",
  },

  flag: {
    hintTitle: "Mi bandera personal",
    hintBody: "La diseñé yo mismo. Haz clic para verla en grande.",
    dialogTitle: "Mi bandera personal",
    close: "Cerrar",
    alt: "Estandarte armorial personal de Marco Quantrill",
  },

  projects: {
    heading: "Trabajos seleccionados",
    open: "Abrir app",
    source: "Código",
    openIn: "Abrir {title} en una pestaña nueva",
    screenshot: "Captura de {title}",
    items: {
      "01": {
        blurb:
          "Lee los correos de notificación de BCP, Yape, BBVA e Interbank con un script de Gmail que se instala solo, y luego categoriza, presupuesta y divide los gastos de forma automática. Multiusuario, inicio de sesión con Google y Postgres por detrás.",
      },
      "02": {
        blurb:
          "Un cronómetro exacto al segundo para proyectos personales, con historial por sesión que puedes filtrar por proyecto y periodo. Las cuentas en Postgres lo mantienen sincronizado entre dispositivos.",
      },
      "03": {
        blurb:
          "Pone economías lado a lado en indicadores, demografía, comercio y métricas de seguridad, traídos en vivo desde fuentes oficiales para que la comparación nunca quede desactualizada.",
      },
      "04": {
        blurb:
          "Teoría moderna de portafolios hecha interactiva. Trae datos de mercado en tiempo real, arma una asignación óptima y la somete a estrés para que puedas moverla tú mismo.",
      },
      "05": {
        blurb:
          "Presupuesto personal en varias monedas, con tipos de cambio en vivo, proyecciones a futuro y gráficos que dejan clara la forma del flujo de caja de un vistazo.",
      },
      "06": {
        blurb:
          "Defiende un puesto solitario en el desierto profundo contra asaltos de saqueadores cada vez más duros, levantando muros, torres y recolectores entre oleadas, y peleando tú mismo en el suelo como el Comandante. Cada unidad, efecto y sonido se genera en código: sin archivos de imagen, sin archivos de audio, solo llamadas de dibujo y ondas sintetizadas.",
        liveLabel: "Jugar en el navegador",
      },
    },
  },

  photos: { label: "Fotografía" },

  about: {
    heading: "Sobre mí",
    body: "Finanzas y negocios internacionales de formación, desarrollador por práctica. Trabajo de punta a punta: Python y SQL por debajo, Next.js y TypeScript por encima. Lo que más me importa es el momento en que una hoja de cálculo desordenada se convierte en algo sobre lo que alguien puede actuar.",
    aside:
      "Fuera del trabajo: snowboard, surf, montaña, y volar un dron sobre lugares que lo merecen.",
    groups: {
      build: "Construir",
      data: "Datos y BI",
      automate: "Automatizar y publicar",
      markets: "Mercados",
    },
  },

  reel: {
    heading: "El reel",
    gear: "DJI Mini 4 Pro \u00b7 Insta360 X4",
    tagline: "Lugares que valen la altura.",
    drag: "Arrastra o desliza \u2192",
    play: "Reproducir reel {n}",
    title: "Reel de dron {n}",
  },

  contact: {
    heading: "Escríbeme",
    say: "Di",
    hello: "hola",
    labels: {
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
      whatsapp: "WhatsApp",
    },
    builtWith: "Hecho con Next.js",
  },
};

export default es;
