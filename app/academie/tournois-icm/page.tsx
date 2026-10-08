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
  { id: "differences", title: "Tournoi vs cash : différences fondamentales" },
  { id: "icm", title: "L'ICM (Independent Chip Model)" },
  { id: "bubble", title: "La bubble et le bubble factor" },
  { id: "push-fold", title: "Push/fold à short stack" },
  { id: "final-table", title: "Final table et deal negotiation" },
]

export default function TournoisICMCourse() {
  const meta = getCourseBySlug("tournois-icm")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-8 text-neutral-300 leading-relaxed">
        Le poker tournoi ajoute une couche stratégique absente en cash : le{" "}
        <strong>prize pool distribué</strong> non-linéairement. Tes jetons ne valent pas leur
        valeur nominale — ils valent leur valeur en $ selon leur position dans la structure de
        gains. Ce cours introduit l&apos;ICM, le bubble factor, et les décisions push/fold à
        short stack.
      </p>

      {/* ============================================================ */}
      <Section id="differences" title="1. Tournoi vs cash : différences fondamentales">
        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-2 pr-4">Aspect</th>
                <th className="text-left py-2 pr-4">Cash</th>
                <th className="text-left py-2">Tournoi</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Valeur d&apos;un jeton</td>
                <td className="py-2 pr-4">1 unit = 1 $ (constant)</td>
                <td className="py-2">Variable, dépend de position et prize pool</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Objectif</td>
                <td className="py-2 pr-4">Maximiser chip EV par main</td>
                <td className="py-2">Maximiser $EV (dollar EV) via ICM</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Structure</td>
                <td className="py-2 pr-4">Stack rechargeable, sans fin</td>
                <td className="py-2">Blindes croissantes, élimination progressive</td>
              </tr>
              <tr className="border-b border-neutral-800">
                <td className="py-2 pr-4">Variance</td>
                <td className="py-2 pr-4">Modérée (100bb/100 typique)</td>
                <td className="py-2">Extrême (peut atteindre 200-300%)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Skill edge</td>
                <td className="py-2 pr-4">Continue, chaque main</td>
                <td className="py-2">Concentré dans les moments-clé (bubble, FT)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubSection title="La règle du gain marginal">
          <p>
            En tournoi, gagner un jeton vaut moins en $ que perdre le même jeton, en raison de
            la distribution non-linéaire du prize pool. Deux joueurs de même stack qui
            all-in n&apos;ont pas la même EV en dollars, même si l&apos;équité en jetons est
            50/50.
          </p>
          <KeyIdea>
            En cash : chip EV = $ EV. En tournoi : chip EV ≠ $ EV. C&apos;est le fondement de
            toute l&apos;analyse tournoi.
          </KeyIdea>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="icm" title="2. L'ICM (Independent Chip Model)">
        <Definition term="ICM">
          modèle mathématique qui convertit la distribution des jetons entre joueurs en une
          distribution de $EV, en supposant que la probabilité de terminer 1er est
          proportionnelle à la part de jetons possédés.
        </Definition>

        <SubSection title="Formule d'ICM">
          <p>
            Pour un joueur i avec s_i jetons parmi n joueurs restants, la probabilité de finir
            1er :
          </p>
          <Formula>
            P(i finit 1er) = s_i / Σ s_j
          </Formula>
          <p>
            La probabilité de finir 2ème, 3ème, etc. se calcule récursivement en supposant
            qu&apos;un autre joueur j gagne d&apos;abord, puis en réappliquant la formule sur
            les joueurs restants.
          </p>
          <p>
            $EV_i = Σ P(i finit k) × prize_k pour toutes positions k payées.
          </p>
        </SubSection>

        <Example title="ICM simple à 3 joueurs à la bubble">
          <p>
            Prize pool : 1er = 500$, 2ème = 300$, 3ème = 200$ (total 1000$). Stacks : A=6000,
            B=3000, C=1000 (total 10000).
          </p>
          <p>P(A gagne) = 60%, P(B gagne) = 30%, P(C gagne) = 10%.</p>
          <p>P(A finit 2ème) = P(B gagne d&apos;abord) × P(A finit 1er des restants)</p>
          <ul className="list-disc pl-5">
            <li>P(B gagne) = 30%, restants A=6000/7000 → P(A 1er restant) = 6000/7000 = 85,7%</li>
            <li>P(C gagne) = 10%, restants A=6000/9000 → P(A 1er restant) = 66,7%</li>
            <li>P(A finit 2ème) = 0,30 × 0,857 + 0,10 × 0,667 = 0,257 + 0,067 = 0,324</li>
          </ul>
          <p>P(A finit 3ème) = 1 - 0,60 - 0,324 = 0,076</p>
          <Formula>
            $EV_A = 0,60 × 500 + 0,324 × 300 + 0,076 × 200 = 300 + 97,2 + 15,2 = <strong>412,4$</strong>
          </Formula>
          <p>
            A détient 60% des jetons mais seulement 41,2% du prize pool. Le &quot;chip EV
            équivalent&quot; sous-évalue la valeur des jetons quand tu es leader, et
            sur-évalue quand tu es short.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="bubble" title="3. La bubble et le bubble factor">
        <Definition term="Bubble">
          moment du tournoi où éliminer un joueur ferait basculer la structure de paiements.
          Avant la bubble, personne n&apos;a payé sa position ; après, tout le monde a un $
          minimum.
        </Definition>

        <Definition term="Bubble factor">
          rapport entre le $ perdu si tu perds un all-in et le $ gagné si tu gagnes. Un
          bubble factor de 1,5 signifie que perdre coûte 50% plus qu&apos;un gain.
        </Definition>

        <Formula>
          Bubble factor = |Δ$EV si perte| / |Δ$EV si victoire|
        </Formula>

        <SubSection title="Impact du bubble factor">
          <p>
            Un bubble factor de 1,5 signifie que ton equity minimum requise pour un all-in
            passe de 50% (chip EV neutre) à :
          </p>
          <Formula>
            equity_min = bubble_factor / (1 + bubble_factor) = 1,5 / 2,5 = 60%
          </Formula>
          <p>
            Il te faut 60% d&apos;equity pour équilibrer un call all-in en dollars. Résultat :
            ranges de call ultra-serrées à la bubble.
          </p>
        </SubSection>

        <Example title="Snap-fold AK vs shove à la bubble">
          <p>
            Tournoi 27 joueurs restants, 27 payés. Stacks moyens 15bb. Tu as AK avec 20bb,
            joueur médium-stack shove 15bb devant toi. Chip odds : tu dois payer 15bb pour un
            pot de ~32bb, soit 47% equity requis. AK a ~35-40% vs range de shove standard →
            call en chip EV.
          </p>
          <p>
            Mais bubble factor = 1,8 : ton equity requise devient 64%. AK est un fold. Le
            gain à passer la bubble ($ EV additionnel garanti) surpasse le gain marginal d&apos;un
            double-up.
          </p>
        </Example>

        <SubSection title="Exploiter les autres à la bubble">
          <p>
            Les joueurs mid-stack sont les plus rigides (ils veulent survivre). Les big
            stacks peuvent les <strong>bully</strong> avec shove/3-bet larges — ils fold à des
            equity requis très élevés.
          </p>
          <KeyIdea>
            En big stack à la bubble, ta range de shove/3-bet peut s&apos;élargir massivement
            contre les mid-stacks. Ton risque est asymétrique : tu perds peu (survivant en
            leader), tu gagnes beaucoup (élimines les autres).
          </KeyIdea>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="push-fold" title="4. Push/fold à short stack">
        <p>
          Sous 15bb, la stratégie converge vers <strong>shove ou fold</strong>. Le pot commis
          à un simple raise est trop élevé pour justifier autre chose. Les charts Nash (par
          exemple ceux dérivés de Sklansky-Chubukov) donnent l&apos;équilibre.
        </p>

        <SubSection title="Charts Nash de shove HU">
          <p>Ranges de shove &quot;équilibrées&quot; en heads-up all-in :</p>
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-2 pr-4">Stack</th>
                  <th className="text-left py-2 pr-4">Range shove SB vs BB</th>
                  <th className="text-left py-2">Range call BB vs SB shove</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">15bb</td>
                  <td className="py-2 pr-4">~30% (all pairs, Ax, KTs+)</td>
                  <td className="py-2">~14% (55+, ATs+, KJs+, AJo+)</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">10bb</td>
                  <td className="py-2 pr-4">~45% (all pairs, Ax, K7s+, K9o+)</td>
                  <td className="py-2">~22% (33+, A9s+, KTs+, ATo+)</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-2 pr-4">5bb</td>
                  <td className="py-2 pr-4">~70% (any pair, any A, KX, QT+)</td>
                  <td className="py-2">~40% (22+, A2+, KTs+, QJs, ATo+)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">3bb</td>
                  <td className="py-2 pr-4">~90% (fold uniquement pires offsuit)</td>
                  <td className="py-2">~60% (any pocket pair, any A, KX)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Push/fold contre position">
          <p>
            Les ranges de shove d&apos;autres positions se serrent en fonction du nombre de
            joueurs derrière (probabilité qu&apos;un joueur ait une main premium).
          </p>
        </SubSection>

        <KeyIdea>
          Les charts Nash sont mémorisables. À court stack, un pro exécute la stratégie
          d&apos;équilibre sans réfléchir : shove ou fold en 2 secondes. Le skill se joue plus
          haut, quand le stack est jouable postflop.
        </KeyIdea>
      </Section>

      {/* ============================================================ */}
      <Section id="final-table" title="5. Final table et deal negotiation">
        <SubSection title="Pay jumps à la final table">
          <p>
            La structure typique amplifie les paiements en fin de tournoi. À 9 joueurs
            restants, chaque élimination représente souvent 30-50% de gain en $EV pour les
            survivants.
          </p>
          <ul className="list-disc pl-5">
            <li>9ème → 8ème : +25% de $EV</li>
            <li>4ème → 3ème : +35%</li>
            <li>3ème → 2ème : +50%</li>
            <li>2ème → 1er : +80-100%</li>
          </ul>
          <p>
            Ces sauts justifient un <strong>ICM extrême</strong> : ranges de call encore plus
            serrées que la bubble générale.
          </p>
        </SubSection>

        <SubSection title="Deal ICM (négociation de gains)">
          <p>
            Quand les joueurs restants négocient un &quot;deal&quot; (partage du prize pool
            avant la fin), le calcul standard est basé sur l&apos;ICM :
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Calcul de chaque $EV via ICM.</li>
            <li>Chaque joueur reçoit son ICM $EV.</li>
            <li>Optionnellement, une part est laissée pour une compétition finale &quot;play for&quot;.</li>
          </ol>
          <p>
            Le deal ICM est mathématiquement équitable mais ignore le skill edge. Un pro
            devrait normalement refuser un deal ICM strict et demander une part supplémentaire
            reflétant son avantage postflop.
          </p>
        </SubSection>

        <Example title="Deal ICM à 3 joueurs">
          <p>Prize pool restant : 10 000$. Stacks : 40k / 30k / 30k. ICM $EV :</p>
          <ul className="list-disc pl-5">
            <li>Chip leader (40k) : ~4 000$</li>
            <li>Mid (30k) : ~3 000$</li>
            <li>Autre mid (30k) : ~3 000$</li>
          </ul>
          <p>
            Si les 3 acceptent un deal ICM strict, chacun reçoit son ICM $EV. Un pro chip
            leader pourrait argumenter pour 4 200$ (avec le mid stack acceptant 2 900$) en
            reconnaissance de son skill edge à jouer 3-max.
          </p>
        </Example>
      </Section>

      <div className="mt-16 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
        <p>
          <strong>Récapitulatif</strong> — À retenir :
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Chip EV ≠ $ EV en tournoi. C&apos;est le fondement de l&apos;analyse.</li>
          <li>ICM convertit stacks en $EV. P(1er) = s_i / Σ s_j (formule d&apos;entrée).</li>
          <li>Bubble factor = |Δ$ perte| / |Δ$ gain|. Élève l&apos;equity requise pour call all-in.</li>
          <li>Bully les mid-stacks en tant que big stack à la bubble (asymétrie).</li>
          <li>Push/fold sous 15bb selon charts Nash (mémorisables).</li>
          <li>Final table : ICM extrême. Deal négocié à partir du $EV ICM.</li>
        </ul>
        <p className="mt-4 italic text-neutral-500">Prochain cours : Mental game et bankroll.</p>
      </div>
    </CourseLayout>
  )
}
