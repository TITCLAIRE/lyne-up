export const meditations = {
  gratitude: {
    name: 'Gratitude',
    icon: 'Hand',
    duration: 300, // 5 minutes
    description: 'Cultivez la reconnaissance',
    color: 'rgba(251, 191, 36, 0.2)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    guidance: {
      start: "Bienvenue dans cette méditation de gratitude. Installez-vous confortablement et laissez la reconnaissance remplir votre cœur.",
      inhale: ["Inspirez la gratitude", "Accueillez l'abondance", "Recevez les bienfaits"],
      exhale: ["Expirez la reconnaissance", "Partagez votre joie", "Rayonnez la gratitude"],
      phases: [
        "Pensez à trois choses pour lesquelles vous êtes reconnaissant aujourd'hui. Laissez cette gratitude vous envahir.",
        "Ressentez la chaleur de la reconnaissance dans votre poitrine. Elle grandit à chaque respiration.",
        "Visualisez les personnes qui enrichissent votre vie. Envoyez-leur silencieusement votre gratitude.",
        "Appréciez votre corps, ce véhicule extraordinaire qui vous permet de vivre chaque expérience.",
        "La gratitude transforme ce que vous avez en suffisance. Vous êtes comblé de bienfaits."
      ],
      end: "Magnifique méditation. La gratitude continue de rayonner en vous."
    }
  },

  abundance: {
    name: 'Abondance & Attraction',
    icon: 'DollarSign',
    duration: 600, // 10 minutes
    description: 'Attirez la prospérité et manifestez vos désirs',
    color: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    guidance: {
      start: "Méditation de l'abondance et de l'attraction. Ouvrez-vous à la prospérité infinie de l'univers et alignez-vous avec vos désirs les plus profonds.",
      inhale: ["Inspirez l'abondance", "Accueillez la prospérité", "Attirez vos désirs"],
      exhale: ["Expirez les limitations", "Libérez les blocages", "Lâchez la résistance"],
      phases: [
        "Vous méritez l'abondance sous toutes ses formes. Sentez cette vérité dans chaque cellule de votre corps.",
        "L'argent est une énergie qui circule librement vers vous. Vous êtes un aimant à prospérité.",
        "Visualisez votre vie idéale d'abondance. Voyez-vous vivre dans la joie et la générosité.",
        "Chaque respiration vous connecte au flux illimité de richesses de l'univers.",
        "Vos talents uniques créent de la valeur. Vous êtes récompensé généreusement pour votre contribution.",
        "L'abondance n'est pas seulement financière. Elle est dans vos relations, votre santé, votre créativité.",
        "Répétez intérieurement : Je suis ouvert et réceptif à toute la richesse que la vie m'offre.",
        "La gratitude multiplie l'abondance. Plus vous appréciez, plus vous recevez.",
        "Vous vibrez maintenant à la fréquence de la prospérité. Les opportunités affluent vers vous.",
        "Cette abondance est votre état naturel. Vous y retournez maintenant avec confiance et sérénité."
      ],
      end: "L'abondance et l'attraction sont maintenant activées dans votre vie. Restez ouvert aux opportunités."
    }
  },

  love: {
    name: 'Amour Universel',
    icon: 'Heart',
    duration: 480, // 8 minutes
    description: 'Ouvrez votre cœur',
    color: 'rgba(236, 72, 153, 0.2)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    guidance: {
      start: "Méditation de l'amour universel. Laissez votre cœur s'ouvrir à l'amour inconditionnel.",
      inhale: ["Inspirez l'amour", "Accueillez la tendresse", "Recevez l'affection"],
      exhale: ["Expirez l'amour", "Partagez la compassion", "Rayonnez la bienveillance"],
      phases: [
        "Placez votre main sur votre cœur. Sentez-le battre, fidèle et aimant.",
        "Commencez par vous aimer vous-même, profondément et sans condition.",
        "Cet amour s'étend maintenant à vos proches. Visualisez-les baignés de lumière rose.",
        "Élargissez ce cercle d'amour à vos connaissances, vos collègues, même les inconnus.",
        "Incluez maintenant ceux qui vous ont blessé. L'amour guérit toutes les blessures.",
        "Votre amour englobe toute l'humanité, tous les êtres vivants de cette planète.",
        "Vous êtes amour. C'est votre essence véritable qui rayonne à chaque instant.",
        "Cet amour universel vous revient multiplié. Vous êtes aimé au-delà de toute mesure."
      ],
      end: "Votre cœur est grand ouvert. L'amour que vous avez partagé vous revient multiplié."
    }
  },

  confidence: {
    name: 'Confiance en Soi',
    icon: 'Armchair',
    duration: 360, // 6 minutes
    description: 'Renforcez votre pouvoir',
    color: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    guidance: {
      start: "Méditation de la confiance. Reconnectez-vous à votre pouvoir intérieur illimité.",
      inhale: ["Inspirez la force", "Accueillez le courage", "Recevez la puissance"],
      exhale: ["Expirez les doutes", "Libérez les peurs", "Chassez l'hésitation"],
      phases: [
        "Vous êtes plus fort que vous ne le pensez. Cette force est en vous maintenant.",
        "Rappelez-vous vos succès passés. Vous avez déjà surmonté tant d'obstacles.",
        "Votre confiance grandit à chaque respiration. Vous vous tenez droit, ancré.",
        "Vous avez tout ce qu'il faut pour réussir. Les ressources sont déjà en vous.",
        "Visualisez-vous accomplissant vos objectifs avec aisance et assurance.",
        "Cette confiance inébranlable est votre état naturel. Vous y retournez maintenant."
      ],
      end: "Votre confiance est restaurée. Vous êtes prêt à conquérir le monde."
    }
  },

  sleep: {
    name: 'Sommeil Profond',
    icon: 'Moon',
    duration: 600, // 10 minutes
    description: 'Préparez-vous au repos',
    color: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: 'delta', // Ondes Delta (2Hz) - sommeil profond
    guidance: {
      start: "Méditation du sommeil. Préparez votre corps et votre esprit à un repos profond et réparateur.",
      inhale: ["Inspirez la détente", "Accueillez la paix", "Invitez le calme"],
      exhale: ["Expirez les tensions", "Relâchez la journée", "Lâchez prise"],
      phases: [
        "La journée est terminée. Vous pouvez maintenant tout relâcher en toute sécurité.",
        "Votre lit est un sanctuaire de paix. Vous vous y sentez parfaitement en sécurité.",
        "Chaque muscle de votre corps se détend profondément, de la tête aux pieds.",
        "Vos pensées ralentissent comme des nuages qui passent dans un ciel nocturne.",
        "Votre respiration devient le doux bercement qui vous guide vers le sommeil.",
        "Les soucis de la journée se dissolvent. Demain est un autre jour.",
        "Vous glissez maintenant dans un sommeil profond et réparateur.",
        "Votre subconscient veille sur vous pendant que vous vous reposez.",
        "Des rêves paisibles vous attendent dans ce voyage nocturne.",
        "Laissez-vous aller... Le sommeil vous accueille avec douceur."
      ],
      end: "Vous êtes maintenant parfaitement préparé pour un sommeil profond et réparateur."
    }
  }
};

// Méditations spirituelles
export const spiritualMeditations = {
  metatron: {
    name: 'Invocation de l\'Archange Métatron',
    icon: 'Star',
    duration: 300, // 5 minutes
    description: 'Connexion spirituelle avec l\'Archange Métatron',
    color: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 }, // Rythme 4/6
    frequency: '741hz', // 741 Hz - Éveil de l'intuition
    hasFullAudio: true, // Indique qu'il y a un fichier audio complet
    fallbackStart: "Bienvenue dans cette méditation d'invocation de l'Archange Métatron. Installez-vous confortablement et fermez les yeux. Nous allons établir une connexion spirituelle avec cet être de lumière.",
    guidance: {
      start: "Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement. Fermez les yeux et prenez quelques profondes respirations. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre coeur à cette présence divine. Ô Metatron, ange de la Présence, scribe de Lumière, gardien du Trône Divin, toi qui as connu la chair et t'es élevé au-delà, je t'appelle avec humilité. Que ta présence sacrée se manifeste dans cet espace. Je t'invite à m'accompagner dans cette méditation, à m'envelopper de ton énergie céleste. Que ta lumière entoure mon esprit, que ta sagesse éclaire mon cœur, que ta voix me guide sur les chemins de vérité. Toi qui écris dans les Livres Célestes, inscris en moi la mémoire de mon âme. Aide-moi à me souvenir de qui je suis, au-delà des voiles de l'oubli et des peurs humaines. Toi qui transmets la pensée divine, fais descendre en moi l'inspiration claire, la parole juste, et le silence plein de sens. Entoure-moi de ton Cube sacré, géométrie vivante de la création, bouclier de lumière contre les ombres. Metatron, Archange de feu blanc, ouvre les portes de la haute conscience. Aide-moi à élever ma fréquence, à faire rayonner l'amour, et à servir ce qui est plus grand que moi. Je te rends grâce pour ta présence, ta guidance et ta protection. Amen. Doucement, prenez conscience de votre corps, de votre respiration. Quand vous êtes prêt, ouvrez les yeux en gardant cette connexion sacrée avec l'Archange Métatron.",
      phases: [
        "Ô Metatron, ange de la Présence, scribe de Lumière, je t'appelle avec humilité.",
        "Que ta lumière entoure mon esprit, que ta sagesse éclaire mon cœur.",
        "Toi qui écris dans les Livres Célestes, inscris en moi la mémoire de mon âme.",
        "Entoure-moi de ton Cube sacré, géométrie vivante de la création.",
        "Metatron, Archange de feu blanc, ouvre les portes de la haute conscience."
      ],
      // Pas de phases intermédiaires car c'est un fichier audio complet
      end: "Votre connexion avec l'Archange Métatron est établie. Gardez cette énergie sacrée avec vous."
    }
  }
};