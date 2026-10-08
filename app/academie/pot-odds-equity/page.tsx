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
  { id: "framework", title: "Le framework EV pour une décision de call" },
  { id: "types-cotes", title: "Direct, implied et reverse implied odds" },
  { id: "equity-vs-range", title: "Equity vs une range (pas vs une main)" },
  { id: "drawing", title: "Drawing hands : outs et probabilités" },
  { id: "breakeven", title: "Break-even math face à une mise" },
  { id: "mdf", title: "MDF — Minimum Defense Frequency" },
]

export default function PotOddsCourse() {
  const meta = getCourseBySlug("pot-odds-equity")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Chaque call, chaque fold, chaque raise repose sur un même calcul : mon equity dans le
        pot est-elle supérieure à la cote que l&apos;adversaire m&apos;offre ? Ce cours
        approfondit le framework EV vu au cours 1, ajoute les concepts de{" "}
        <strong>implied odds</strong>, <strong>reverse implied odds</strong>, et introduit la{" "}
        <strong>MDF</strong>, l&apos;outil défensif qui limite l&apos;exploitation par
        surbluff.
      </p>

      {/* ============================================================ */}
      <Section id="framework" title="1. Le framework EV pour une décision de call">
        <p>
          Face à une mise adverse, tu as 3 options : fold, call, raise. Chacune a une EV.
          L&apos;option optimale est celle avec l&apos;EV maximale (règle max EV).
        </p>

        <Formula>
          EV_fold = 0 (par définition — tu ne gagnes ni ne perds rien de plus)
        </Formula>

        <Formula>
          EV_call = equity × (pot + bet_adv + bet_call) - bet_call
        </Formula>

        <p>
          Où <code className="bg-neutral-800 px-1 rounded">equity</code> est ton pourcentage
          moyen de victoire à la showdown après call, <code className="bg-neutral-800 px-1 rounded">
            pot
          </code>{" "}
          le pot avant la mise adverse, <code className="bg-neutral-800 px-1 rounded">bet_adv</code>{" "}
          sa mise, et <code className="bg-neutral-800 px-1 rounded">bet_call</code> ce que tu
          dois payer.
        </p>

        <SubSection title="Condition de call rentable">
          <p>
            Call est +EV si <code>EV_call &gt; 0</code>. En dénormalisant, on obtient la
            condition d&apos;equity minimum :
          </p>
          <Formula>
            equity_min = bet_call / (pot + bet_adv + bet_call)
          </Formula>
          <p>
            C&apos;est exactement la formule des <strong>pot odds</strong> vue au cours 1. On
            l&apos;étend maintenant en tenant compte des streets à venir.
          </p>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="types-cotes" title="2. Direct, implied et reverse implied odds">
        <SubSection title="Direct pot odds">
          <p>
            Les cotes offertes immédiatement par la mise adverse. Ne prend en compte que le pot
            actuel + sa mise.
          </p>
        </SubSection>

        <SubSection title="Implied odds">
          <Definition term="Implied odds">
            gains espérés supplémentaires aux streets suivantes si tu touches ta main. Se
            calculent comme un multiplicateur du stack restant × probabilité de toucher × %
            payé par l&apos;adversaire.
          </Definition>

          <Formula>
            Implied gain espéré = P(touche) × stack_restant × P(payé après avoir touché)
          </Formula>

          <Example title="Set mining approfondi">
            <p>
              Tu as 22 en BTN, CO open à 3bb, tu es seul. Stack 100bb effectif restant. Tu dois
              payer 3bb dans un pot qui fera 7,5bb après call (3 open + 3 call + 1,5 blindes).
            </p>
            <p>Direct pot odds : 3 / 10,5 ≈ 28,6%. Ton equity vs sa range ~15%. Négatif direct.</p>
            <p>Implied odds :</p>
            <ul className="list-disc pl-5">
              <li>P(set au flop) = 11,76%</li>
              <li>Quand tu touches, tu gagnes en moyenne ~40bb supplémentaires (pas 97bb : il fold souvent turn si tu bets fort)</li>
              <li>EV supplémentaire ≈ 0,1176 × 40 = 4,7bb</li>
            </ul>
            <Formula>
              EV_call = (equity_direct × pot - bet) + implied_gain <br />
              EV_call ≈ (0,15 × 7,5 - 3) + 4,7 ≈ -1,87 + 4,7 = <strong>+2,83bb</strong>
            </Formula>
          </Example>
        </SubSection>

        <SubSection title="Reverse implied odds">
          <Definition term="Reverse implied odds">
            pertes espérées additionnelles quand tu touches une main de force moyenne qui te
            fait payer des streets où tu perds. C&apos;est le <em>négatif</em> des implied
            odds.
          </Definition>

          <Example title="KJo en BB vs UTG open">
            <p>
              KJo call en BB face à UTG open. Sur un flop K♠8♥3♦, tu as top pair kicker
              moyen. Mais la range UTG est déjà top-heavy : AK, AA, KK, QQ dominent ton kicker.
            </p>
            <ul className="list-disc pl-5">
              <li>Quand il continue à bet flop + turn + river, tes gains showdown sont faibles (souvent battu).</li>
              <li>Quand il check-fold, tu ne gagnes que le pot de départ, pas plus.</li>
            </ul>
            <p>
              Résultat : tu réalises ~65% de ton equity théorique. C&apos;est la reverse
              implied odds — ta main moyenne extrait mal de la value et perd fort quand elle
              perd.
            </p>
          </Example>

          <KeyIdea>
            Les mains à forte implied odds : petites paires, suited connectors, suited aces
            (peuvent tuer un stack). Les mains à reverse implied odds : gros kickers dominés,
            top pair faible OOP. Le kicker et la position sont les 2 variables clés.
          </KeyIdea>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="equity-vs-range" title="3. Equity vs une range (pas vs une main)">
        <p>
          Ton equity n&apos;est jamais &quot;ton pourcentage vs sa main précise&quot; — tu ne
          la connais pas. C&apos;est le <strong>weighted average</strong> vs tous les combos
          possibles de sa range, pondérés par leur probabilité relative.
        </p>

        <Formula>
          equity(main vs range) = Σ (poids_i × equity(main vs main_i)) / Σ poids_i
        </Formula>

        <Example title="TT vs range 3-bet BB standard">
          <p>
            BB 3-bet range vs BTN open : <code>QQ+, AK, AQs, A5s, KQs, 76s</code>. Décomposition :
          </p>
          <ul className="list-disc pl-5">
            <li>QQ (6 combos) : TT a 19%</li>
            <li>KK (6) : TT a 19%</li>
            <li>AA (6) : TT a 19%</li>
            <li>AK (16 combos AKs+AKo) : TT a 55%</li>
            <li>AQs (4) : TT a 55%</li>
            <li>A5s (4) : TT a 55%</li>
            <li>KQs (4) : TT a 55%</li>
            <li>76s (4) : TT a 55%</li>
          </ul>
          <Formula>
            Equity = (6+6+6)×0,19 + (16+4+4+4+4)×0,55 = 3,42 + 17,6 = 21,02 <br />
            Total combos = 50 <br />
            Equity moyen = 21,02 / 50 = <strong>42%</strong>
          </Formula>
          <p>
            Face à un 4-bet all-in avec ~35% pot odds, TT devient un fold (42% suffit pour
            call, sauf que le 4-bet range est plus tight que la 3-bet range — voir cours 5).
          </p>
        </Example>

        <SubSection title="Outils de calcul">
          <p>
            En dehors de la table, on utilise <strong>PokerStove</strong>, <strong>Equilab</strong>,
            ou intégré aux solvers modernes (<strong>PioSolver</strong>,{" "}
            <strong>GTOWizard</strong>). À la table, tu apprends les equity types par cœur :
          </p>
          <ul className="list-disc pl-5">
            <li>Overpair vs underpair : 80/20</li>
            <li>Deux overcards vs paire moyenne : 45/55 (coinflip approx)</li>
            <li>Set vs top pair : 90/10</li>
            <li>Flush draw + gutshot vs overpair : 40/60</li>
          </ul>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="drawing" title="4. Drawing hands : outs et probabilités">
        <Definition term="Outs">
          nombre de cartes non vues qui améliorent ta main pour la rendre gagnante.
        </Definition>

        <SubSection title="Comptage des outs par type de tirage">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Tirage</th>
                  <th className="text-left py-2 pr-4">Outs</th>
                  <th className="text-left py-2">P(turn ou river)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Flush draw</td>
                  <td className="py-2 pr-4">9</td>
                  <td className="py-2">35%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Open-ended straight draw</td>
                  <td className="py-2 pr-4">8</td>
                  <td className="py-2">31,5%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Gutshot</td>
                  <td className="py-2 pr-4">4</td>
                  <td className="py-2">16,5%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Flush + open-ended</td>
                  <td className="py-2 pr-4">15</td>
                  <td className="py-2">54,1%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">Two overcards</td>
                  <td className="py-2 pr-4">6</td>
                  <td className="py-2">24,1%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Set → full house/quads</td>
                  <td className="py-2 pr-4">7</td>
                  <td className="py-2">27,8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Règle des 2 et 4 (rappel)">
          <Formula>
            P(toucher) ≈ 4 × outs (2 cartes à venir) <br />
            P(toucher) ≈ 2 × outs (1 carte à venir)
          </Formula>
          <p>Précision : ±2% jusqu&apos;à 10 outs, moins bonne au-delà.</p>
        </SubSection>

        <SubSection title="Outs discountés">
          <KeyIdea>
            Tous les outs ne sont pas égaux. Un flush draw sur un board 3-liné avec paire (ex :
            J♠J♥8♠) a des outs discountés : si l&apos;adversaire a un full house ou un set, ton
            flush ne bat rien. Compte <em>uniquement</em> les outs qui te donnent la meilleure
            main.
          </KeyIdea>

          <Example title="Discount des outs">
            <p>
              Tu as A♣2♣ sur K♠Q♣5♣. Adversaire bet fort. Sa range typique inclut sets, KQ, AA.
              9 outs flush... mais si sa range est {`{KQ, sets}`}, un flush te donne le nut mais
              seulement 8 outs sûrs (le K♣ complète le flush mais lui donne peut-être quads/full
              house). Compte 8 au lieu de 9.
            </p>
          </Example>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="breakeven" title="5. Break-even math face à une mise">
        <p>
          À la river, la décision est binaire : fold ou call (raise étant traité séparément).
          La break-even equity est simple, la question est <em>ton estimation d&apos;equity vs
          sa range</em>.
        </p>

        <Formula>
          equity_min = coût_call / (pot + coût_call) où pot = pot_avant + bet_adv
        </Formula>

        <SubSection title="Bet sizes standards et equity min">
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Sizing (% pot)</th>
                  <th className="text-left py-2 pr-4">Equity min requise</th>
                  <th className="text-left py-2">Ratio value/bluff optimal</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">25%</td>
                  <td className="py-2 pr-4">16,7%</td>
                  <td className="py-2">5:1</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">33%</td>
                  <td className="py-2 pr-4">20%</td>
                  <td className="py-2">4:1</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">50%</td>
                  <td className="py-2 pr-4">25%</td>
                  <td className="py-2">3:1</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">66%</td>
                  <td className="py-2 pr-4">28,6%</td>
                  <td className="py-2">5:2</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">100% (pot)</td>
                  <td className="py-2 pr-4">33,3%</td>
                  <td className="py-2">2:1</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">150% (overbet)</td>
                  <td className="py-2 pr-4">37,5%</td>
                  <td className="py-2">5:3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="mdf" title="6. MDF — Minimum Defense Frequency">
        <Definition term="MDF (Minimum Defense Frequency)">
          fréquence minimale à laquelle tu dois continuer (call ou raise) face à une mise pour
          empêcher l&apos;adversaire d&apos;être auto-profitable en bluffant n&apos;importe
          quoi.
        </Definition>

        <Formula>
          MDF = pot_avant_bet / (pot_avant_bet + bet)
        </Formula>

        <p>
          Autre formulation équivalente : MDF = 1 - alpha, où alpha = bet / (pot + bet) est la
          fréquence de bluff auto-profitable.
        </p>

        <SubSection title="Interprétation">
          <p>
            Si tu defends moins que la MDF, tu offres à l&apos;adversaire une opportunité
            d&apos;exploiter en bluffant plus que la fréquence normale. Il peut alors bluffer
            avec des mains random et gagner à long terme.
          </p>
          <p>
            La MDF est une notion <strong>défensive</strong>, pas offensive. Elle définit un
            plancher, pas un objectif.
          </p>
        </SubSection>

        <Example title="MDF pour différentes tailles de bet">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Sizing</th>
                  <th className="text-left py-2 pr-4">MDF</th>
                  <th className="text-left py-2">Alpha (fréq de bluff auto-profitable)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">33%</td>
                  <td className="py-2 pr-4">75%</td>
                  <td className="py-2">25%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">50%</td>
                  <td className="py-2 pr-4">66,7%</td>
                  <td className="py-2">33,3%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">75%</td>
                  <td className="py-2 pr-4">57,1%</td>
                  <td className="py-2">42,9%</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">100% (pot)</td>
                  <td className="py-2 pr-4">50%</td>
                  <td className="py-2">50%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">200%</td>
                  <td className="py-2 pr-4">33,3%</td>
                  <td className="py-2">66,7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Example>

        <SubSection title="Limites de la MDF">
          <p>
            La MDF suppose que ton adversaire peut bluffer <strong>librement</strong> avec
            n&apos;importe quelle main. En pratique, sa capacité de bluff est bornée par sa
            range et par le nombre de bluffs disponibles.
          </p>
          <p>
            Face à un adversaire qui <em>ne bluffe pas</em> (ou peu), tu peux fold bien
            au-dessous de la MDF sans être exploitable. La MDF est une prescription
            GTO/défensive ; l&apos;exploitation est une stratégie offensive qui déroge à la
            MDF quand la situation le justifie.
          </p>
          <KeyIdea>
            MDF = ce que tu <em>dois</em> defend pour ne pas être exploité. Face à un joueur
            réel qui sur- ou sous-bluff, tu joues au-dessus ou en dessous, selon la lecture.
          </KeyIdea>
        </SubSection>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>EV_call = equity × (pot après call) - coût du call. Décision optimale = max EV.</li>
          <li>Direct pot odds ≠ implied odds ≠ reverse implied odds. Position et kicker font la différence.</li>
          <li>Ton equity se calcule vs range, jamais vs main.</li>
          <li>Règle des 2 et 4 pour convertir outs → probas.</li>
          <li>Discount tes outs quand ils ne te donnent pas la best hand.</li>
          <li>MDF = 1 - (bet / (pot + bet)). Plancher défensif, à ajuster en exploitation.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">Prochain cours : GTO fondamentaux.</p>
      </div>
    </CourseLayout>
  )
}
