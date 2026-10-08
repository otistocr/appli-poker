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
  { id: "cbet", title: "Le c-bet : théorie et fondements" },
  { id: "textures", title: "Board textures : classification" },
  { id: "sizings", title: "Choix du sizing par texture" },
  { id: "turn", title: "Turn play : double barrel et give-up" },
  { id: "river", title: "River : polarisation et bluff catcher" },
  { id: "spr", title: "SPR — Stack-to-Pot Ratio" },
]

export default function PostflopCourse() {
  const meta = getCourseBySlug("postflop")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Le postflop est la phase où l&apos;on gagne ou perd la majorité de l&apos;argent au
        poker. Ce cours pose les fondations : théorie du c-bet, classification des textures
        de board, choix du sizing, dynamique turn/river, et le concept structurant du{" "}
        <strong>SPR</strong> qui gouverne toutes les décisions postflop.
      </p>

      {/* ============================================================ */}
      <Section id="cbet" title="1. Le c-bet : théorie et fondements">
        <Definition term="C-bet (continuation bet)">
          mise du raiseur préflop sur le flop, indépendamment de la texture ou de la force de sa
          main. Continue l&apos;agression initiée préflop.
        </Definition>

        <SubSection title="Pourquoi le c-bet fonctionne">
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              <strong>Range advantage</strong> : le raiseur préflop a une range top-heavy,
              biaisée vers les fortes overpairs et top-pair top-kicker.
            </li>
            <li>
              <strong>Adversaire miss souvent</strong> : ~65% du temps, une main ne touche pas
              une paire au flop. Ta mise récolte le pot immédiatement.
            </li>
            <li>
              <strong>Momentum d&apos;agression</strong> : le raiseur préflop &quot;raconte
              une histoire&quot; cohérente en misant flop.
            </li>
          </ol>
        </SubSection>

        <SubSection title="Fréquence GTO du c-bet">
          <p>
            Contrairement à l&apos;idée reçue &quot;c-bet toujours&quot;, les solveurs
            modernes montrent que la fréquence optimale varie fortement selon la texture :
          </p>
          <ul className="list-disc pl-5">
            <li>Boards A-high secs (A♠7♦2♣) : c-bet 85-100% de la range à petit sizing</li>
            <li>Boards K-high secs (K♠8♦3♣) : c-bet 65-80%</li>
            <li>Boards dynamiques (T♠9♥8♦) : c-bet 30-50%, souvent en gros sizing</li>
            <li>Boards low connected (7♥6♥5♠) : c-bet ~35%, majoritairement check</li>
          </ul>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="textures" title="2. Board textures : classification">
        <p>
          On classe les flops selon plusieurs axes qui déterminent la stratégie optimale.
        </p>

        <SubSection title="Axe 1 — Dry vs Wet">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Type</th>
                  <th className="text-left py-2 pr-4">Caractéristique</th>
                  <th className="text-left py-2">Exemple</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Dry</td>
                  <td className="py-2 pr-4">Peu de tirages, peu de connectivité</td>
                  <td className="py-2">A♠7♦2♣, K♠8♥3♦</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Semi-wet</td>
                  <td className="py-2 pr-4">Un tirage possible (flush ou straight)</td>
                  <td className="py-2">K♥J♦4♣, T♠9♦2♠</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Wet</td>
                  <td className="py-2 pr-4">Multiples tirages, forte connectivité</td>
                  <td className="py-2">9♠8♠7♦, T♥9♥6♠</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Axe 2 — High vs Low">
          <ul className="list-disc pl-5">
            <li>
              <strong>High</strong> (A, K, Q high) : favorise le raiseur préflop (range top-heavy).
            </li>
            <li>
              <strong>Middle</strong> (J, T, 9 high) : équilibre, dépend de qui defend.
            </li>
            <li>
              <strong>Low</strong> (8, 7 ou moins high) : favorise le défenseur (BB) qui a plus
              de suited connectors et petites paires.
            </li>
          </ul>
        </SubSection>

        <SubSection title="Axe 3 — Paired vs unpaired">
          <ul className="list-disc pl-5">
            <li>
              <strong>Paired</strong> (K♠K♥6♦, 8♠8♦2♣) : très peu de mains touchent
              directement, la MDF chute, c-bet à haute fréquence en petit sizing.
            </li>
            <li>
              <strong>Trips-heavy</strong> : peu de tirages, souvent check-back optimale pour
              piéger l&apos;adversaire qui n&apos;a rien.
            </li>
          </ul>
        </SubSection>

        <Example title="Comparaison A♠7♦2♣ vs 9♠8♠7♦">
          <p>
            <strong>A♠7♦2♣</strong> : range advantage massive BTN. Il c-bet ~90% à 33% pot. La
            plupart des mains BB fold. Simple.
          </p>
          <p>
            <strong>9♠8♠7♦</strong> : range advantage neutre. Le BB a autant de sets et de
            straights que le BTN. BTN c-bet ~40% seulement, à 66-75% pot, avec ses top range
            polarisée + bluffs qui ont un backdoor draw fort.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="sizings" title="3. Choix du sizing par texture">
        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Texture</th>
                <th className="text-left py-2 pr-4">Sizing standard</th>
                <th className="text-left py-2 pr-4">Fréquence</th>
                <th className="text-left py-2">Rationale</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Dry high (A high)</td>
                <td className="py-2 pr-4">25-33% pot</td>
                <td className="py-2 pr-4">85-95%</td>
                <td className="py-2">Range advantage massif, sizing petit maximise fréquence</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Dry K/Q high</td>
                <td className="py-2 pr-4">33% pot</td>
                <td className="py-2 pr-4">70-85%</td>
                <td className="py-2">Encore dominant en range, mais moins</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Semi-wet</td>
                <td className="py-2 pr-4">50% pot</td>
                <td className="py-2 pr-4">50-65%</td>
                <td className="py-2">Range advantage réduit, sizing moyen pour protection</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Wet dynamique</td>
                <td className="py-2 pr-4">66-75% pot</td>
                <td className="py-2 pr-4">30-50%</td>
                <td className="py-2">Range advantage souvent nul, on bet polarisé</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Paired</td>
                <td className="py-2 pr-4">25% pot</td>
                <td className="py-2 pr-4">90-100%</td>
                <td className="py-2">Fold equity énorme, MDF chute, petit sizing suffit</td>
              </tr>
            </tbody>
          </table>
        </div>

        <KeyIdea>
          <strong>Petit sizing + haute fréquence</strong> vs <strong>gros sizing + basse
          fréquence</strong> : ces deux stratégies sont mathématiquement équivalentes en EV
          sur un board donné. Le solveur choisit celui qui maximise l&apos;info à extraire de
          la turn et minimise l&apos;exploitabilité.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="turn" title="4. Turn play : double barrel et give-up">
        <p>
          À la turn, la carte modifie le range advantage et les fréquences. Trois catégories
          de cartes turn :
        </p>

        <SubSection title="Cartes qui favorisent l'agresseur (barrel cards)">
          <p>
            Une carte qui améliore le top de la range du raiseur ou qui n&apos;améliore rien
            dans la range du défenseur.
          </p>
          <ul className="list-disc pl-5">
            <li>Ex : A♠7♦2♣ → turn K♥ : le raiseur ajoute KK, AK. Barrel fort recommandé.</li>
            <li>Ex : K♠8♦3♣ → turn 2♠ : blank, le raiseur continue son agression.</li>
          </ul>
        </SubSection>

        <SubSection title="Cartes qui favorisent le défenseur">
          <p>Une carte qui complète des tirages du défenseur ou améliore ses paires basses.</p>
          <ul className="list-disc pl-5">
            <li>Ex : A♠7♦2♣ → turn 5♣ : gutshot du défenseur, straight potentiel. Check plus fréquent.</li>
            <li>Ex : K♠8♦3♣ → turn 4♠ : flush draw arrive. Check-back plus souvent.</li>
          </ul>
        </SubSection>

        <SubSection title="Turn barrel : quelles mains choisir">
          <p>La sélection des mains pour barrel turn suit deux critères :</p>
          <ol className="list-decimal pl-5">
            <li>
              <strong>Value</strong> : top pair top kicker, overpair. Sizing 66-75% pot pour
              charger les tirages.
            </li>
            <li>
              <strong>Bluffs</strong> : mains sans equity showdown mais avec fold equity
              résiduelle sur river. Idéalement backdoor draws pour ajouter equity.
            </li>
          </ol>
        </SubSection>

        <Example title="Turn barrel sur A♠7♦2♣ 5♦">
          <p>
            Flop c-bet 33% avec range large. Turn 5♦ ajoute un flush draw. Actions :
          </p>
          <ul className="list-disc pl-5">
            <li>AA, AK, A7 : barrel 66% pot (value + protection vs flush draw)</li>
            <li>KK, QQ : barrel 66% (protection value)</li>
            <li>KsQs (no showdown, flush draw + fold equity) : barrel 66% en bluff</li>
            <li>QJo (no showdown, no equity) : give up (check)</li>
          </ul>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="river" title="5. River : polarisation et bluff catcher">
        <p>
          À la river, plus d&apos;equity à gérer. La décision est binaire à ce point : mains à
          bet (value + bluff polarisés), mains à check (bluff catchers).
        </p>

        <SubSection title="Range de bet river = polarisation stricte">
          <ul className="list-disc pl-5">
            <li>
              <strong>Value bet</strong> : mains qui battent la range de call adverse (top of
              range).
            </li>
            <li>
              <strong>Bluffs</strong> : mains sans equity showdown (busted draws
              principalement).
            </li>
            <li>
              <strong>Absent</strong> : mid-range (bluff catchers, top pair kicker faible).
            </li>
          </ul>
          <p>Ratio value:bluff dicté par le sizing (voir cours GTO).</p>
        </SubSection>

        <SubSection title="Bluff catcher : décision de call">
          <Definition term="Bluff catcher">
            main qui bat uniquement les bluffs de l&apos;adversaire (perd contre sa value). Ex :
            paire moyenne sur un board scary.
          </Definition>

          <p>
            La décision de call avec un bluff catcher dépend uniquement de la{" "}
            <strong>fréquence de bluff estimée</strong> de l&apos;adversaire, comparée à
            l&apos;alpha du sizing.
          </p>
          <Formula>
            call bluff catcher : rentable si fréquence_bluff_adv &gt; alpha <br />
            où alpha = bet / (pot + bet)
          </Formula>

          <Example title="Face à un bet 66% pot river">
            <p>
              Alpha = 66 / 166 = 39,7%. Si tu estimes que l&apos;adversaire bluff plus de
              39,7% du temps dans cette ligne, call ton bluff catcher est +EV. Sinon, fold.
            </p>
          </Example>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="spr" title="6. SPR — Stack-to-Pot Ratio">
        <Definition term="SPR">
          rapport entre le stack effectif restant et la taille du pot au début du postflop.
        </Definition>

        <Formula>
          SPR = stack_effectif_restant / pot_flop
        </Formula>

        <p>
          Le SPR gouverne implicitement la structure du reste de la main. Il détermine si tu
          joues un pot pot-committed (SPR &lt; 3) ou deep-stacked (SPR &gt; 10).
        </p>

        <SubSection title="Interprétation du SPR">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">SPR</th>
                  <th className="text-left py-2 pr-4">Type de pot</th>
                  <th className="text-left py-2">Stratégie</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">&lt; 1</td>
                  <td className="py-2 pr-4">Committed</td>
                  <td className="py-2">Jam ou call. Une paire suffit souvent.</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">1 - 3</td>
                  <td className="py-2 pr-4">Short SPR</td>
                  <td className="py-2">Top pair + kicker = jam. Peu de room pour bluff.</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">4 - 10</td>
                  <td className="py-2 pr-4">Medium SPR (standard)</td>
                  <td className="py-2">Jeu normal, ranges GTO calibrées.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">&gt; 10</td>
                  <td className="py-2 pr-4">Deep SPR</td>
                  <td className="py-2">Implied odds énormes, sets et flushes prime.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="SPR par ligne préflop">
          <p>Le SPR au flop dépend directement de l&apos;action préflop :</p>
          <ul className="list-disc pl-5">
            <li>Single raised pot (open + call BB) : pot ~5,5bb, stack ~97bb → SPR ~17</li>
            <li>3-bet pot IP : pot ~20bb, stack ~90bb → SPR ~4,5</li>
            <li>4-bet pot : pot ~50bb, stack ~75bb → SPR ~1,5</li>
            <li>5-bet all-in : SPR = 0</li>
          </ul>
        </SubSection>

        <KeyIdea>
          Anticipe le SPR dès le préflop. Un 3-bet transforme la nature du postflop : plus de
          set mining rentable, plus de suited connectors playable. C&apos;est pourquoi la
          construction des ranges préflop dépend du SPR postflop souhaité.
        </KeyIdea>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>C-bet fréquence dépend de la texture (dry high = 90%, wet = 30-50%).</li>
          <li>Petit sizing haute fréquence ≡ gros sizing basse fréquence en EV.</li>
          <li>Turn cards se classent : favorisent l&apos;agresseur ou le défenseur.</li>
          <li>River range = polarisation stricte : value + bluff, pas de mid.</li>
          <li>Bluff catcher : call si fréquence bluff estimée &gt; alpha du sizing.</li>
          <li>SPR gouverne la profondeur du jeu et dicte la range préflop optimale.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">
          Prochain cours : Exploitation et lecture d&apos;adversaires.
        </p>
      </div>
    </CourseLayout>
  )
}
