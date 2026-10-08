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
  { id: "positions", title: "Les six positions à table" },
  { id: "information", title: "L'avantage informationnel" },
  { id: "absolue-relative", title: "Position absolue vs relative" },
  { id: "ranges", title: "Impact sur les ranges d'ouverture" },
  { id: "postflop", title: "Position postflop : IP vs OOP" },
  { id: "valeur", title: "La valeur monétaire de la position" },
]

export default function PositionCourse() {
  const meta = getCourseBySlug("position")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        La position est probablement le facteur le plus sous-estimé chez les joueurs débutants,
        et le plus fondamental chez les pros. Deux joueurs de même skill qui échangent leur
        siège autour de la table auraient des winrates radicalement différents. Ce cours
        décortique pourquoi, avec des données chiffrées, et comment ajuster tes ranges en
        conséquence.
      </p>

      {/* ============================================================ */}
      <Section id="positions" title="1. Les six positions à table (6-max)">
        <p>
          À une table 6-max NLHE, l&apos;action se déroule dans un ordre fixe autour du bouton
          (dealer). Les positions, dans l&apos;ordre de parole preflop après les blindes :
        </p>

        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Position</th>
                <th className="text-left py-2 pr-4">Abréviation</th>
                <th className="text-left py-2 pr-4">Rôle</th>
                <th className="text-left py-2">Ordre preflop</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Under The Gun</td>
                <td className="py-2 pr-4 font-mono">UTG</td>
                <td className="py-2 pr-4">Premier à parler</td>
                <td className="py-2">1er</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Hijack</td>
                <td className="py-2 pr-4 font-mono">HJ</td>
                <td className="py-2 pr-4">Milieu</td>
                <td className="py-2">2ème</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Cutoff</td>
                <td className="py-2 pr-4 font-mono">CO</td>
                <td className="py-2 pr-4">Avant-bouton</td>
                <td className="py-2">3ème</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Button</td>
                <td className="py-2 pr-4 font-mono">BTN</td>
                <td className="py-2 pr-4">Dernier IP postflop</td>
                <td className="py-2">4ème</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Small Blind</td>
                <td className="py-2 pr-4 font-mono">SB</td>
                <td className="py-2 pr-4">Force à miser 0,5bb</td>
                <td className="py-2">5ème</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Big Blind</td>
                <td className="py-2 pr-4 font-mono">BB</td>
                <td className="py-2 pr-4">Force à miser 1bb, dernier preflop</td>
                <td className="py-2">6ème preflop, 1er postflop</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          À une table 9 joueurs (full ring), on ajoute UTG+1, UTG+2 (MP) et LJ (Lojack) avant
          le HJ. Les principes stratégiques restent identiques : la position postflop est
          toujours définie par la proximité avec le BTN.
        </p>
      </Section>

      {/* ============================================================ */}
      <Section id="information" title="2. L'avantage informationnel de la position">
        <KeyIdea>
          Jouer en position (IP), c&apos;est agir <strong>après</strong> son adversaire à
          chaque street postflop. Cette asymétrie d&apos;information transforme fondamentalement
          la qualité des décisions.
        </KeyIdea>

        <SubSection title="Ce que la position te donne">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Information gratuite</strong> — tu observes son action (bet, check,
              size) avant de décider. Un check révèle qu&apos;il n&apos;a probablement pas de
              main forte ; un bet cible d&apos;autres infos (size = strength).
            </li>
            <li>
              <strong>Contrôle du pot</strong> — tu décides si le pot grossit (raise) ou reste
              petit (check derrière avec ta main marginale).
            </li>
            <li>
              <strong>Réalisation d&apos;equity supérieure</strong> — tes mains marginales
              (paire faible, tirage) réalisent plus souvent leur equity théorique parce que tu
              peux checker gratuitement et voir la street suivante.
            </li>
            <li>
              <strong>Bluff plus efficace</strong> — l&apos;adversaire OOP doit deviner ta main
              sans info supplémentaire. Ton bluff a plus de fold equity.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Réalisation d'equity (R%)">
          <Definition term="Réalisation d'equity">
            proportion de l&apos;equity théorique qu&apos;une main capture réellement au
            showdown. Une equity de 30% peut se traduire par 25% de gains réels (sous-réalisée)
            ou 35% (sur-réalisée), selon la position et la structure du coup.
          </Definition>

          <p>Estimations empiriques (solveurs modernes, cash 100bb) :</p>
          <ul className="list-disc pl-5">
            <li>Main forte IP : réalise ~102-105% de son equity théorique</li>
            <li>Main marginale IP : ~95-100%</li>
            <li>Main marginale OOP : ~80-90%</li>
            <li>Main faible OOP : peut chuter à 70% ou moins</li>
          </ul>

          <p>
            C&apos;est la raison mathématique pour laquelle la même main (ex : 9♠8♠) vaut le
            call en BTN et le fold en UTG face à un raise : sa réalisation d&apos;equity change
            de 15-20% entre les deux.
          </p>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="absolue-relative" title="3. Position absolue vs position relative">
        <Definition term="Position absolue">
          ta place autour du bouton (UTG, HJ, ..., BB).
        </Definition>

        <Definition term="Position relative">
          ta place par rapport à l&apos;<strong>agresseur preflop</strong> dans un pot
          multiway. Elle détermine qui agit avant qui, indépendamment du BTN.
        </Definition>

        <Example title="Position relative dans un pot 3-way">
          <p>
            HJ open, BTN call, BB call. On voit le flop à 3. Position absolue : BTN dernier
            postflop. Mais position relative :
          </p>
          <ul className="list-disc pl-5">
            <li>BB parle en premier (OOP vs le raiseur et le caller)</li>
            <li>
              HJ parle ensuite — il est <strong>en position relative</strong> vs BB, mais OOP
              vs BTN.
            </li>
            <li>
              BTN parle dernier — position absolue <em>et</em> relative maximale.
            </li>
          </ul>
          <p>
            Le HJ (raiseur original) est &quot;sandwich&quot; : BB peut check-raise, BTN peut
            attendre son action pour raise derrière. Sa position relative est mauvaise malgré
            un stack et une range initiale plus forte.
          </p>
        </Example>

        <KeyIdea>
          Dans un pot multiway, l&apos;agresseur preflop n&apos;a pas toujours l&apos;avantage
          postflop. Le joueur qui parle après lui contrôle la dynamique.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="ranges" title="4. Impact sur les ranges d'ouverture (RFI)">
        <p>
          Puisque la position détermine la réalisation d&apos;equity et la fréquence de subir
          des 3-bets, les ranges d&apos;ouverture optimales varient dramatiquement selon la
          position. Voici les fréquences GTO approximatives en cash 6-max 100bb :
        </p>

        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Position</th>
                <th className="text-left py-2 pr-4">% de mains ouvertes</th>
                <th className="text-left py-2">Rationale</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">UTG</td>
                <td className="py-2 pr-4">~15%</td>
                <td className="py-2">5 joueurs derrière, risque max de 3-bet, OOP fréquent</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">HJ</td>
                <td className="py-2 pr-4">~20%</td>
                <td className="py-2">4 joueurs derrière</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">CO</td>
                <td className="py-2 pr-4">~27%</td>
                <td className="py-2">3 joueurs derrière, souvent IP postflop</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">BTN</td>
                <td className="py-2 pr-4">~48%</td>
                <td className="py-2">Toujours IP postflop, seules les blindes derrière</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">SB</td>
                <td className="py-2 pr-4">~35-40%</td>
                <td className="py-2">Un seul joueur derrière (BB), mais OOP postflop</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubSection title="Pourquoi le BTN ouvre 3x plus que UTG ?">
          <p>Trois raisons cumulatives :</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Moins d&apos;adversaires potentiels</strong> — 2 joueurs derrière contre
              5 en UTG. Le risque d&apos;être 3-bet est mécaniquement plus faible (statistique
              du &quot;au moins un joueur a une main forte&quot;).
            </li>
            <li>
              <strong>Position postflop garantie</strong> — le BTN reste IP contre les blindes,
              donc sa réalisation d&apos;equity est supérieure sur toute la suite de la main.
            </li>
            <li>
              <strong>Steal des blindes</strong> — les blindes ont un range de défense limité
              et souvent OOP. L&apos;EV de vol des 1,5bb dans le pot est +EV avec beaucoup de
              mains marginales.
            </li>
          </ol>
        </SubSection>

        <Example title="76s : call ou fold selon la position ?">
          <p>76s est une main classique &quot;position-sensitive&quot; :</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>UTG</strong> : fold. Trop de risque de subir un 3-bet OOP, réalisation
              d&apos;equity médiocre multiway.
            </li>
            <li>
              <strong>CO</strong> : raise mixte (~70%). Range advantage + IP postflop 4 fois
              sur 5.
            </li>
            <li>
              <strong>BTN</strong> : raise 100%. Ouverture rentable même face aux blindes.
            </li>
          </ul>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="postflop" title="5. Position postflop : IP vs OOP">
        <p>
          L&apos;écart de winrate entre jouer IP et OOP est massif. Un raiseur preflop en BTN
          gagne significativement plus qu&apos;en OOP même contre la même range de call.
        </p>

        <SubSection title="Stratégie IP standard">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>C-bet mid-range fréquemment</strong> sur les flops où ton range advantage
              est net (ex : A-high, K-high).
            </li>
            <li>
              <strong>Check back souvent les mains moyennes</strong> pour contrôler le pot et
              exploiter l&apos;info sur les streets suivantes.
            </li>
            <li>
              <strong>Bluff plus fort à la river</strong> avec des mains qui ont fold equity
              et pas d&apos;equity showdown.
            </li>
            <li>
              <strong>Value bet plus fin</strong> — tu peux miser trois streets thin parce
              qu&apos;il ne peut pas te check-raise proactivement.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Stratégie OOP standard">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Check-raise plus fréquemment</strong> pour compenser l&apos;absence
              d&apos;info : c&apos;est ton seul outil pour construire un pot en avantage.
            </li>
            <li>
              <strong>Donk-bet rarement</strong> (mener OOP le flop) — sauf dans des spots
              spécifiques (flops qui favorisent nettement ta range vs la sienne).
            </li>
            <li>
              <strong>Polariser tes lignes</strong> : miser fort avec ton top range et bluff,
              checker le milieu.
            </li>
            <li>
              <strong>Défendre &quot;tight&quot;</strong> les tailles de bet élevées puisque
              tu ne pourras pas réaliser ton equity IP.
            </li>
          </ul>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="valeur" title="6. La valeur monétaire de la position">
        <p>
          Les études sur bases de données de millions de mains (par ex. PokerTracker
          aggregates) donnent des winrates moyens par position pour les regs profitables NL50-NL200 :
        </p>

        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Position</th>
                <th className="text-left py-2">Winrate (bb/100)</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">BTN</td>
                <td className="py-2">+15 à +25</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">CO</td>
                <td className="py-2">+8 à +15</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">HJ</td>
                <td className="py-2">+3 à +8</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">UTG</td>
                <td className="py-2">-2 à +2 (proche de breakeven)</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4 font-mono">SB</td>
                <td className="py-2">-8 à -12</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">BB</td>
                <td className="py-2">-25 à -40 (mais ~40% des mains hors blindes)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <KeyIdea>
          La BB perd toujours en moyenne, même chez les meilleurs joueurs du monde. La
          question stratégique n&apos;est jamais &quot;comment gagner en BB&quot; mais{" "}
          <strong>&quot;comment perdre le moins possible&quot;</strong>. La différence entre
          -25 bb/100 (top pro) et -60 bb/100 (joueur médiocre) est 35 bb/100 de winrate global
          effectif — plus que ce que gagne le pro en BTN.
        </KeyIdea>

        <SubSection title="La règle du 60/40">
          <p>
            Statistiquement, sur 6 mains à une table 6-max, tu joues 2 mains &quot;offertes&quot;
            (BTN + CO) et 2 mains &quot;subies&quot; (SB + BB). Les regs professionnels tirent
            l&apos;essentiel de leur profit des positions BTN/CO et minimisent les pertes SB/BB.
          </p>
          <Formula>
            Profit global ≈ 60% × EV_BTN+CO + 40% × EV_UTG+HJ - pertes_SB+BB
          </Formula>
        </SubSection>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir de ce cours :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>La position détermine l&apos;ordre d&apos;action et donc la qualité de l&apos;info disponible.</li>
          <li>Position absolue (autour du BTN) ≠ position relative (vs le raiseur preflop).</li>
          <li>Range d&apos;ouverture GTO scale de ~15% (UTG) à ~48% (BTN).</li>
          <li>Une même main réalise 15-20% plus d&apos;equity IP que OOP.</li>
          <li>Le profit d&apos;un reg vient de BTN + CO ; SB et BB sont des pertes structurelles.</li>
          <li>Bluffs et value bets sont plus rentables IP.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Prochain cours : Penser en ranges.
        </p>
      </div>
    </CourseLayout>
  )
}
