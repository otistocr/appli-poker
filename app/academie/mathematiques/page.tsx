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
  { id: "combinatoire", title: "D'où viennent les 169 mains" },
  { id: "probas", title: "Les probas qu'on utilise vraiment" },
  { id: "cotes", title: "Les cotes du pot, sans mystique" },
  { id: "ev", title: "L'EV, la seule vraie boussole" },
  { id: "equity", title: "Equity et fold equity" },
  { id: "variance", title: "La variance, et pourquoi elle t'en veut pas" },
]

export default function MathematiquesCourse() {
  const meta = getCourseBySlug("mathematiques")!

  return (
    <CourseLayout meta={meta} toc={TOC}>
      <p className="mb-10 text-[color:var(--text-secondary)] leading-[1.75]">
        Tout ce qu&apos;on fait au poker repose sur trois choses : la probabilité qu&apos;un
        événement arrive, la valeur moyenne d&apos;une décision, et l&apos;écart entre ce
        que la moyenne dit et ce que tu vois sur une session. Ce cours te donne les outils
        pour raisonner sur les trois. Rien de plus, rien de moins.
      </p>

      {/* ============================================================ */}
      <Section id="combinatoire" title="D'où viennent les 169 mains">
        <p>
          Un jeu, cinquante-deux cartes, tu en reçois deux. Combien de manières de te faire
          servir ta main de départ ? Le calcul se fait avec une combinaison : deux cartes
          parmi cinquante-deux, l&apos;ordre n&apos;a pas d&apos;importance.
        </p>

        <Formula>C(52, 2) = 52! / (2! × 50!) = 1 326</Formula>

        <p>
          Mille trois cent vingt-six mains distinctes. Sauf que du point de vue de la
          décision préflop, jouer A♠K♦ ou A♥K♣ ne change rien : deux couleurs
          dépareillées, un as et un roi. Pareil pour les paires suited. On se retrouve donc
          avec seulement <strong>169 mains stratégiquement différentes</strong>, celles que
          tu vois dans une grille 13×13.
        </p>

        <p>Cette décomposition matérialise trois familles :</p>

        <div className="my-5 space-y-3 pl-4 border-l" style={{ borderColor: "var(--border)" }}>
          <p>
            <strong>Les paires</strong>. Il y en a treize (AA, KK, ..., 22). Chacune existe
            en six versions différentes (A♠A♥, A♠A♦, A♠A♣, A♥A♦, A♥A♣, A♦A♣). Total : 78
            combos.
          </p>
          <p>
            <strong>Les mains suited</strong> (assorties). Soixante-dix-huit variantes, quatre
            combos chacune (une par couleur). Total : 312 combos.
          </p>
          <p>
            <strong>Les mains offsuit</strong> (dépareillées). Soixante-dix-huit variantes,
            douze combos chacune. Total : 936 combos.
          </p>
        </div>

        <p>78 + 312 + 936 = 1 326. On retombe sur nos pieds.</p>

        <KeyIdea>
          Un adversaire qui &quot;joue AK&quot; ne veut rien dire tant que tu ne précises pas :
          AKs représente quatre combos, AKo en représente douze. Trois fois plus. C&apos;est
          en <em>combos</em> qu&apos;on compte une range, pas en mains abstraites.
        </KeyIdea>

        <p>
          Prenons un adversaire qui 4-bet uniquement AA, KK, QQ et AKs. Sa range fait
          6+6+6+4 = 22 combos sur les 1 326 possibles. À peine 1,66 % de son range de
          départ. Cette rareté explique pourquoi un 4-bet préflop annonce presque toujours
          la couleur.
        </p>
      </Section>

      {/* ============================================================ */}
      <Section id="probas" title="Les probas qu'on utilise vraiment">
        <p>
          Trois calculs suffisent à couvrir 90 % des situations : la probabilité qu&apos;on
          reçoive une main donnée, celle qu&apos;on améliore au flop avec une paire en main,
          et celle qu&apos;on complète un tirage.
        </p>

        <SubSection title="Recevoir une main précise">
          <p>AA arrive une fois toutes les 221 mains :</p>
          <Formula>P(AA) = 6 / 1 326 = 1 / 221 ≈ 0,45 %</Formula>
          <p>
            À trente mains par heure en live, ça fait une paire d&apos;as par session d&apos;à
            peu près sept heures. Si tu as l&apos;impression de ne jamais la voir, ce
            n&apos;est pas de la malchance : c&apos;est rare.
          </p>
          <p>
            Recevoir n&apos;importe quelle paire : 78 combos, donc 5,88 % du temps (une fois
            sur dix-sept environ). Recevoir n&apos;importe quelle main suited : 23,5 %.
          </p>
        </SubSection>

        <SubSection title="Toucher un set avec sa paire">
          <p>
            Tu as 77 preflop. Au flop, trois cartes sortent. Quelle est la probabilité
            qu&apos;au moins un des sept restants apparaisse ? On calcule l&apos;inverse — la
            probabilité de <em>ne pas</em> toucher — puis on soustrait de un.
          </p>
          <Formula>
            P(pas de set) = (48/50) × (47/49) × (46/48) ≈ 88,24 %
          </Formula>
          <Formula>
            P(set au flop) ≈ 11,76 %, soit environ une fois sur huit et demi
          </Formula>
          <p>
            Ce onze-virgule-sept est la base du &quot;set mining&quot; : payer un raise
            préflop avec une petite paire est rentable si tu peux gagner beaucoup quand tu
            touches. On y revient dans la section suivante avec les implied odds.
          </p>
        </SubSection>

        <SubSection title="Compléter une couleur">
          <p>
            Tu as A♥5♥, le flop montre deux autres cœurs. Il te reste neuf cœurs dans les
            quarante-sept cartes non vues. Pour la turn :
          </p>
          <Formula>P(couleur turn) = 9 / 47 ≈ 19,15 %</Formula>
          <p>Pour le river en cumulé (si la turn n&apos;a rien donné) :</p>
          <Formula>P(couleur turn ou river) ≈ 34,97 %</Formula>
          <p>
            À la table, tu n&apos;auras jamais ta calculette. On utilise la règle des 2 et 4 :
            approximer la probabilité de toucher en multipliant les outs par 2 pour une
            seule street à venir, par 4 pour deux streets.
          </p>
          <Formula>9 outs × 4 = 36 % (vs. 34,97 % exact). Suffisamment précis.</Formula>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="cotes" title="Les cotes du pot, sans mystique">
        <p>
          Les pot odds répondent à une question simple : combien tu risques par rapport à
          ce que tu peux gagner. Elles définissent le pourcentage minimum de victoire dont
          tu as besoin pour que ton call soit rentable en moyenne.
        </p>

        <Definition term="Pot odds">
          rapport entre ce que tu dois payer et la taille totale du pot une fois ton call
          effectué.
        </Definition>

        <Formula>
          equity minimum = coût du call / (pot + coût du call)
        </Formula>

        <p>
          Ton adversaire mise 50 dans un pot de 100. Tu dois payer 50 pour continuer. Après
          ton call, il y aura 200 dans le pot. Ta cote est de 50 sur 200, soit 25 %. Tu as
          besoin d&apos;un peu plus de 25 % d&apos;equity vs sa range pour que le call soit
          rentable à long terme. Point.
        </p>

        <SubSection title="Le ratio, si tu préfères">
          <p>
            Certains joueurs parlent en cotes plutôt qu&apos;en pourcentage. La conversion se
            fait naturellement :
          </p>
          <Formula>Ratio n:1 → 1/(n+1) en pourcentage</Formula>
          <p>
            Trois contre un font vingt-cinq pour cent. Deux contre un font trente-trois. Peu
            importe la notation, c&apos;est le même chiffre.
          </p>
        </SubSection>

        <SubSection title="Les implied odds : quand le pot va grossir">
          <Definition term="Implied odds">
            argent que tu <em>vas gagner</em> aux streets suivantes si tu touches ta main.
            Ils s&apos;ajoutent au pot actuel pour former une cote effective plus généreuse.
          </Definition>

          <Example title="Le set mining, chiffré">
            <p>
              Tu es en BB avec 77. UTG open 3bb, tu es seul contre lui. Il te reste 2bb à
              mettre, et le pot après ton call fera 6,5bb. La cote directe : 2 sur 8,5, soit
              23,5 %. Ton equity vs sa range d&apos;open est d&apos;environ 18 %. Sur le
              papier, call -EV.
            </p>
            <p>
              Sauf que 11,76 % du temps, tu touches un set. Et quand tu le fais, tu peux
              souvent lui prendre 40bb supplémentaires en moyenne (pas 97 : il fold à la turn
              si tu bets fort). Ces gains futurs transforment la décision :
            </p>
            <Formula>
              EV ≈ (equity directe × pot - call) + implied gain <br />
              EV ≈ (0,18 × 8,5 - 2) + 0,1176 × 40 ≈ +4,2bb
            </Formula>
            <p>
              Le call devient nettement rentable — pas grâce au pot actuel, mais grâce à ce
              qui vient après. C&apos;est toute la différence entre pot odds et implied
              odds.
            </p>
          </Example>
        </SubSection>
      </Section>

      {/* ============================================================ */}
      <Section id="ev" title="L'EV, la seule vraie boussole">
        <Definition term="EV (espérance mathématique)">
          moyenne pondérée des résultats d&apos;une décision, chaque résultat pesé par sa
          probabilité. C&apos;est la seule métrique valide pour évaluer un choix.
        </Definition>

        <Formula>EV = Σ (probabilité × résultat)</Formula>

        <p>
          Une décision est +EV si elle rapporte à long terme, -EV sinon. Le résultat
          d&apos;une main isolée est du bruit ; l&apos;espérance sur mille mains est le
          signal. Tout l&apos;enjeu du poker est de prendre des décisions +EV et
          d&apos;accepter que les résultats à court terme ne les reflètent pas toujours.
        </p>

        <Example title="AA contre AK all-in preflop">
          <p>Stacks de 100bb, pot de 200bb. AA est favori à 88 % contre AK.</p>
          <Formula>EV = 0,88 × 100 + 0,12 × (-100) = +76bb par all-in</Formula>
          <p>
            Chaque fois que tu joues cette situation, tu gagnes 76bb en moyenne. Tu peux
            perdre cinq fois d&apos;affilée par malchance — c&apos;est parfaitement
            possible. Sur cent occurrences, tu vas gagner autour de 7 600bb. C&apos;est le
            signal.
          </p>
        </Example>

        <Example title="Un bluff avec de la fold equity">
          <p>
            River, pot à 100$, tu as zéro equity showdown. Tu bluffs 60$. Tu penses
            qu&apos;il fold la moitié du temps.
          </p>
          <Formula>EV = 0,50 × 100 + 0,50 × (-60) = +20$</Formula>
          <p>
            Positif. Le bluff est rentable même s&apos;il rate la moitié du temps. La
            question quand tu envisages un bluff n&apos;est pas &quot;est-ce qu&apos;il va
            fold ?&quot; mais &quot;combien de fois doit-il fold pour que ce soit
            neutre ?&quot;. Réponse :
          </p>
          <Formula>fold% minimum = bet / (pot + bet) = 60 / 160 = 37,5 %</Formula>
          <p>
            Tant que tu penses qu&apos;il fold plus de 37,5 % du temps, ton bluff est +EV.
            Dans notre exemple à 50 %, tu es largement au-dessus du seuil.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="equity" title="Equity et fold equity">
        <p>
          L&apos;equity, c&apos;est ta part moyenne du pot si toutes les cartes tombaient et
          qu&apos;on comptait. La fold equity, c&apos;est la valeur additionnelle que tu
          crées en faisant folder l&apos;adversaire. Les deux se combinent quand tu bets ou
          raise.
        </p>

        <Formula>
          EV d&apos;une mise = fold% × pot + call% × (equity × pot final - coût de la mise)
        </Formula>

        <Example title="Le semi-bluff qui a l'air borderline mais qui gagne">
          <p>
            Tu as un tirage couleur à la turn : neuf outs, environ 19,6 % de toucher au
            river. Pot à 100$, tu bets 75$. L&apos;adversaire fold 40 % du temps.
          </p>
          <Formula>
            EV = 0,40 × 100 + 0,60 × (0,196 × 250 - 75) <br />
            EV = 40 + 0,60 × (-26) ≈ +24,4$
          </Formula>
          <p>
            La mise est rentable de 24,4$ en moyenne. Sans equity showdown, il te faudrait
            42,8 % de fold pour breakeven. Avec 19,6 % d&apos;equity en réserve, le seuil
            chute significativement. C&apos;est ce que le semi-bluff apporte : tu combines
            deux sources d&apos;EV, ce qui te permet de bluffer dans des spots où un bluff
            &quot;pur&quot; serait à peine rentable.
          </p>
        </Example>
      </Section>

      {/* ============================================================ */}
      <Section id="variance" title="La variance, et pourquoi elle t'en veut pas">
        <p>
          Le poker distribue ses gains sur un long horizon. Sur une session de trois heures,
          ce que tu vois n&apos;a presque rien à voir avec ce que tu gagnes en moyenne. La
          variance est la mesure statistique de cet écart, et elle est <em>mathématiquement
          garantie</em> — pas une fatalité, juste la nature du jeu.
        </p>

        <p>
          En cash game NLHE 6-max, un joueur solide a un écart-type d&apos;environ 100
          bb/100 mains. Ce qui signifie que sur cent mains, ton résultat oscille dans une
          fourchette de plus ou moins cent grosses blindes autour de ton vrai winrate. Sur
          cent mains, la variance est vingt fois plus grande que le signal. Autant dire que
          rien de ce qui se passe sur une session courte ne t&apos;apprend quoi que ce soit
          de fiable sur ton niveau.
        </p>

        <SubSection title="Downswings, sans mélodrame">
          <p>
            Un joueur gagnant à 5 bb/100 avec un écart-type de 100 va subir, en moyenne, des
            downswings d&apos;environ mille mains à perte. C&apos;est un ordre de grandeur
            approximatif :
          </p>
          <Formula>Downswing typique ≈ σ² / (2 × winrate) mains</Formula>
          <p>
            Avec σ = 100 et winrate = 5, on obtient 1 000 mains. Rien d&apos;anormal :
            c&apos;est ce que la stat prédit.
          </p>
        </SubSection>

        <SubSection title="La bankroll comme oxygène">
          <p>
            Pour absorber cette variance sans faire faillite, il te faut une bankroll
            proportionnelle. Les règles empiriques :
          </p>
          <div className="my-4 pl-4 border-l" style={{ borderColor: "var(--border)" }}>
            <p>Cash NLHE 6-max : 25 à 50 buy-ins (un buy-in = 100bb).</p>
            <p>MTT low-buy-in : 100 à 200 buy-ins.</p>
            <p>Spin & Go et autres jackpots : 200 buy-ins minimum, souvent plus.</p>
          </div>
          <p>
            La bankroll n&apos;est pas un score, c&apos;est un outil pour survivre à la
            variance sans que ta psychologie n&apos;interfère. Un pro qui joue nl100 avec 25
            buy-ins vit avec un stress différent d&apos;un pro qui joue nl100 avec 100
            buy-ins. Le premier est plus exposé au tilt.
          </p>
        </SubSection>

        <KeyIdea>
          La variance n&apos;est pas de la malchance, ni de la punition cosmique. C&apos;est
          la façon dont un jeu à information imparfaite distribue ses résultats. Un bon
          joueur perd 30 à 40 % de ses sessions même en jouant parfaitement. La différence
          entre un pro et un joueur qui &quot;fait des breakevens&quot; ne se joue pas là,
          elle se joue sur des dizaines de milliers de mains.
        </KeyIdea>
      </Section>

      <div
        className="mt-24 pt-6 border-t text-sm text-[color:var(--text-muted)]"
        style={{ borderColor: "var(--border)" }}
      >
        <p>Ce qu&apos;il faut retenir, en une respiration :</p>
        <p className="mt-3 text-[color:var(--text-secondary)] leading-relaxed">
          Mille trois cent vingt-six combos, 169 mains distinctes. On compte en combos. Les
          pot odds définissent l&apos;equity minimum pour un call, l&apos;EV définit tout
          le reste. Un bluff est rentable si l&apos;adversaire fold plus que
          bet/(pot+bet). La variance est mathématique et prévisible, la bankroll est ton
          coussin. Le prochain cours parle de la position, qui vaut plus cher que tout ce
          qu&apos;on vient de voir.
        </p>
      </div>
    </CourseLayout>
  )
}
