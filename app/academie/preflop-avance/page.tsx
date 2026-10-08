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
  { id: "sizing-open", title: "Sizing d'ouverture (open raise)" },
  { id: "3bet", title: "Le 3-bet : théorie et construction" },
  { id: "4bet", title: "Le 4-bet et l'escalade" },
  { id: "cold-call", title: "Cold call et squeeze" },
  { id: "defense-bb", title: "Défense en BB" },
  { id: "stacks", title: "Ajustements selon la profondeur de stack" },
]

export default function PreflopAvanceCourse() {
  const meta = getCourseBySlug("preflop-avance")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Ce cours couvre les décisions preflop qui séparent les regs des recreational players :
        sizing d&apos;open, construction de ranges 3-bet et 4-bet, cold call vs squeeze,
        défense en BB. Chaque section détaille la théorie sous-jacente et les fréquences
        approximatives issues des solveurs.
      </p>

      {/* ============================================================ */}
      <Section id="sizing-open" title="1. Sizing d'ouverture (open raise)">
        <p>
          En cash NLHE 6-max, les sizes standards ont convergé grâce aux solveurs :
        </p>

        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Position</th>
                <th className="text-left py-2 pr-4">Sizing standard</th>
                <th className="text-left py-2">Rationale</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">UTG / HJ / CO</td>
                <td className="py-2 pr-4">2,5bb</td>
                <td className="py-2">Risque/récompense équilibré</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">BTN</td>
                <td className="py-2 pr-4">2 - 2,25bb</td>
                <td className="py-2">Petit sizing pour maximiser la fréquence de steal</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">SB</td>
                <td className="py-2 pr-4">3 - 3,5bb</td>
                <td className="py-2">Gros sizing pour compenser l&apos;OOP postflop</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubSection title="Pourquoi le SB open plus gros ?">
          <p>
            La SB, si elle open, sera toujours OOP postflop face à la BB. Elle veut donc :
          </p>
          <ol className="list-decimal pl-5">
            <li>Décourager les call larges (elle joue OOP, ça la punit).</li>
            <li>Faire folder plus souvent BB (fold equity préflop).</li>
            <li>Réduire son SPR pour compenser son désavantage postflop.</li>
          </ol>
          <p>Le sizing gros (3bb+) sert ces trois objectifs.</p>
        </SubSection>

        <SubSection title="Le sizing BTN mini-raise">
          <p>
            En 2020+, les solveurs ont montré qu&apos;un sizing 2 - 2,25bb en BTN est optimal.
            Raisons :
          </p>
          <ul className="list-disc pl-5">
            <li>Fold équité déjà énorme (2 joueurs derrière).</li>
            <li>Une plus petite mise permet d&apos;ouvrir plus large.</li>
            <li>SPR postflop plus profond → tu joues plus de mains solidement.</li>
          </ul>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="3bet" title="2. Le 3-bet : théorie et construction">
        <Definition term="3-bet">
          re-raise face à une ouverture. Le nom vient de la séquence : blindes = bet 1, open =
          bet 2, re-raise = bet 3.
        </Definition>

        <SubSection title="Objectifs du 3-bet">
          <ul className="list-disc pl-5">
            <li>
              <strong>Value</strong> : construire un pot avec tes meilleures mains (QQ+, AK).
            </li>
            <li>
              <strong>Isoler</strong> l&apos;adversaire faible en éliminant les callers.
            </li>
            <li>
              <strong>Fold equity</strong> : faire folder les mains marginales dans sa range.
            </li>
            <li>
              <strong>Prendre l&apos;initiative</strong> : être l&apos;agresseur postflop pour
              bénéficier de la fold equity c-bet.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Sizing du 3-bet">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Situation</th>
                  <th className="text-left py-2 pr-4">Sizing (vs 2,5bb open)</th>
                  <th className="text-left py-2">Explication</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">3-bet IP (BTN vs CO)</td>
                  <td className="py-2 pr-4">8-9bb</td>
                  <td className="py-2">~3,2× le raise, laisse un SPR jouable postflop</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">3-bet OOP (BB vs BTN)</td>
                  <td className="py-2 pr-4">10-12bb</td>
                  <td className="py-2">Sizing plus gros pour compenser l&apos;OOP</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">3-bet SB vs BTN</td>
                  <td className="py-2 pr-4">11-13bb</td>
                  <td className="py-2">Encore plus gros, SPR compression</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Construction d'une range 3-bet — polarisée">
          <p>Contre un reg qui open standard, la range 3-bet standard est polarisée :</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Value</strong> : QQ+, AK (34 combos)
            </li>
            <li>
              <strong>Bluffs</strong> : Ax suited faibles (A5s-A2s), K5s-K2s, quelques
              suited connectors comme 65s-54s
            </li>
            <li>
              <strong>Absent</strong> : JJ, TT, 99, AQ, KQ (calls plutôt, ces mains sont
              &quot;linéaires&quot; et perdent en range face au 4-bet)
            </li>
          </ul>
          <p>
            Ratio value:bluff visé : ~1:1 pour un 3-bet à 3× l&apos;open. Total : ~65 combos,
            soit environ 5% des mains.
          </p>
        </SubSection>

        <Example title="Pourquoi A5s > A9s en bluff 3-bet">
          <ul className="list-disc pl-5">
            <li>
              <strong>A5s</strong> : bloque les as premium adverses (AA, AK) grâce à ton As. Fold
              equity préflop élevée. Postflop : tirage wheel + backdoor flush.
            </li>
            <li>
              <strong>A9s</strong> : mieux comme call. Domine trop de mains dans la range de
              call adverse au postflop (ATs, A8s, A7s...). En 3-bet, elle est dominée par AA,
              AK, mais bat les Ax que l&apos;adversaire fold → cohérence médiocre.
            </li>
          </ul>
          <KeyIdea>
            Un bon bluff préflop bloque la range de call/4-bet adverse. Un mauvais bluff est
            dominé par cette range et n&apos;a pas de gains postflop.
          </KeyIdea>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="4bet" title="3. Le 4-bet et l'escalade">
        <Definition term="4-bet">
          re-raise face à un 3-bet. Continue la séquence d&apos;escalade preflop.
        </Definition>

        <SubSection title="Sizing du 4-bet">
          <p>Deux écoles :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>4-bet non-all-in</strong> (2,25× le 3-bet ~22bb) : garde du room pour 5-bet
              adverse.
            </li>
            <li>
              <strong>4-bet jam</strong> (all-in) : simplifie la décision, force l&apos;adversaire
              à choisir call ou fold sans jouer postflop.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Range 4-bet standard — polarisée">
          <p>Contre un reg qui 3-bet de manière équilibrée :</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Value</strong> : QQ+, AK (34 combos)
            </li>
            <li>
              <strong>Bluffs</strong> : A5s-A2s (blockers as, désavantagés en call de 3-bet)
              — ~6-8 combos
            </li>
            <li>
              <strong>Call</strong> : JJ, TT, AQs, AKs sometimes
            </li>
          </ul>
        </SubSection>

        <Example title="Décision face à un 4-bet all-in avec AK">
          <p>
            Tu 3-bet BTN vs CO open. CO 4-bet all-in ~30bb. Pot après 4-bet = 45bb. Il te reste
            21bb à mettre pour un pot de ~66bb. Tes pot odds = 21/87 = 24,1%.
          </p>
          <p>Range 4-bet CO standard : QQ+, AK. Ton equity :</p>
          <ul className="list-disc pl-5">
            <li>vs QQ (6 combos) : 43%</li>
            <li>vs KK (3 après card removal) : 30%</li>
            <li>vs AA (3 après card removal) : 12%</li>
            <li>vs AK (autres combos) : chop ~50%</li>
          </ul>
          <Formula>
            Equity ≈ [6×43 + 3×30 + 3×12 + 9×50] / 21 ≈ (258+90+36+450)/21 ≈ <strong>39,7%</strong>
          </Formula>
          <p>
            39,7% &gt; 24,1% requis → <strong>call rentable</strong>. Sans l&apos;analyse
            combos-par-combos, on aurait pu croire &quot;AK est mort vs QQ+&quot; — faux.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="cold-call" title="4. Cold call et squeeze">
        <Definition term="Cold call">
          call d&apos;un raise préflop sans avoir déjà investi (par opposition au call en BB,
          qui a déjà investi la grosse blinde).
        </Definition>

        <Definition term="Squeeze">
          3-bet spécifiquement après un open et un ou plusieurs cold calls.
        </Definition>

        <SubSection title="Quand cold call fait sens">
          <p>
            Cold call face à un open, en position, avec une main qui préfère jouer un pot
            multiway et flopper fort :
          </p>
          <ul className="list-disc pl-5">
            <li>Suited connectors moyens (98s, 87s)</li>
            <li>Petites paires (77-22) — set mining</li>
            <li>Suited aces mid (A9s, ATs) parfois</li>
          </ul>
          <p>Mauvais cold calls en général :</p>
          <ul className="list-disc pl-5">
            <li>KJo, KTo, QJo (dominés par la range d&apos;open)</li>
            <li>Petits Ax offsuit (A9o, A8o)</li>
          </ul>
        </SubSection>

        <SubSection title="Le squeeze play">
          <p>
            Un squeeze exploite deux faiblesses : le raiseur peut fold sa main marginale, et le
            caller — qui a montré qu&apos;il n&apos;a pas les nuts — folde aussi souvent.
          </p>
          <Formula>
            Sizing squeeze IP = 2,5-3× le pot actuel (avec les callers) <br />
            Sizing squeeze OOP = 3,5-4× le pot actuel
          </Formula>
          <Example title="Squeeze BTN">
            <p>
              UTG open 2,5bb, HJ call 2,5bb. Pot = 6,5bb. Tu 3-bet BTN à 13bb (2×) ou 15bb
              (2,3×).
            </p>
            <p>
              Range de squeeze BTN : QQ+, AK en value ; A5s-A2s, KQs-KTs, quelques suited
              connectors en bluff. Total ~40 combos, environ 3% des mains.
            </p>
            <p>
              La squeeze est mécaniquement très rentable car chaque caller doit fold plus
              souvent qu&apos;un simple 3-bet (il n&apos;a pas la range d&apos;un raiseur).
            </p>
          </Example>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="defense-bb" title="5. Défense en BB">
        <p>
          La BB est la position la plus exposée au vol. Sa stratégie de défense repose sur deux
          leviers : le call très large (pot odds favorables) et le 3-bet sélectif.
        </p>

        <SubSection title="Pot odds en BB">
          <p>
            Un open à 2,5bb signifie tu payes 1,5bb (2,5 - 1) pour gagner un pot de 4bb (0,5
            SB + 2,5 open + 1 BB déjà investie). Tes pot odds : 1,5 / 5,5 = 27,3%.
          </p>
          <p>
            L&apos;equity minimum requise est faible, ce qui permet une <strong>défense
            large</strong>. Contre un BTN qui open 48% des mains, la BB peut défendre jusqu&apos;à
            ~40% de son range (call + 3-bet combinés).
          </p>
        </SubSection>

        <SubSection title="Ranges de défense BB typiques">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Vs open</th>
                  <th className="text-left py-2 pr-4">% call</th>
                  <th className="text-left py-2 pr-4">% 3-bet</th>
                  <th className="text-left py-2">% fold</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">vs UTG</td>
                  <td className="py-2 pr-4">~18%</td>
                  <td className="py-2 pr-4">~6%</td>
                  <td className="py-2">~76%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">vs CO</td>
                  <td className="py-2 pr-4">~28%</td>
                  <td className="py-2 pr-4">~9%</td>
                  <td className="py-2">~63%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">vs BTN</td>
                  <td className="py-2 pr-4">~40%</td>
                  <td className="py-2 pr-4">~13%</td>
                  <td className="py-2">~47%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">vs SB</td>
                  <td className="py-2 pr-4">~55%</td>
                  <td className="py-2 pr-4">~17%</td>
                  <td className="py-2">~28%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <KeyIdea>
          Une erreur classique : fold trop en BB face aux vols BTN/SB. Statistiquement, tu
          <em> perds moins</em> en jouant des mains marginales à 27% equity qu&apos;en foldant
          gratuitement 1bb par tour d&apos;aiguille. La défense large est un devoir mathématique,
          pas un choix de style.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="stacks" title="6. Ajustements selon la profondeur de stack">
        <p>
          Les ranges optimales varient massivement avec la profondeur des stacks (mesuré en{" "}
          <strong>bb effectifs</strong> — le plus petit des deux stacks impliqués).
        </p>

        <SubSection title="Stacks profonds (150bb+)">
          <ul className="list-disc pl-5">
            <li>Suited connectors gagnent en valeur (implied odds énormes).</li>
            <li>Petites paires idem (set mining plus rentable).</li>
            <li>Mains dominées perdent (AJo, KQo, kickers moyens).</li>
            <li>Ranges 3-bet plus polarisées (moins de mains flat).</li>
          </ul>
        </SubSection>

        <SubSection title="Stacks standards (100bb)">
          <p>C&apos;est le stack de référence pour lequel les charts GTO sont calibrés.</p>
        </SubSection>

        <SubSection title="Short stacks (30-50bb)">
          <ul className="list-disc pl-5">
            <li>Suited connectors et petites paires perdent de la valeur (moins d&apos;implied).</li>
            <li>Ranges d&apos;open plus serrées.</li>
            <li>Beaucoup de shove/fold ou 4-bet all-in devient standard.</li>
            <li>Le concept de <strong>SPR</strong> (Stack-to-Pot Ratio) devient central.</li>
          </ul>
        </SubSection>

        <SubSection title="Ultra short (&lt; 20bb)">
          <p>
            En dessous de 20bb, le jeu se transforme en push/fold. Les charts Nash pour
            heads-up all-in existent (voir le cours ICM à venir) et sont mémorisables. Chaque
            open est traité comme un raise-only-or-fold jam.
          </p>
        </SubSection>

        <Example title="Ajustement de 76s en fonction du stack">
          <ul className="list-disc pl-5">
            <li><strong>200bb</strong> : call CO open depuis BTN, main premium implied.</li>
            <li><strong>100bb</strong> : call ou 3-bet mixte (~50/50).</li>
            <li><strong>50bb</strong> : call moins fréquent, 3-bet fold peu rentable.</li>
            <li><strong>20bb</strong> : fold. Pas d&apos;implied, pas de fold equity.</li>
          </ul>
        </Example>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Sizes standards : 2,5bb (UTG-CO), 2-2,25bb (BTN), 3-3,5bb (SB).</li>
          <li>3-bet polarisé = value QQ+AK + bluff Axs faible + suited connectors.</li>
          <li>Squeeze = 3-bet après open + call(s). Sizing plus gros que 3-bet standard.</li>
          <li>Défense BB : large (~40% vs BTN), pot odds favorables.</li>
          <li>Blockers dictent le choix des bluffs (A5s bloque AA/AK).</li>
          <li>Ajustements de range en fonction de bb effectifs (deep &gt; short = moins de connectors).</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Prochain cours : Postflop — C-bet et board textures.
        </p>
      </div>
    </CourseLayout>
  )
}
