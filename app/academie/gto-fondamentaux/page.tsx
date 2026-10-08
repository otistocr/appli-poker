import CourseLayout, {
  Section,
  SubSection,
  Formula,
  Example,
  KeyIdea,
  Definition,
} from "@/components/CourseLayout"
import { getCourseBySlug } from "@/lib/courses/manifest"

const TOC = [
  { id: "quest-ce-que", title: "Qu'est-ce que la GTO ?" },
  { id: "nash", title: "Équilibre de Nash et poker" },
  { id: "gto-vs-exploit", title: "GTO vs exploitation" },
  { id: "indifference", title: "Le principe d'indifférence" },
  { id: "bluff-frequency", title: "Fréquences de bluff optimales" },
  { id: "solveurs", title: "Solveurs modernes et leur usage" },
]

export default function GTOCourse() {
  const meta = getCourseBySlug("gto-fondamentaux")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        La GTO — <em>Game Theory Optimal</em> — est le cadre théorique qui a révolutionné le
        poker depuis 2010. Née des travaux de Nash sur les jeux à information imparfaite, elle
        décrit la stratégie qu&apos;un joueur doit adopter pour être{" "}
        <strong>inexploitable</strong>. Ce cours pose ses fondations mathématiques, ses
        limites, et son rapport à la stratégie d&apos;exploitation.
      </p>

      {/* ============================================================ */}
      <Section id="quest-ce-que" title="1. Qu'est-ce que la GTO ?">
        <Definition term="Stratégie GTO">
          stratégie qui, si adoptée par tous les joueurs, constitue un{" "}
          <strong>équilibre de Nash</strong> — aucun joueur n&apos;a intérêt à dévier
          unilatéralement.
        </Definition>

        <p>
          Une stratégie GTO est <strong>inexploitable</strong> : peu importe la stratégie
          adverse, elle garantit au minimum le résultat d&apos;équilibre. C&apos;est la
          définition mathématique du jeu &quot;solide&quot;.
        </p>

        <p>
          Attention : GTO n&apos;est pas synonyme de &quot;maximum EV&quot;. Contre un joueur
          faible, la GTO n&apos;est pas la stratégie la plus rentable — l&apos;exploitation
          l&apos;est. La GTO est le <strong>baseline</strong> défensif ; l&apos;exploitation
          est un ajustement offensif à partir de ce baseline.
        </p>

        <KeyIdea>
          GTO ≠ meilleur jeu. GTO = jeu qui garantit un floor. La différence entre &quot;ne
          pas perdre&quot; et &quot;gagner beaucoup&quot; passe par l&apos;exploitation.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="nash" title="2. Équilibre de Nash et poker">
        <Definition term="Équilibre de Nash">
          en théorie des jeux, situation où chaque joueur choisit sa stratégie{" "}
          <em>connaissant celle de l&apos;autre</em>, et où personne n&apos;a intérêt à en
          changer unilatéralement.
        </Definition>

        <p>
          Le poker Texas Hold&apos;em heads-up (2 joueurs) possède un équilibre de Nash
          <em> approximativement calculable</em>. Depuis 2015, plusieurs équipes de recherche
          (notamment Bowling et al. à l&apos;université d&apos;Alberta) ont produit des
          approximations arbitrairement précises pour le Limit Hold&apos;em heads-up. Pour NLHE
          6-max, les stratégies GTO restent approximées par les solveurs modernes.
        </p>

        <SubSection title="Concepts sous-jacents">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Jeu à somme nulle</strong> : ce qu&apos;un joueur gagne, l&apos;autre le
              perd. Le poker heads-up en est un.
            </li>
            <li>
              <strong>Information imparfaite</strong> : chaque joueur ne connaît pas les
              cartes de l&apos;adversaire. On raisonne en <strong>ranges</strong>, pas en
              mains.
            </li>
            <li>
              <strong>Stratégie mixte</strong> : au lieu de choisir une action unique dans un
              spot, on la mélange (ex : bet 70%, check 30%). C&apos;est nécessaire pour être
              inexploitable.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Le théorème du minimax">
          <p>
            Von Neumann (1928) : dans un jeu à somme nulle à 2 joueurs, il existe une paire de
            stratégies telles que si un joueur y dévie, il perd. Cette valeur d&apos;équilibre
            est unique.
          </p>
          <p>
            Appliqué au poker heads-up : il existe une &quot;valeur du jeu&quot; — le winrate
            garanti par la GTO. En NLHE HU, cette valeur est proche de zéro (jeu quasi-neutre).
            Toute déviation adverse la rend positive pour le joueur GTO.
          </p>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="gto-vs-exploit" title="3. GTO vs stratégie exploitative">
        <SubSection title="Deux philosophies opposées">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Aspect</th>
                  <th className="text-left py-2 pr-4">GTO</th>
                  <th className="text-left py-2">Exploitative</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Objectif</td>
                  <td className="py-2 pr-4">Ne pas être exploité</td>
                  <td className="py-2">Maximiser l&apos;EV contre un joueur spécifique</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Suppose sur l&apos;adversaire</td>
                  <td className="py-2 pr-4">Joueur GTO optimal</td>
                  <td className="py-2">Joueur avec un pattern identifiable</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Type de spot idéal</td>
                  <td className="py-2 pr-4">High-stakes vs regs</td>
                  <td className="py-2">Micro/low-stakes vs recreational</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Risque</td>
                  <td className="py-2 pr-4">Aucun (baseline défensif)</td>
                  <td className="py-2">Contre-exploitation si mauvaise lecture</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <Example title="Quand fold sous MDF est correct">
          <p>
            Un joueur GTO defend 66,7% face à un bet 50% pot (MDF). Face à un joueur qui ne
            bluff jamais river (fréquence de bluff = 0%), le fold rate optimal est{" "}
            <strong>100% sauf top range</strong>. Fold sous MDF = -EV théorique en GTO, mais
            correct en exploitation.
          </p>
        </Example>

        <KeyIdea>
          La GTO est robuste (jamais exploitée) mais sous-optimale face à des joueurs faibles.
          L&apos;exploit est fragile (mauvaise lecture = counter-exploit) mais explose l&apos;EV
          face aux fish. Les pros oscillent entre les deux selon leur read.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="indifference" title="4. Le principe d'indifférence">
        <Definition term="Principe d'indifférence">
          en équilibre GTO, l&apos;adversaire est indifférent entre call et fold face à ta
          mise. Son EV_call = son EV_fold = 0.
        </Definition>

        <p>
          Ce principe est central : il dicte les fréquences de bluff et de value. Pour rendre
          l&apos;adversaire indifférent, tu construis ta range de mise avec un ratio value/bluff
          précis.
        </p>

        <SubSection title="Dérivation du ratio value/bluff">
          <p>Notons :</p>
          <ul className="list-disc pl-5">
            <li><code>V</code> = fréquence de value dans ta range de bet</li>
            <li><code>B</code> = fréquence de bluff</li>
            <li><code>b</code> = ta mise, <code>P</code> = pot avant ta mise</li>
          </ul>
          <p>Son EV de call face à ta bet size b :</p>
          <Formula>
            EV_call_adv = V × (-b) + B × (P + b) <br />
            (il perd b vs value, gagne P+b vs bluff)
          </Formula>
          <p>Pour l&apos;indifférence, EV_call = 0 :</p>
          <Formula>
            V × b = B × (P + b) <br />
            B / V = b / (P + b)
          </Formula>
          <p>
            Le ratio bluff/value est exactement la fraction que la mise représente dans le pot
            total après la mise. Autrement dit :
          </p>
          <Formula>
            fréquence_bluff = bet / (pot + 2 × bet)
          </Formula>
        </SubSection>

        <Example title="Application au sizing 66% pot">
          <p>Tu bet 66$ dans un pot de 100$. Pour rendre l&apos;adversaire indifférent :</p>
          <Formula>
            bluff% = 66 / (100 + 132) = 66 / 232 ≈ <strong>28,4% de bluffs</strong> <br />
            value% ≈ 71,6%
          </Formula>
          <p>Ratio value/bluff ≈ 2,5:1. À la river, sur 10 combos de bet : 7 value, 3 bluffs.</p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="bluff-frequency" title="5. Fréquences de bluff optimales">
        <p>
          On peut résumer les fréquences de bluff optimales par sizing sur une table simple.
          Ces valeurs valent à la <strong>river</strong>, où il n&apos;y a plus de carte à
          venir donc plus d&apos;equity réalisable.
        </p>

        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Sizing</th>
                <th className="text-left py-2 pr-4">Ratio value:bluff</th>
                <th className="text-left py-2 pr-4">% value</th>
                <th className="text-left py-2">% bluff</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">25% pot</td>
                <td className="py-2 pr-4">5:1</td>
                <td className="py-2 pr-4">83,3%</td>
                <td className="py-2">16,7%</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">33% pot</td>
                <td className="py-2 pr-4">4:1</td>
                <td className="py-2 pr-4">80%</td>
                <td className="py-2">20%</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">50% pot</td>
                <td className="py-2 pr-4">3:1</td>
                <td className="py-2 pr-4">75%</td>
                <td className="py-2">25%</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">66% pot</td>
                <td className="py-2 pr-4">2,5:1</td>
                <td className="py-2 pr-4">71,4%</td>
                <td className="py-2">28,6%</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">100% pot</td>
                <td className="py-2 pr-4">2:1</td>
                <td className="py-2 pr-4">66,7%</td>
                <td className="py-2">33,3%</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">200% pot</td>
                <td className="py-2 pr-4">1,5:1</td>
                <td className="py-2 pr-4">60%</td>
                <td className="py-2">40%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubSection title="Multi-street : escompte de la fréquence de bluff">
          <p>
            Sur des streets antérieures (flop, turn), la fréquence de bluff est plus élevée
            que sur la river, parce que ton bluff a encore de la <strong>fold equity</strong> à
            venir sur les streets suivantes.
          </p>
          <p>
            Sur un flop, un solveur peut mettre 40-50% de bluffs dans sa range de c-bet, parce
            que chaque street subséquente offre encore une opportunité de fold equity ou
            d&apos;equity showdown (backdoor draws).
          </p>
        </SubSection>

        <Example title="Comment choisir les mains à bluff">
          <p>
            Toutes les mains ne sont pas égales comme bluff. Les meilleurs bluffs sont :
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Mains sans equity showdown</strong> — elles n&apos;ont rien à perdre en
              bluffant (elles perdent sinon).
            </li>
            <li>
              <strong>Mains avec blockers</strong> — elles bloquent la range de call adverse.
              Ex : Ah en main bloque AA et les flushes h de l&apos;adversaire, augmentant la
              fold equity.
            </li>
            <li>
              <strong>Mains qui débloquent les folds</strong> — l&apos;inverse : ta main
              n&apos;occupe pas les combos que l&apos;adversaire fold. Compte comme désirable.
            </li>
          </ul>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="solveurs" title="6. Solveurs modernes et leur usage">
        <p>
          Depuis 2015-2020, des logiciels comme <strong>PioSolver</strong>,{" "}
          <strong>GTO+</strong>, et <strong>GTOWizard</strong> permettent de calculer
          approximativement l&apos;équilibre GTO pour n&apos;importe quelle situation
          postflop en NLHE.
        </p>

        <SubSection title="Comment ils fonctionnent (intuition)">
          <p>
            Les solveurs utilisent des algorithmes de <strong>Counterfactual Regret
            Minimization (CFR)</strong> :
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Initialiser une stratégie aléatoire pour les deux joueurs.</li>
            <li>À chaque itération, calculer le regret de chaque action non prise.</li>
            <li>Augmenter la probabilité des actions à regret négatif.</li>
            <li>Après des millions d&apos;itérations, converger vers l&apos;équilibre.</li>
          </ol>
        </SubSection>

        <SubSection title="Ce qu'un solveur produit">
          <p>
            Une <strong>stratégie</strong> = une fréquence pour chaque action possible dans
            chaque nœud de l&apos;arbre de décision, pour chaque main dans la range.
          </p>
          <ul className="list-disc pl-5">
            <li>
              &quot;Sur A♠K♥7♦, BTN c-bet 33% pot : AK bet 100%, KK bet 100%, 88 bet 60%
              check 40%.&quot;
            </li>
            <li>
              &quot;Face à ce c-bet, BB call avec {`{sets, top pairs solides, gutshots}`},
              raise avec {`{nut flush draws, sets set}`}, fold le reste.&quot;
            </li>
          </ul>
        </SubSection>

        <SubSection title="Limites et abus">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Approximation</strong> : la GTO exacte est intractable pour NLHE 6-max.
              Les solveurs donnent des approximations proches de l&apos;équilibre.
            </li>
            <li>
              <strong>Rangefight fixe</strong> : le solveur suppose une range préflop donnée.
              Si tu joues une range différente, le résultat postflop n&apos;est plus GTO.
            </li>
            <li>
              <strong>Non applicable brut à la table</strong> : mémoriser des fréquences
              précises est impossible. On extrait des <strong>heuristiques</strong> : quelles
              mains bet, à quel sizing, sur quelles textures.
            </li>
          </ul>
          <KeyIdea>
            Un solveur n&apos;est pas un oracle. C&apos;est un microscope sur la théorie qui
            t&apos;apprend des patterns. Tu joues avec des heuristiques dérivées, pas avec des
            fréquences mémorisées.
          </KeyIdea>
        </SubSection>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>GTO = équilibre de Nash, stratégie inexploitable. C&apos;est un floor, pas un ceiling.</li>
          <li>Principe d&apos;indifférence : les fréquences GTO rendent l&apos;adversaire indifférent entre call et fold.</li>
          <li>Ratio bluff/value optimal = bet / (pot + 2×bet). Plus tu bets gros, plus tu bluff.</li>
          <li>Meilleurs bluffs : mains sans equity showdown + blockers pertinents.</li>
          <li>Solveurs = outil d&apos;étude. Tu extrais des heuristiques, pas des fréquences.</li>
          <li>Exploiter &gt; GTO face aux fish. GTO &gt; exploit face aux regs solides.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Prochain cours : Preflop avancé (3-bet, 4-bet, cold call, squeeze).
        </p>
      </div>
    </CourseLayout>
  )
}
