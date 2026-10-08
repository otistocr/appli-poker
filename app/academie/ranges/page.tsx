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
  { id: "shift-mental", title: "Range vs main : le shift mental" },
  { id: "construction", title: "Construire une range en combos" },
  { id: "polarisation", title: "Ranges polarisées, linéaires, condensées" },
  { id: "range-advantage", title: "Range advantage et nut advantage" },
  { id: "assignation", title: "Assigner une range à un adversaire" },
  { id: "distribution", title: "Distribution d'equity et heat map" },
]

export default function RangesCourse() {
  const meta = getCourseBySlug("ranges")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Le saut qualitatif majeur du joueur amateur au joueur solide n&apos;est pas technique :
        c&apos;est cognitif. Il consiste à cesser de raisonner sur &quot;quelle main a
        l&apos;adversaire&quot; et commencer à raisonner sur{" "}
        <strong>l&apos;ensemble des mains qu&apos;il peut avoir</strong>. Ce cours pose la
        théorie complète des ranges : construction rigoureuse en combos, taxonomie (polarisée,
        linéaire, condensée), assignation à un adversaire, et exploitation de la distribution
        d&apos;equity.
      </p>

      {/* ============================================================ */}
      <Section id="shift-mental" title="1. Range vs main : le shift mental">
        <Definition term="Range">
          ensemble des mains possibles qu&apos;un joueur peut détenir dans une situation
          donnée, pondéré par la probabilité de chaque main.
        </Definition>

        <p>
          Un joueur amateur pense : &quot;Il a AK.&quot; Un joueur solide pense : &quot;Sa
          range est {`{JJ+, AK, AQs}`}, soit 34 combos.&quot; Cette différence de granularité
          change tout.
        </p>

        <KeyIdea>
          Une main individuelle est un tirage. Une range est une distribution. Toutes les
          décisions optimales se prennent contre une <em>distribution</em>, jamais contre une
          main précise.
        </KeyIdea>

        <SubSection title="Pourquoi c'est mathématiquement nécessaire">
          <p>
            Ton adversaire n&apos;a une seule main, mais tu ne connais pas laquelle. Tu peux
            seulement estimer la <em>probabilité</em> qu&apos;il ait chacune. Si tu bases ta
            décision sur une main précise, tu commets une erreur de représentation : tu prends
            un point (une main) pour une distribution (sa range).
          </p>
          <p>
            L&apos;equity de ta main contre sa range est la moyenne pondérée :
          </p>
          <Formula>
            equity(hand vs range) = Σ (poids_i × equity(hand vs main_i)) / Σ poids_i
          </Formula>
        </SubSection>

        <Example title="AK vs range de 4-bet UTG standard">
          <p>
            Range 4-bet UTG typique : {`{QQ+, AKs, AKo}`} = 6+6+6+4+12 = <strong>34 combos</strong>.
          </p>
          <p>Ton AK vs chaque bucket :</p>
          <ul className="list-disc pl-5">
            <li>vs QQ (6 combos) : 43% d&apos;equity</li>
            <li>vs KK (6) : 30%</li>
            <li>vs AA (6) : 12%</li>
            <li>vs AKs et AKo autres combos (12 combos card removal) : 25% (chop dominance)</li>
          </ul>
          <Formula>
            Equity ≈ (6×43 + 6×30 + 6×12 + 12×25) / 30 ≈ 27,2%
          </Formula>
          <p>
            AK a 27% d&apos;equity contre une range 4-bet UTG standard. Face à un call
            all-in-preflop pot odds de 33%, c&apos;est un fold clair. Sans le raisonnement
            range, on aurait pu penser &quot;AK a 50% vs AK&quot; ou &quot;j&apos;ai 43% vs QQ,
            call&quot; — deux erreurs.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="construction" title="2. Construire une range en combos">
        <p>
          Une range se construit en <strong>énumérant les combos</strong>, pas les mains
          abstraites. C&apos;est la seule manière rigoureuse de calculer une equity.
        </p>

        <SubSection title="Rappel combinatoire">
          <ul className="list-disc pl-5">
            <li>Paire : <strong>6 combos</strong> (ex : AA = A♠A♥, A♠A♦, A♠A♣, A♥A♦, A♥A♣, A♦A♣)</li>
            <li>Main suited : <strong>4 combos</strong> (une par couleur)</li>
            <li>Main offsuit : <strong>12 combos</strong> (4 × 3)</li>
          </ul>
        </SubSection>

        <SubSection title="Range shorthand vs range explicite">
          <p>
            Convention courante en range writing :
          </p>
          <ul className="list-disc pl-5">
            <li>
              <code className="bg-neutral-800 px-1 rounded">JJ+</code> = JJ, QQ, KK, AA (24
              combos)
            </li>
            <li>
              <code className="bg-neutral-800 px-1 rounded">AJs+</code> = AJs, AQs, AKs (12
              combos)
            </li>
            <li>
              <code className="bg-neutral-800 px-1 rounded">KQo</code> = 12 combos
            </li>
            <li>
              <code className="bg-neutral-800 px-1 rounded">76s-54s</code> = 76s, 65s, 54s (12
              combos)
            </li>
          </ul>
        </SubSection>

        <SubSection title="Card removal (blockers)">
          <Definition term="Card removal">
            effet des cartes que tu possèdes ou que tu vois au board sur le nombre de combos
            possibles dans la range adverse.
          </Definition>

          <Example title="AA dans la range adverse quand tu as A♥K♦">
            <p>
              Une AA normale a 6 combos. Mais tu détiens l&apos;A♥. L&apos;adversaire ne peut
              donc pas avoir A♥A♠, A♥A♦, A♥A♣. Il ne reste que 3 combos possibles pour AA :
              A♠A♦, A♠A♣, A♦A♣.
            </p>
            <Formula>
              Combos AA restants = C(3, 2) = 3 combos (au lieu de 6)
            </Formula>
            <p>
              Ton A joue comme un blocker vs les As adverses. Cette information est
              critique pour les décisions face à des ranges polarisées.
            </p>
          </Example>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="polarisation" title="3. Ranges polarisées, linéaires, condensées">
        <p>
          On classe les ranges selon leur <strong>distribution de force</strong> par rapport à
          une range de call adverse.
        </p>

        <SubSection title="Range polarisée">
          <Definition term="Range polarisée">
            composée uniquement de mains très fortes (nuts) et de bluffs, avec peu ou pas de
            mains moyennes.
          </Definition>

          <p>
            <strong>Distribution typique</strong> : ~40% value + ~60% bluffs, ou l&apos;inverse
            selon la street. Pas de mains &quot;mid-range&quot;.
          </p>

          <p>
            <strong>Quand l&apos;utiliser</strong> : à la river, ou dans des spots où le raise
            se justifie soit pour extraire de la value, soit pour faire folder — pas pour
            &quot;protéger&quot; une paire moyenne.
          </p>

          <Example title="3-bet polarisé BTN vs CO open">
            <p>
              BTN 3-bet CO open avec une range polarisée type :
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Value</strong> : AA, KK, QQ, JJ, AK — 34 combos
              </li>
              <li>
                <strong>Bluffs</strong> : A5s-A2s, K9s, Q9s, quelques suited connectors comme
                65s, 54s — ~30 combos
              </li>
              <li>
                <strong>Absent</strong> : TT, AQ, KQ, AJ (mains moyennes qui préfèrent call)
              </li>
            </ul>
          </Example>
        </SubSection>

        <SubSection title="Range linéaire (mergée)">
          <Definition term="Range linéaire">
            composée des <strong>top X% des mains</strong>, contiguë en force. Elle inclut les
            mains fortes et moyennes-fortes, sans bluffs volontaires.
          </Definition>

          <p>
            <strong>Quand l&apos;utiliser</strong> : contre un opposant faible qui call trop
            large et fold peu. Le bluff est inutile (fold equity trop basse), il faut se
            contenter d&apos;extraire de la value.
          </p>

          <Example title="3-bet linéaire vs fish">
            <p>
              Contre un fish qui call énormément, la range 3-bet devient : {`{QQ+, AK, AQ, JJ,
              TT}`}. Tu élimines les bluffs (inutiles) et tu élargis en value.
            </p>
          </Example>
        </SubSection>

        <SubSection title="Range condensée (capped)">
          <Definition term="Range condensée">
            composée majoritairement de mains moyennes, sans les nuts. Elle est
            &quot;capped&quot; — l&apos;adversaire sait que tu ne peux pas avoir de main très
            forte.
          </Definition>

          <p>
            <strong>Contexte typique</strong> : quelqu&apos;un flat-call preflop (ne re-raise
            pas) → sa range est capped car les meilleures mains auraient 3-bet.
          </p>

          <p>
            <strong>Faiblesse</strong> : une range capped se fait exploiter par des overbets à
            la river ou par des raises polarisés.
          </p>

          <KeyIdea>
            Reconnaître une range condensée adverse = savoir qu&apos;on peut la battre par
            pression : mise énorme = value ou bluff, et il n&apos;a que du mid pour te payer.
          </KeyIdea>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="range-advantage" title="4. Range advantage et nut advantage">
        <Definition term="Range advantage">
          equity moyenne d&apos;une range totale contre une autre range totale, sur un board
          donné.
        </Definition>

        <Definition term="Nut advantage">
          fréquence des mains très fortes (nuts + near-nuts) qu&apos;une range détient sur un
          board donné, par rapport à l&apos;autre.
        </Definition>

        <p>
          Les deux avantages ne coïncident pas toujours, et le choix des sizings postflop en
          dépend.
        </p>

        <Example title="Flop A♠K♥7♦, BTN vs BB">
          <p>Range BTN open standard : 48% des mains. Range BB défense vs BTN open : ~40%.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Range advantage</strong> : BTN ~54% equity global. Léger.
            </li>
            <li>
              <strong>Nut advantage</strong> : BTN a AA, KK, AK, AKs, tous les set A-K-7. BB a
              rarement AK ou AA (ces mains auraient 3-bet). <strong>Massif.</strong>
            </li>
          </ul>
          <p>
            Conséquence stratégique : BTN peut c-bet <strong>petit à haute fréquence</strong>{" "}
            (33% pot, ~85% fréquence) parce que le nut advantage lui permet de miser toute sa
            range sans risque de check-raise catastrophique. BB defend serré.
          </p>
        </Example>

        <Example title="Flop 8♥7♦6♥, BTN vs BB">
          <p>Board très dynamique, texture qui favorise les suited connectors et les tirages.</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Range advantage</strong> : proche 50/50, léger avantage BB (BB defend avec
              beaucoup de suited connectors).
            </li>
            <li>
              <strong>Nut advantage</strong> : BB en a plus — 98, 87, 76, 65, 54 sont dans son
              range de call BB, pas fréquents dans BTN open.
            </li>
          </ul>
          <p>
            Conséquence : BTN c-bet <strong>plus rarement</strong> (~50%), avec un sizing plus
            gros (66-75% pot) sur les mains qu&apos;il choisit de bet. Il check-back son mid
            range pour se protéger du check-raise.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="assignation" title="5. Assigner une range à un adversaire">
        <p>
          À la table, tu construis progressivement la range adverse à partir de ses actions.
          C&apos;est un processus séquentiel : chaque action réduit ou pondère les combos.
        </p>

        <SubSection title="Étape 1 — Range preflop initiale">
          <p>
            Sa position + son type de joueur donnent une range initiale de départ. Ex : reg
            solide UTG open → ~15% top range.
          </p>
        </SubSection>

        <SubSection title="Étape 2 — Actualisation postflop">
          <p>Chaque action met à jour les poids :</p>
          <ul className="list-disc pl-5">
            <li>
              Il c-bet flop A♥K♦2♠ 33% pot : sa range de c-bet est ~80% de sa range initiale
              (les mains très faibles fold parfois).
            </li>
            <li>
              Il barrels 60% pot turn (blank 5♠) : sa range se resserre. Il conserve les paires
              d&apos;A, KK, AK, plus quelques bluffs (KJs, KQs qui ont equity + backdoor).
            </li>
            <li>
              Il overbet river : sa range se polarise en value {`{AK+, sets}`} + bluffs
              {` {KQs, KJs qui ont raté leur draw}`}.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Étape 3 — Pondération">
          <p>
            Toutes les mains ne sont pas également probables. Un adversaire peut avoir 60% de
            chances de bet AA au flop mais 90% de chances de bet ses sets. Ces poids se
            multiplient à chaque street.
          </p>
          <Formula>
            poids_final = poids_preflop × P(action_flop | main) × P(action_turn | main) × ...
          </Formula>
        </SubSection>

        <KeyIdea>
          Une bonne assignation de range se fait <strong>avant</strong> ton tour de jouer, pas
          après. À la river, ta décision de call/fold repose sur la range que tu as construite
          street par street. Si tu improvises au moment de call, tu joues à l&apos;instinct.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="distribution" title="6. Distribution d'equity et heat map">
        <p>
          Une range n&apos;a pas une equity uniforme sur un board. On peut la décomposer en
          <strong> équité par bucket</strong> :
        </p>

        <SubSection title="Buckets d'equity">
          <ul className="list-disc pl-5">
            <li>
              <strong>Nuts (top 5%)</strong> : quads, top set, straights nuts. Value bet street
              par street.
            </li>
            <li>
              <strong>Strong value (5-25%)</strong> : top pair top kicker, overpair sur board
              sec. 3 streets de value bet standard.
            </li>
            <li>
              <strong>Mid range (25-60%)</strong> : middle pair, top pair kicker faible.
              Contrôle de pot.
            </li>
            <li>
              <strong>Weak showdown (60-80%)</strong> : underpair, bottom pair. Check-call ou
              give up.
            </li>
            <li>
              <strong>Air / bluffs (80-100%)</strong> : rien, mais avec fold equity via bluff.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Le principe de balance">
          <p>
            En stratégie GTO, chaque bucket doit apparaître dans chaque ligne de bet à une
            fréquence optimale. Sinon la stratégie est exploitable :
          </p>
          <ul className="list-disc pl-5">
            <li>Trop de value dans ta ligne bet-bet-bet : adversaire fold tout sauf nuts → tu perds la value.</li>
            <li>Trop de bluffs : adversaire call léger → tes bluffs deviennent -EV.</li>
          </ul>
          <Formula>
            Ratio value/bluff optimal river = pot_odds_adverses / (1 + pot_odds_adverses)
          </Formula>
          <p>
            Ex : à la river, tu overbet pot (sizing 100%). L&apos;adversaire a 33% pot odds. Ta
            fréquence de value/bluff optimale : 66% value, 33% bluffs (ratio 2:1).
          </p>
        </SubSection>

        <Example title="Ratio value/bluff par sizing">
          <ul className="list-disc pl-5">
            <li>Bet 33% pot → 3:1 value : bluff (75/25%)</li>
            <li>Bet 66% pot → 5:3 value : bluff (~62/38%)</li>
            <li>Bet pot (100%) → 2:1 value : bluff (~67/33%)</li>
            <li>Overbet 150% pot → 5:3 value : bluff (~62/38%)</li>
          </ul>
          <p>
            Ces ratios sont ce que le solveur applique à sa river betting range pour être
            unexploitable. Un joueur qui bet river à 50% pot avec 90% de value et 10% de
            bluffs est exploitable (il faut alors fold plus).
          </p>
        </Example>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir de ce cours :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Une range est une distribution pondérée, pas une main.</li>
          <li>Compter en combos (6 / 4 / 12) — toujours.</li>
          <li>Card removal réduit les combos possibles adverses (blockers).</li>
          <li>Polarisée (value + bluff) vs linéaire (top X%) vs condensée (capped, mid).</li>
          <li>Range advantage ≠ Nut advantage. Les deux dictent le sizing postflop.</li>
          <li>La ratio value/bluff optimal dépend du sizing (bet 33% → 3:1 ; bet 100% → 2:1).</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Prochain cours : Pot odds, equity et implied odds (approfondissement).
        </p>
      </div>
    </CourseLayout>
  )
}
