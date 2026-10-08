import CourseLayout, {
  Section,
  SubSection,
  Formula,
  KeyIdea,
  Definition,
} from "@/components/CourseLayout"
import { getCourseBySlug } from "@/lib/courses/manifest"

const TOC = [
  { id: "variance-psycho", title: "La variance et son impact psychologique" },
  { id: "tilt", title: "Le tilt : mécanique et types" },
  { id: "processus", title: "Séparer processus et résultat" },
  { id: "bankroll", title: "Bankroll management rigoureux" },
  { id: "session", title: "Hygiène de session et routine" },
]

export default function MentalGameCourse() {
  const meta = getCourseBySlug("mental-game")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Le poker technique ne suffit pas. Un joueur qui prend des décisions optimales mais
        s&apos;effondre émotionnellement lors des downswings perdra plus qu&apos;il ne gagne.
        Ce cours pose les fondations mentales du jeu long terme : compréhension de la
        variance, mécanique du tilt, séparation processus/résultat, bankroll management
        rigoureux.
      </p>

      {/* ============================================================ */}
      <Section id="variance-psycho" title="1. La variance et son impact psychologique">
        <p>
          Comme vu au cours 1, la variance en NLHE 6-max est de l&apos;ordre de σ = 100 bb/100
          mains. Cela signifie qu&apos;un joueur gagnant à 5 bb/100 aura un downswing typique
          de plusieurs milliers de mains.
        </p>

        <SubSection title="Le paradoxe du signal/bruit">
          <p>
            Sur 100 mains : le bruit (variance) est 20× plus grand que le signal (winrate). Il
            est <strong>littéralement impossible</strong> de conclure quoi que ce soit d&apos;une
            session courte.
          </p>
          <Formula>
            Ratio bruit/signal @ 100 mains = σ / (winrate × √n / σ) ≈ 20 <br />
            Ratio bruit/signal @ 100 000 mains ≈ 0,63
          </Formula>
          <p>
            Il faut environ <strong>100 000 mains</strong> pour que ton winrate estimé soit à
            ±1 bb/100 de ta vraie valeur avec 95% de confiance.
          </p>
        </SubSection>

        <SubSection title="Downswing typique attendu">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Winrate (bb/100)</th>
                  <th className="text-left py-2 pr-4">Downswing max typique</th>
                  <th className="text-left py-2">P(subir un DS de 10 buy-ins)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">10 (excellent)</td>
                  <td className="py-2 pr-4">15-20 buy-ins</td>
                  <td className="py-2">~50% sur une carrière</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">5 (bon reg)</td>
                  <td className="py-2 pr-4">25-35 buy-ins</td>
                  <td className="py-2">~75% sur une carrière</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">2 (breakeven +)</td>
                  <td className="py-2 pr-4">40-50 buy-ins</td>
                  <td className="py-2">~90%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">0 (breakeven)</td>
                  <td className="py-2 pr-4">Infini (random walk)</td>
                  <td className="py-2">Éventuellement 100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <KeyIdea>
            Les downswings sont mathématiquement inévitables. Un pro à 5 bb/100 subira à un
            moment de sa carrière un downswing de 30 buy-ins. Ne pas le prévoir psychologiquement
            = ruine assurée.
          </KeyIdea>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="tilt" title="2. Le tilt : mécanique et types">
        <Definition term="Tilt">
          état émotionnel qui altère la qualité des décisions et dévie de la stratégie
          optimale. Toujours -EV, souvent inconscient.
        </Definition>

        <SubSection title="Sept types de tilt (d'après Jared Tendler)">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Injustice tilt</strong> — quand tu perds un all-in comme grand favori.
              Tu joues plus large pour &quot;récupérer&quot;.
            </li>
            <li>
              <strong>Hate-losing tilt</strong> — refus général de perdre. Chasse les pertes,
              multiplie les sessions.
            </li>
            <li>
              <strong>Mistake tilt</strong> — tu joues mal une main et cette erreur te ronge.
              Tu joues sur-serré ou sur-agressif pour compenser.
            </li>
            <li>
              <strong>Entitlement tilt</strong> — sentiment que tu &quot;mérites&quot; de gagner.
              Justifie des call spéculatifs.
            </li>
            <li>
              <strong>Revenge tilt</strong> — cibler un adversaire spécifique après un coup
              perdu.
            </li>
            <li>
              <strong>Winner&apos;s tilt</strong> — l&apos;euphorie post-victoire élargit la
              range de call/bluff au-delà du profitable.
            </li>
            <li>
              <strong>Running bad tilt</strong> — accumulation de bad beats qui érodent la
              confiance dans les décisions correctes.
            </li>
          </ol>
        </SubSection>

        <SubSection title="Physiologie du tilt">
          <p>
            Le tilt est un état neurophysiologique mesurable : élévation du cortisol,
            activation du cortex préfrontal réduite (impact direct sur la prise de décision),
            variabilité cardiaque (HRV) diminuée.
          </p>
          <p>
            <strong>Signes physiques</strong> : accélération du rythme cardiaque, respiration
            superficielle, tension épaules/mâchoire, envie de miser vite.
          </p>
        </SubSection>

        <KeyIdea>
          Le tilt ne se résout pas par la volonté &quot;rester calme&quot;. Il se résout par
          une action physique (quitter la table, respirer, marcher) qui reset la
          physiologie.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="processus" title="3. Séparer processus et résultat">
        <p>
          Le poker est un jeu à information imparfaite dominé par la variance. Évaluer une
          décision par son résultat est <strong>catégoriquement faux</strong> — c&apos;est
          l&apos;erreur cognitive centrale des joueurs perdants.
        </p>

        <SubSection title="La matrice décision/résultat">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4"></th>
                  <th className="text-left py-2 pr-4">Décision correcte</th>
                  <th className="text-left py-2">Décision incorrecte</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4 font-semibold">Bon résultat</td>
                  <td className="py-2 pr-4">Skill (+EV réalisé)</td>
                  <td className="py-2">Chance (masque le leak)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Mauvais résultat</td>
                  <td className="py-2 pr-4">Variance (à ignorer émotionnellement)</td>
                  <td className="py-2">Leak à corriger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Le rapport post-session">
          <p>
            Un pro évalue sa session sur la qualité des <strong>décisions</strong>, pas sur le
            résultat. Un rapport post-session type :
          </p>
          <ol className="list-decimal pl-5">
            <li>Quelles ont été les 3 décisions les plus difficiles ?</li>
            <li>Ai-je respecté ma stratégie de base (ranges, sizings) ?</li>
            <li>Y a-t-il eu tilt ? À quel moment ? Quel déclencheur ?</li>
            <li>Sur quelle marge d&apos;EV ai-je gagné/perdu (indépendamment du résultat) ?</li>
          </ol>
          <p>
            Ce rapport se fait <strong>avant</strong> de regarder le résultat monétaire.
            L&apos;équanimité vient de la déconnexion.
          </p>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="bankroll" title="4. Bankroll management rigoureux">
        <Definition term="Bankroll">
          somme d&apos;argent dédiée exclusivement au poker, séparée des finances
          personnelles. Sa gestion prévient la ruine.
        </Definition>

        <SubSection title="Règles de bankroll par format">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Format</th>
                  <th className="text-left py-2 pr-4">BR conservateur</th>
                  <th className="text-left py-2 pr-4">BR agressif</th>
                  <th className="text-left py-2">Justification</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Cash NLHE 6-max</td>
                  <td className="py-2 pr-4">50 buy-ins</td>
                  <td className="py-2 pr-4">25 buy-ins</td>
                  <td className="py-2">σ ≈ 100 bb/100</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Cash Zoom / fast-fold</td>
                  <td className="py-2 pr-4">40 buy-ins</td>
                  <td className="py-2 pr-4">20 buy-ins</td>
                  <td className="py-2">Volume plus rapide, variance similaire</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">MTT (Multi-Table Tournament)</td>
                  <td className="py-2 pr-4">200 buy-ins</td>
                  <td className="py-2 pr-4">100 buy-ins</td>
                  <td className="py-2">Variance extrême, gros pay jumps rares</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Spin & Go / Jackpot</td>
                  <td className="py-2 pr-4">300 buy-ins</td>
                  <td className="py-2 pr-4">150 buy-ins</td>
                  <td className="py-2">Variance très haute</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">SNG standard</td>
                  <td className="py-2 pr-4">50 buy-ins</td>
                  <td className="py-2 pr-4">25 buy-ins</td>
                  <td className="py-2">Variance modérée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Règles de mouvement de stakes">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Monter</strong> : quand tu as la bankroll requise pour la limite
              supérieure ET un sample size significatif de winrate positif sur la limite
              actuelle (min 20 000 mains).
            </li>
            <li>
              <strong>Descendre</strong> : quand tu perds 20% de ta bankroll dédiée à la
              limite actuelle. Descend sans hésiter.
            </li>
            <li>
              <strong>Shot-taking</strong> : essayer une limite au-dessus avec une petite part
              de bankroll (5-10 buy-ins), avec règle de stop-loss rigoureuse.
            </li>
          </ul>
        </SubSection>

        <KeyIdea>
          La bankroll est un <strong>outil</strong>, pas un score. Elle sert à absorber la
          variance sans tilt. Un pro qui joue nl100 avec 25 buy-ins et un pro qui joue nl100
          avec 100 buy-ins ont deux jeux psychologiques différents.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="session" title="5. Hygiène de session et routine">
        <SubSection title="Pré-session">
          <ul className="list-disc pl-5">
            <li>Sommeil correct la veille (7h+).</li>
            <li>Nourriture solide 1-2h avant, hydratation.</li>
            <li>Environnement sans distractions (téléphone en dérogation, notifications off).</li>
            <li>Warmup mental : révision d&apos;une range spécifique, revue d&apos;une main HH pendant 10 min.</li>
            <li>Fixer la durée maximale et objectifs de qualité (pas résultat).</li>
          </ul>
        </SubSection>

        <SubSection title="Pendant la session">
          <ul className="list-disc pl-5">
            <li>Vérifier ton état toutes les 30 min (tension physique, humeur).</li>
            <li>Pause de 5 min toutes les heures.</li>
            <li>Si un déclencheur de tilt survient : arrêter immédiatement 10 min.</li>
            <li>Objectif : qualité constante des 200 dernières mains.</li>
          </ul>
        </SubSection>

        <SubSection title="Post-session">
          <ul className="list-disc pl-5">
            <li>Rapport rapide (5-10 min) : décisions, tilt, leaks détectés.</li>
            <li>Marquer 2-3 mains difficiles pour étude ultérieure.</li>
            <li>Ne pas regarder le résultat avant d&apos;avoir fait le rapport.</li>
            <li>Décompression : activité physique ou sociale non-poker.</li>
          </ul>
        </SubSection>

        <SubSection title="Routine hebdomadaire">
          <ul className="list-disc pl-5">
            <li>1-2 séances d&apos;étude (solveur, revue de mains, cours).</li>
            <li>Sessions de jeu réparties (pas 20h en 2 jours).</li>
            <li>1 jour off complet.</li>
            <li>Exercice physique régulier : booste directement la qualité décisionnelle.</li>
          </ul>
        </SubSection>

        <KeyIdea>
          Le poker est un sport cognitif. Ta performance dépend de ton état neuronal. Traiter
          ton corps et ton mental comme un athlète traite les siens n&apos;est pas une option
          — c&apos;est du +EV mesurable en $/heure.
        </KeyIdea>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Variance mathématique implique downswings inévitables. Les prévoir mentalement.</li>
          <li>Il faut 100 000 mains pour un winrate signal-fort. Toute conclusion sous ce seuil est bruit.</li>
          <li>7 types de tilt (Jared Tendler). Résolution par action physique, pas par volonté.</li>
          <li>Évaluer les décisions, pas les résultats. Matrice décision/résultat.</li>
          <li>Bankroll : 25-50 buy-ins cash, 100-200 MTT. Bouger down sans hésiter à -20%.</li>
          <li>Hygiène de session : pré, pendant, post + routine hebdo.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Fin des 10 cours de l&apos;Académie fondamentale. Les cours avancés (solveur
          practical, HU, mixed strategies) sont à venir.
        </p>
      </div>
    </CourseLayout>
  )
}
