export interface MeditationData {
  name: string;
  icon: string;
  duration: number;
  description: string;
  color: string;
  borderColor: string;
  guidance: {
    start: string;
    inhale: string[];
    exhale: string[];
    phases: string[];
    end: string;
  };
}

export const meditations: Record<string, MeditationData> = {
  gratitude: {
    name: 'Gratitude',
    icon: '🙏',
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
    name: 'Abondance',
    icon: '💰',
    duration: 600, // 10 minutes
    description: 'Attirez la prospérité',
    color: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    guidance: {
      start: "Méditation de l'abondance. Ouvrez-vous à la prospérité infinie de l'univers.",
      inhale: ["Inspirez l'abondance", "Accueillez la prospérité", "Recevez la richesse"],
      exhale: ["Expirez les limitations", "Libérez les blocages", "Lâchez la pénurie"],
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
      end: "L'abondance est maintenant activée dans votre vie. Restez ouvert aux opportunités."
    }
  },

  love: {
    name: 'Amour Universel',
    icon: '💗',
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

  attraction: {
    name: 'Loi d\'Attraction',
    icon: '🧲',
    duration: 420, // 7 minutes
    description: 'Manifestez vos désirs',
    color: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    guidance: {
      start: "Activez la loi d'attraction. Alignez vos vibrations avec vos désirs les plus profonds.",
      inhale: ["Inspirez vos désirs", "Attirez le positif", "Magnétisez vos rêves"],
      exhale: ["Expirez les doutes", "Libérez les peurs", "Lâchez la résistance"],
      phases: [
        "Clarifiez votre intention. Qu'est-ce que vous désirez vraiment attirer dans votre vie ?",
        "Ressentez maintenant comme si votre désir était déjà réalisé. Vivez cette joie.",
        "Votre énergie s'aligne parfaitement avec ce que vous voulez manifester.",
        "L'univers conspire en votre faveur. Tout s'organise pour votre plus grand bien.",
        "Lâchez le comment. Faites confiance au processus de manifestation.",
        "Vous êtes un puissant créateur. Votre réalité se transforme selon vos pensées.",
        "La gratitude accélère la manifestation. Remerciez pour ce qui vient."
      ],
      end: "Vos vibrations sont alignées. La manifestation est en cours."
    }
  },

  confidence: {
    name: 'Confiance en Soi',
    icon: '💪',
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
    icon: '😴',
    duration: 600, // 10 minutes
    description: 'Préparez-vous au repos',
    color: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
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