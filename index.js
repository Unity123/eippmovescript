var gens = undefined;
var gen = undefined;

// These species are unobtainable outside of their own generations, but @pkmn/dex doesn't contain
// the artificial 'natDexTier' field which allows Pokémon Showdown to track this so we harcode it.
// If using @pkmn/sim instead, this list can be replaced with a `d.natDexTier !== 'Illegal'` check.
const NATDEX_UNOBTAINABLE_SPECIES = [
    'Eevee-Starter', 'Floette-Eternal', 'Pichu-Spiky-eared', 'Pikachu-Belle', 'Pikachu-Cosplay',
    'Pikachu-Libre', 'Pikachu-PhD', 'Pikachu-Pop-Star', 'Pikachu-Rock-Star', 'Pikachu-Starter',
    'Eternatus-Eternamax',
  ];
  
  const NATDEX_EXISTS = (d, g) => {
    // The "National Dex" rules only apply to gen 8+, but this ExistsFn gets called on all generations
    if (g < 8) return Generations.DEFAULT_EXISTS(d, g);
    // These checks remain unchanged from the default existence filter
    if (!d.exists) return false;
    if (d.kind === 'Ability' && d.id === 'noability') return false;
    // "National Dex" rules allows for data from the past, but not other forms of nonstandard-ness
    if ('isNonstandard' in d && d.isNonstandard && d.isNonstandard !== 'Past') return false;
    // Unlike the check in the default existence function we don't want to filter the 'Illegal' tier
    if ('tier' in d && d.tier === 'Unreleased') return false;
    // Filter out the unobtainable species
    if (d.kind === 'Species' && NATDEX_UNOBTAINABLE_SPECIES.includes(d.name)) return false;
    // Nonstandard items other than Z-Crystals and Pokémon-specific items should be filtered
    return !(d.kind === 'Item' && ['Past', 'Unobtainable'].includes(d.isNonstandard) &&
      !d.zMove && !d.itemUser && !d.forcedForme);
  }

function init() {
    gens = new pkmn.data.Generations(pkmn.dex.Dex, NATDEX_EXISTS);
    gen = gens.get(9);
    $("#input-data").submit(function (event) {
        event.preventDefault();
        getLearnset();
    });
}

async function getLearnset() {
    var learn = await gen.learnsets.all(gen.species.get($("#pokemon").val()));
    for await (var set of learn) {
        console.log(set);
        if (set.learnset) {
            var learnset = Object.keys(set.learnset);
            console.log(learnset);
            for (var move of learnset) {
                console.log(move);
                $("#moves").append(move + "\n");
            }
        }
    }
}

$(document).ready(init);